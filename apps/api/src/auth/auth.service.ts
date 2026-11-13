import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
  NotFoundException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto): Promise<AuthResponseDto> {
    if (!dto.ageConfirmed) {
      throw new BadRequestException('El usuario debe certificar que es mayor de 18 años (+18).');
    }
    if (!dto.termsAccepted) {
      throw new BadRequestException('Es obligatorio aceptar los Términos y Políticas de Juego Responsable.');
    }

    // Check if user already exists
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });
    if (existing) {
      throw new ConflictException('Ya existe una cuenta registrada con este correo electrónico.');
    }

    // Ensure country exists
    const country = await this.prisma.country.upsert({
      where: { code: dto.countryCode.toUpperCase() },
      update: {},
      create: {
        code: dto.countryCode.toUpperCase(),
        name: dto.countryCode.toUpperCase() === 'MX' ? 'México' : 'Haïti',
        currency: dto.countryCode.toUpperCase() === 'MX' ? 'MXN' : 'HTG',
        defaultLocale: dto.countryCode.toUpperCase() === 'MX' ? 'es' : 'fr',
        realMoneyAllowed: false,
        regulatoryBody: dto.countryCode.toUpperCase() === 'MX' ? 'SEGOB' : 'LEH',
      },
    });

    // Ensure player role exists
    const playerRole = await this.prisma.role.upsert({
      where: { name: 'PLAYER' },
      update: {},
      create: {
        name: 'PLAYER',
        description: 'Usuario jugador estándar en modalidad demo simulada',
      },
    });

    // Create user and all associated financial records in an atomic transaction
    const newUser = await this.prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: dto.email.toLowerCase(),
          countryId: country.id,
          roleId: playerRole.id,
          isActive: true,
        },
      });

      // 2. Create Profile
      await tx.profile.create({
        data: {
          userId: user.id,
          firstName: dto.name ? dto.name.split(' ')[0] : 'Jugador',
          lastName: dto.name && dto.name.split(' ').length > 1 ? dto.name.split(' ').slice(1).join(' ') : 'Demo',
          preferredLocale: country.defaultLocale,
        },
      });

      // 3. Create User Ledger Account
      const ledgerAccount = await tx.ledgerAccount.create({
        data: {
          code: `WALLET_DEMO_${user.id}`,
          accountType: 'LIABILITY',
          currency: country.currency,
          balance: new Decimal(10000.0),
        },
      });

      // 4. Create Demo Wallet
      const demoWallet = await tx.demoWallet.create({
        data: {
          userId: user.id,
          balance: new Decimal(10000.0),
          currency: country.currency,
          ledgerAccountId: ledgerAccount.id,
        },
      });

      // 5. Ensure System House Liability Account exists for double-entry
      const houseLiability = await tx.ledgerAccount.upsert({
        where: { code: 'PLAYER_DEMO_LIABILITY' },
        update: {},
        create: {
          code: 'PLAYER_DEMO_LIABILITY',
          accountType: 'LIABILITY',
          currency: country.currency,
          balance: new Decimal(0),
        },
      });

      // 6. Record Initial Double-Entry Transaction
      const txRef = `REG-BONUS-${user.id}`;
      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          reference: txRef,
          transactionType: 'DEMO_REGISTRATION_BONUS',
          status: 'COMMITTED',
          description: 'Bono inicial de registro de 10,000 fichas demo',
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: ledgerTx.id,
            accountId: houseLiability.id,
            entryType: 'DEBIT',
            amount: new Decimal(10000.0),
          },
          {
            transactionId: ledgerTx.id,
            accountId: ledgerAccount.id,
            entryType: 'CREDIT',
            amount: new Decimal(10000.0),
          },
        ],
      });

      // 7. Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'USER_REGISTERED',
          entityName: 'User',
          entityId: user.id,
          payload: JSON.stringify({ email: user.email, country: country.code, initialBonus: 10000.0 }),
        },
      });

      return {
        id: user.id,
        email: user.email,
        name: dto.name || user.email.split('@')[0],
        role: playerRole.name,
        country: country.code,
        demoBalance: 10000.0,
        isActive: user.isActive,
      };
    });

    const token = this.generateToken(newUser.id, newUser.email, newUser.role, newUser.country);

    return {
      accessToken: token,
      tokenType: 'bearer',
      expiresIn: 86400,
      user: newUser,
    };
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
      include: {
        role: true,
        country: true,
        profile: true,
        demoWallet: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas o usuario no registrado');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('La cuenta de usuario se encuentra suspendida o inactiva');
    }

    // Record login audit log
    await this.prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'USER_LOGIN',
        entityName: 'User',
        entityId: user.id,
      },
    });

    const userSummary = {
      id: user.id,
      email: user.email,
      name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : user.email.split('@')[0],
      role: user.role.name,
      country: user.country.code,
      demoBalance: user.demoWallet ? Number(user.demoWallet.balance) : 10000.0,
      isActive: user.isActive,
    };

    const token = this.generateToken(user.id, user.email, user.role.name, user.country.code);

    return {
      accessToken: token,
      tokenType: 'bearer',
      expiresIn: 86400,
      user: userSummary,
    };
  }

  async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        role: true,
        country: true,
        profile: true,
        demoWallet: true,
        limits: true,
        kycRecords: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    return {
      id: user.id,
      email: user.email,
      name: user.profile ? `${user.profile.firstName} ${user.profile.lastName}`.trim() : user.email.split('@')[0],
      role: user.role.name,
      country: user.country.code,
      preferredLocale: user.profile?.preferredLocale || user.country.defaultLocale,
      demoBalance: user.demoWallet ? Number(user.demoWallet.balance) : 10000.0,
      isVerified: user.kycRecords.length > 0 && user.kycRecords[0].status === 'APPROVED',
      kycStatus: user.kycRecords.length > 0 ? user.kycRecords[0].status : 'NOT_SUBMITTED',
      limits: user.limits,
      createdAt: user.createdAt,
    };
  }

  private generateToken(userId: string, email: string, role: string, country: string): string {
    return this.jwtService.sign({
      sub: userId,
      email,
      role,
      country,
    });
  }
}

