import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBetSlipDto } from './dto/create-bet-slip.dto';
import { SportsQueryDto } from './dto/sports-query.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class SportsService {
  private readonly logger = new Logger(SportsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getSportsWithCompetitions() {
    return this.prisma.sport.findMany({
      where: { isActive: true },
      include: {
        competitions: {
          where: { isActive: true },
          include: {
            _count: { select: { events: true } },
          },
        },
      },
    });
  }

  async getEvents(query: SportsQueryDto) {
    const where: any = {};

    if (query.sport) {
      where.competition = { sport: { slug: query.sport.toLowerCase() } };
    }
    if (query.competitionId) {
      where.competitionId = query.competitionId;
    }
    if (query.countryCode) {
      where.competition = {
        ...where.competition,
        country: { code: query.countryCode.toUpperCase() },
      };
    }
    if (query.isLive !== undefined) {
      where.status = query.isLive ? 'LIVE' : { not: 'LIVE' };
    }

    return this.prisma.event.findMany({
      where,
      orderBy: [{ status: 'asc' }, { scheduledStart: 'asc' }],
      include: {
        competition: {
          include: { sport: true, country: true },
        },
        markets: {
          include: {
            oddsSnapshots: {
              orderBy: { timestamp: 'desc' },
              take: 3,
            },
          },
        },
      },
    });
  }

  async getEventById(id: string) {
    const event = await this.prisma.event.findUnique({
      where: { id },
      include: {
        competition: {
          include: { sport: true, country: true },
        },
        markets: {
          include: {
            oddsSnapshots: {
              orderBy: { timestamp: 'desc' },
            },
          },
        },
      },
    });

    if (!event) {
      throw new NotFoundException(`Evento deportivo con ID '${id}' no encontrado`);
    }

    return event;
  }

  async placeBetSlip(userId: string, dto: CreateBetSlipDto) {
    if (dto.slipType === 'PARLAY' && dto.selections.length < 2) {
      throw new BadRequestException('Una apuesta combinada (PARLAY) requiere un mínimo de 2 selecciones de eventos distintos.');
    }

    // Check unique events per selection to prevent conflicting parlay bets
    const eventIds = new Set(dto.selections.map((s) => s.eventId));
    if (dto.slipType === 'PARLAY' && eventIds.size !== dto.selections.length) {
      throw new BadRequestException('No es posible combinar múltiples selecciones del mismo evento en un Parlay.');
    }

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

    const balance = Number(user.demoWallet.balance);
    if (balance < dto.stake) {
      throw new BadRequestException(
        `Saldo demo insuficiente ($${balance.toFixed(2)} ${user.country.currency}). Se requiere $${dto.stake.toFixed(2)}.`,
      );
    }

    // Calculate total odds and potential payout
    let totalOdds = 1.0;
    if (dto.slipType === 'PARLAY') {
      totalOdds = dto.selections.reduce((acc, curr) => acc * curr.odds, 1.0);
    } else {
      totalOdds = dto.selections[0].odds;
    }
    totalOdds = Math.round(totalOdds * 100) / 100;
    const potentialPayout = Math.round(dto.stake * totalOdds * 100) / 100;

    // Execute atomic transaction for bet slip and double-entry ledger
    const slip = await this.prisma.$transaction(async (tx) => {
      // 1. Deduct stake from Demo Wallet
      const newBal = balance - dto.stake;
      await tx.demoWallet.update({
        where: { id: user.demoWallet!.id },
        data: { balance: new Decimal(newBal) },
      });

      // 2. Create BetSlipDemo
      const betSlip = await tx.betSlipDemo.create({
        data: {
          userId: user.id,
          slipType: dto.slipType,
          status: 'PENDING',
          stake: new Decimal(dto.stake),
          totalOdds,
          potentialPayout: new Decimal(potentialPayout),
        },
      });

      // 3. Create individual BetDemo items
      for (const sel of dto.selections) {
        await tx.betDemo.create({
          data: {
            betSlipId: betSlip.id,
            userId: user.id,
            eventId: sel.eventId,
            marketId: sel.marketId,
            selection: sel.selection,
            odds: sel.odds,
            status: 'PENDING',
          },
        });
      }

      // 4. Record Immutable Double-Entry Ledger Transaction
      const houseLiability = await tx.ledgerAccount.upsert({
        where: { code: 'PLAYER_DEMO_LIABILITY' },
        update: {},
        create: { code: 'PLAYER_DEMO_LIABILITY', accountType: 'LIABILITY', currency: user.country.currency },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          reference: `SPORTS-SLIP-${betSlip.id}`,
          transactionType: 'DEMO_BET_PLACED',
          status: 'COMMITTED',
          description: `Apuesta ${dto.slipType} demo de $${dto.stake} a cuota ${totalOdds}x (Ganancia est. $${potentialPayout})`,
        },
      });

      if (user.demoWallet!.ledgerAccountId) {
        await tx.ledgerEntry.createMany({
          data: [
            {
              transactionId: ledgerTx.id,
              accountId: user.demoWallet!.ledgerAccountId,
              entryType: 'DEBIT',
              amount: new Decimal(dto.stake),
            },
            {
              transactionId: ledgerTx.id,
              accountId: houseLiability.id,
              entryType: 'CREDIT',
              amount: new Decimal(dto.stake),
            },
          ],
        });
      }

      // 5. Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'SPORTS_BET_PLACED',
          entityName: 'BetSlipDemo',
          entityId: betSlip.id,
          payload: JSON.stringify({
            slipType: dto.slipType,
            stake: dto.stake,
            totalOdds,
            potentialPayout,
            selectionsCount: dto.selections.length,
          }),
        },
      });

      return betSlip;
    });

    return {
      slipId: slip.id,
      receiptNumber: `NB-TICKET-${slip.id.substring(0, 8).toUpperCase()}`,
      slipType: dto.slipType,
      status: 'PENDING',
      stake: dto.stake,
      totalOdds,
      potentialPayout,
      currency: user.country.currency,
      selections: dto.selections,
      timestamp: new Date().toISOString(),
    };
  }

  async getUserBetSlips(userId: string, status?: string) {
    const where: any = { userId };
    if (status) {
      where.status = status.toUpperCase();
    }

    return this.prisma.betSlipDemo.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 20,
      include: {
        bets: {
          include: {
            event: {
              include: { competition: true },
            },
          },
        },
      },
    });
  }

  async settleBetSlip(slipId: string, outcome: 'WON' | 'LOST') {
    const slip = await this.prisma.betSlipDemo.findUnique({
      where: { id: slipId },
      include: {
        user: { include: { demoWallet: true } },
      },
    });

    if (!slip) {
      throw new NotFoundException(`Cupón ${slipId} no encontrado`);
    }

    if (slip.status !== 'PENDING') {
      throw new BadRequestException(`El cupón ya fue liquidado con estado ${slip.status}`);
    }

    const payout = outcome === 'WON' ? Number(slip.potentialPayout) : 0;

    await this.prisma.$transaction(async (tx) => {
      // 1. Update Slip Status
      await tx.betSlipDemo.update({
        where: { id: slipId },
        data: {
          status: outcome,
          actualPayout: new Decimal(payout),
        },
      });

      // 2. If WON, credit user wallet and commit ledger
      if (outcome === 'WON' && slip.user.demoWallet) {
        const newBal = Number(slip.user.demoWallet.balance) + payout;
        await tx.demoWallet.update({
          where: { id: slip.user.demoWallet.id },
          data: { balance: new Decimal(newBal) },
        });

        const houseLiability = await tx.ledgerAccount.upsert({
          where: { code: 'PLAYER_DEMO_LIABILITY' },
          update: {},
          create: { code: 'PLAYER_DEMO_LIABILITY', accountType: 'LIABILITY', currency: 'MXN' },
        });

        const ledgerTx = await tx.ledgerTransaction.create({
          data: {
            reference: `SETTLE-WON-${slipId}`,
            transactionType: 'DEMO_BET_WON',
            status: 'COMMITTED',
            description: `Premio de apuesta deportiva ganada: $${payout}`,
          },
        });

        if (slip.user.demoWallet.ledgerAccountId) {
          await tx.ledgerEntry.createMany({
            data: [
              {
                transactionId: ledgerTx.id,
                accountId: houseLiability.id,
                entryType: 'DEBIT',
                amount: new Decimal(payout),
              },
              {
                transactionId: ledgerTx.id,
                accountId: slip.user.demoWallet.ledgerAccountId,
                entryType: 'CREDIT',
                amount: new Decimal(payout),
              },
            ],
          });
        }
      }
    });

    return {
      slipId,
      status: outcome,
      actualPayout: payout,
      message: `Cupón liquidado exitosamente como ${outcome}.`,
    };
  }
}

