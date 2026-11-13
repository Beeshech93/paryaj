import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { BadRequestException, ConflictException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: any;
  let jwt: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      country: {
        upsert: jest.fn().mockResolvedValue({ id: 'country-mx', code: 'MX', defaultLocale: 'es', currency: 'MXN' }),
      },
      role: {
        upsert: jest.fn().mockResolvedValue({ id: 'role-player', name: 'PLAYER' }),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({ id: 'log-1' }),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          user: {
            create: jest.fn().mockResolvedValue({ id: 'usr-1', email: 'test@ejemplo.com', isActive: true }),
          },
          profile: {
            create: jest.fn().mockResolvedValue({ id: 'prof-1' }),
          },
          ledgerAccount: {
            create: jest.fn().mockResolvedValue({ id: 'ledger-acc-1' }),
            upsert: jest.fn().mockResolvedValue({ id: 'house-liability' }),
          },
          demoWallet: {
            create: jest.fn().mockResolvedValue({ id: 'wallet-1' }),
          },
          ledgerTransaction: {
            create: jest.fn().mockResolvedValue({ id: 'ltx-1' }),
          },
          ledgerEntry: {
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'log-1' }),
          },
        });
      }),
    };

    jwt = {
      sign: jest.fn().mockReturnValue('mock-jwt-token-12345'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: prisma },
        { provide: JwtService, useValue: jwt },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('register', () => {
    it('should reject registration if user is under 18', async () => {
      await expect(
        service.register({
          email: 'underage@ejemplo.com',
          password: 'Password123!',
          countryCode: 'MX',
          ageConfirmed: false,
          termsAccepted: true,
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should register a valid 18+ user and provision demo wallet + ledger entries', async () => {
      prisma.user.findUnique.mockResolvedValue(null);

      const res = await service.register({
        email: 'adulto@ejemplo.com',
        password: 'Password123!',
        name: 'Carlos Ruiz',
        countryCode: 'MX',
        ageConfirmed: true,
        termsAccepted: true,
      });

      expect(res).toHaveProperty('accessToken', 'mock-jwt-token-12345');
      expect(res.user.role).toBe('PLAYER');
      expect(res.user.demoBalance).toBe(10000.0);
      expect(res.user.country).toBe('MX');
    });

    it('should throw ConflictException if user already exists', async () => {
      prisma.user.findUnique.mockResolvedValue({ id: 'existing-id', email: 'existing@ejemplo.com' });

      await expect(
        service.register({
          email: 'existing@ejemplo.com',
          password: 'Password123!',
          countryCode: 'MX',
          ageConfirmed: true,
          termsAccepted: true,
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should log in an active user and return a JWT', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        email: 'test@ejemplo.com',
        isActive: true,
        role: { name: 'PLAYER' },
        country: { code: 'MX', defaultLocale: 'es' },
        profile: { firstName: 'Carlos', lastName: 'Ruiz' },
        demoWallet: { balance: 10000.0 },
      });

      const res = await service.login({
        email: 'test@ejemplo.com',
        password: 'Password123!',
      });

      expect(res).toHaveProperty('accessToken', 'mock-jwt-token-12345');
      expect(res.user.email).toBe('test@ejemplo.com');
      expect(res.user.demoBalance).toBe(10000.0);
    });
  });
});

