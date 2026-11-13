import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderRegistryService } from '../providers/provider-registry.service';
import { GameQueryDto } from './dto/game-query.dto';
import { PlayRoundDto } from './dto/play-round.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class CasinoService {
  private readonly logger = new Logger(CasinoService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly providerRegistry: ProviderRegistryService,
  ) {}

  async getCatalog(query: GameQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const where: any = { isActive: true };

    if (query.category && query.category !== 'all') {
      where.category = query.category.toLowerCase();
    }
    if (query.search) {
      where.title = { contains: query.search, mode: 'insensitive' };
    }
    if (query.isPopular !== undefined) {
      where.isPopular = query.isPopular;
    }

    const [games, total] = await Promise.all([
      this.prisma.game.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ isPopular: 'desc' }, { createdAt: 'desc' }],
        include: { provider: true },
      }),
      this.prisma.game.count({ where }),
    ]);

    return {
      data: games.map((g) => ({
        id: g.id,
        title: g.title,
        slug: g.slug,
        category: g.category,
        provider: g.provider.name,
        providerCode: g.provider.code,
        rtp: `${g.rtp}%`,
        volatility: g.volatility,
        isPopular: g.isPopular,
        isNew: g.isNew,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getGameBySlug(slug: string) {
    const game = await this.prisma.game.findUnique({
      where: { slug },
      include: { provider: true },
    });

    if (!game) {
      throw new NotFoundException(`Juego con slug '${slug}' no encontrado en el catálogo`);
    }

    return game;
  }

  async launchSession(userId: string, gameSlug: string) {
    const game = await this.getGameBySlug(gameSlug);
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { country: true, demoWallet: true },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const adapter = this.providerRegistry.getAdapter(game.provider.code);
    const session = await adapter.createSession(user.id, game.id, user.country.currency);

    return {
      session,
      game: {
        title: game.title,
        slug: game.slug,
        provider: game.provider.name,
        category: game.category,
        rtp: `${game.rtp}%`,
      },
      user: {
        demoBalance: user.demoWallet ? Number(user.demoWallet.balance) : 0,
        currency: user.country.currency,
      },
    };
  }

  async playRound(userId: string, gameSlug: string, dto: PlayRoundDto) {
    const game = await this.getGameBySlug(gameSlug);

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        demoWallet: { include: { ledgerAccount: true } },
        country: true,
      },
    });

    if (!user || !user.demoWallet) {
      throw new NotFoundException('Billetera de usuario no encontrada');
    }

    const currentBalance = Number(user.demoWallet.balance);
    if (currentBalance < dto.betAmount) {
      throw new BadRequestException(
        `Saldo demo insuficiente ($${currentBalance.toFixed(2)} ${user.country.currency}). Recarga saldo demo desde la billetera.`,
      );
    }

    // Call Provider Adapter for Certified Provably Fair Round
    const adapter = this.providerRegistry.getAdapter(game.provider.code);
    const roundResult = await adapter.playRound(
      `SESSION-${user.id}-${game.id}`,
      dto.betAmount,
      { clientSeed: dto.clientSeed },
    );

    const newBalance = currentBalance - dto.betAmount + roundResult.payoutAmount;

    // Atomic Double-Entry Ledger Commitment
    await this.prisma.$transaction(async (tx) => {
      // 1. Update Demo Wallet Balance
      await tx.demoWallet.update({
        where: { id: user.demoWallet!.id },
        data: { balance: new Decimal(newBalance) },
      });

      // 2. Ensure House Accounts exist
      const houseRevenue = await tx.ledgerAccount.upsert({
        where: { code: 'HOUSE_REVENUE' },
        update: {},
        create: { code: 'HOUSE_REVENUE', accountType: 'REVENUE', currency: user.country.currency },
      });

      // 3. Record Inmutable Ledger Transaction for the Round
      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          reference: `CASINO-RND-${roundResult.roundId}`,
          transactionType: 'DEMO_CASINO_ROUND',
          status: 'COMMITTED',
          description: `Tirada demo en ${game.title}: Apuesta $${dto.betAmount}, Premio $${roundResult.payoutAmount}`,
        },
      });

      // Debit Bet from Player Account, Credit to House Revenue
      if (user.demoWallet!.ledgerAccountId) {
        await tx.ledgerEntry.createMany({
          data: [
            {
              transactionId: ledgerTx.id,
              accountId: user.demoWallet!.ledgerAccountId,
              entryType: 'DEBIT',
              amount: new Decimal(dto.betAmount),
            },
            {
              transactionId: ledgerTx.id,
              accountId: houseRevenue.id,
              entryType: 'CREDIT',
              amount: new Decimal(dto.betAmount),
            },
          ],
        });

        // If win > 0, Debit from House and Credit to Player
        if (roundResult.payoutAmount > 0) {
          await tx.ledgerEntry.createMany({
            data: [
              {
                transactionId: ledgerTx.id,
                accountId: houseRevenue.id,
                entryType: 'DEBIT',
                amount: new Decimal(roundResult.payoutAmount),
              },
              {
                transactionId: ledgerTx.id,
                accountId: user.demoWallet!.ledgerAccountId,
                entryType: 'CREDIT',
                amount: new Decimal(roundResult.payoutAmount),
              },
            ],
          });
        }
      }

      // 4. Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'CASINO_ROUND_PLAYED',
          entityName: 'Game',
          entityId: game.id,
          payload: JSON.stringify({
            game: game.slug,
            roundId: roundResult.roundId,
            bet: dto.betAmount,
            multiplier: roundResult.multiplier,
            payout: roundResult.payoutAmount,
          }),
        },
      });
    });

    return {
      ...roundResult,
      updatedBalance: Math.round(newBalance * 100) / 100,
      currency: user.country.currency,
    };
  }

  listProviders() {
    return this.providerRegistry.listProviders();
  }
}

