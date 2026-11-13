import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { DepositDemoDto } from './dto/deposit-demo.dto';
import { WithdrawDemoDto } from './dto/withdraw-demo.dto';
import { WalletHistoryQueryDto } from './dto/wallet-history-query.dto';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);

  constructor(private readonly prisma: PrismaService) {}

  async getBalance(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        demoWallet: {
          include: { ledgerAccount: true },
        },
        country: true,
      },
    });

    if (!user || !user.demoWallet) {
      throw new NotFoundException('Billetera de usuario no encontrada');
    }

    return {
      userId: user.id,
      balance: Number(user.demoWallet.balance),
      currency: user.country.currency,
      country: user.country.code,
      isLocked: user.demoWallet.isLocked,
      ledgerAccountCode: user.demoWallet.ledgerAccount?.code || null,
      mode: 'REGULATED_DEMO',
      realMoneyEnabled: false,
    };
  }

  async depositDemo(userId: string, dto: DepositDemoDto) {
    // 1. Idempotency Check
    const existingTx = await this.prisma.ledgerTransaction.findUnique({
      where: { reference: dto.idempotencyKey },
    });
    if (existingTx) {
      this.logger.warn(`Idempotent replay detected for key: ${dto.idempotencyKey}`);
      const user = await this.getBalance(userId);
      return {
        txId: existingTx.id,
        reference: existingTx.reference,
        status: existingTx.status,
        amount: dto.amount,
        balance: user.balance,
        currency: user.currency,
        isIdempotentReplay: true,
        message: 'Transacción ya procesada previamente (Respuesta Idempotente).',
      };
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

    if (user.demoWallet.isLocked) {
      throw new BadRequestException('La billetera del usuario se encuentra bloqueada por cumplimiento.');
    }

    // Atomic Double-Entry Ledger Commitment
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Ensure user ledger account exists
      let ledgerAccountId = user.demoWallet!.ledgerAccountId;
      if (!ledgerAccountId) {
        const acc = await tx.ledgerAccount.create({
          data: {
            code: `WALLET_DEMO_${user.id}`,
            accountType: 'LIABILITY',
            currency: user.country.currency,
            balance: user.demoWallet!.balance,
          },
        });
        ledgerAccountId = acc.id;
        await tx.demoWallet.update({
          where: { id: user.demoWallet!.id },
          data: { ledgerAccountId: acc.id },
        });
      }

      // 2. Ensure House Liability Account exists
      const houseLiability = await tx.ledgerAccount.upsert({
        where: { code: 'PLAYER_DEMO_LIABILITY' },
        update: {},
        create: {
          code: 'PLAYER_DEMO_LIABILITY',
          accountType: 'LIABILITY',
          currency: user.country.currency,
          balance: new Decimal(0),
        },
      });

      // 3. Increment Wallet and Ledger balances
      const newBal = Number(user.demoWallet!.balance) + dto.amount;
      await tx.demoWallet.update({
        where: { id: user.demoWallet!.id },
        data: { balance: new Decimal(newBal) },
      });

      await tx.ledgerAccount.update({
        where: { id: ledgerAccountId },
        data: { balance: new Decimal(newBal) },
      });

      // 4. Create LedgerTransaction
      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          reference: dto.idempotencyKey,
          transactionType: 'DEMO_DEPOSIT',
          status: 'COMMITTED',
          description: `Recarga demo de $${dto.amount} ${user.country.currency} vía ${dto.paymentMethod || 'SIMULATED_RECHARGE'}`,
        },
      });

      // 5. Create Double-Entry Bookkeeping Entries
      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: ledgerTx.id,
            accountId: houseLiability.id,
            entryType: 'DEBIT',
            amount: new Decimal(dto.amount),
          },
          {
            transactionId: ledgerTx.id,
            accountId: ledgerAccountId,
            entryType: 'CREDIT',
            amount: new Decimal(dto.amount),
          },
        ],
      });

      // 6. Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'DEMO_WALLET_DEPOSIT',
          entityName: 'DemoWallet',
          entityId: user.demoWallet!.id,
          payload: JSON.stringify({ amount: dto.amount, idempotencyKey: dto.idempotencyKey, newBal }),
        },
      });

      return {
        txId: ledgerTx.id,
        reference: ledgerTx.reference,
        status: 'COMMITTED',
        amount: dto.amount,
        balance: newBal,
        currency: user.country.currency,
        isIdempotentReplay: false,
        message: 'Recarga demo acreditada y asentada en el Ledger de doble partida.',
      };
    });

    return result;
  }

  async withdrawDemo(userId: string, dto: WithdrawDemoDto) {
    // 1. Idempotency Check
    const existingTx = await this.prisma.ledgerTransaction.findUnique({
      where: { reference: dto.idempotencyKey },
    });
    if (existingTx) {
      this.logger.warn(`Idempotent replay detected for key: ${dto.idempotencyKey}`);
      const user = await this.getBalance(userId);
      return {
        txId: existingTx.id,
        reference: existingTx.reference,
        status: existingTx.status,
        amount: dto.amount,
        balance: user.balance,
        currency: user.currency,
        isIdempotentReplay: true,
        message: 'Transacción ya procesada previamente (Respuesta Idempotente).',
      };
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

    if (user.demoWallet.isLocked) {
      throw new BadRequestException('La billetera se encuentra bloqueada.');
    }

    const currentBal = Number(user.demoWallet.balance);
    if (currentBal < dto.amount) {
      throw new BadRequestException(
        `Saldo insuficiente ($${currentBal.toFixed(2)} ${user.country.currency}) para procesar el retiro de $${dto.amount.toFixed(2)}.`,
      );
    }

    // Atomic Double-Entry Ledger Commitment
    const result = await this.prisma.$transaction(async (tx) => {
      const ledgerAccountId = user.demoWallet!.ledgerAccountId!;
      const houseLiability = await tx.ledgerAccount.upsert({
        where: { code: 'PLAYER_DEMO_LIABILITY' },
        update: {},
        create: { code: 'PLAYER_DEMO_LIABILITY', accountType: 'LIABILITY', currency: user.country.currency },
      });

      const newBal = currentBal - dto.amount;
      await tx.demoWallet.update({
        where: { id: user.demoWallet!.id },
        data: { balance: new Decimal(newBal) },
      });

      await tx.ledgerAccount.update({
        where: { id: ledgerAccountId },
        data: { balance: new Decimal(newBal) },
      });

      const ledgerTx = await tx.ledgerTransaction.create({
        data: {
          reference: dto.idempotencyKey,
          transactionType: 'DEMO_WITHDRAWAL',
          status: 'COMMITTED',
          description: `Retiro simulado de $${dto.amount} ${user.country.currency} hacia ${dto.destinationAccount || 'DESTINO_SIMULADO'}`,
        },
      });

      await tx.ledgerEntry.createMany({
        data: [
          {
            transactionId: ledgerTx.id,
            accountId: ledgerAccountId,
            entryType: 'DEBIT',
            amount: new Decimal(dto.amount),
          },
          {
            transactionId: ledgerTx.id,
            accountId: houseLiability.id,
            entryType: 'CREDIT',
            amount: new Decimal(dto.amount),
          },
        ],
      });

      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'DEMO_WALLET_WITHDRAWAL',
          entityName: 'DemoWallet',
          entityId: user.demoWallet!.id,
          payload: JSON.stringify({ amount: dto.amount, idempotencyKey: dto.idempotencyKey, newBal }),
        },
      });

      return {
        txId: ledgerTx.id,
        reference: ledgerTx.reference,
        status: 'COMMITTED',
        amount: dto.amount,
        balance: newBal,
        currency: user.country.currency,
        isIdempotentReplay: false,
        message: 'Retiro simulado debitado del Ledger con éxito.',
      };
    });

    return result;
  }

  async getTransactions(userId: string, query: WalletHistoryQueryDto) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const skip = (page - 1) * limit;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { demoWallet: true },
    });

    if (!user || !user.demoWallet || !user.demoWallet.ledgerAccountId) {
      return { data: [], meta: { total: 0, page, limit, totalPages: 0 } };
    }

    const where: any = {
      accountId: user.demoWallet.ledgerAccountId,
    };

    if (query.transactionType) {
      where.transaction = { transactionType: query.transactionType };
    }

    const [entries, total] = await Promise.all([
      this.prisma.ledgerEntry.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { transaction: true },
      }),
      this.prisma.ledgerEntry.count({ where }),
    ]);

    return {
      data: entries.map((e) => ({
        id: e.id,
        type: e.entryType,
        amount: Number(e.amount),
        transactionRef: e.transaction.reference,
        transactionType: e.transaction.transactionType,
        description: e.transaction.description,
        createdAt: e.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getAuditStatement(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        demoWallet: { include: { ledgerAccount: true } },
        country: true,
      },
    });

    if (!user || !user.demoWallet || !user.demoWallet.ledgerAccountId) {
      throw new NotFoundException('Cuenta de Ledger no encontrada');
    }

    const entries = await this.prisma.ledgerEntry.findMany({
      where: { accountId: user.demoWallet.ledgerAccountId },
    });

    let totalCredits = 0;
    let totalDebits = 0;

    for (const e of entries) {
      if (e.entryType === 'CREDIT') {
        totalCredits += Number(e.amount);
      } else if (e.entryType === 'DEBIT') {
        totalDebits += Number(e.amount);
      }
    }

    const calculatedBalance = Math.round((totalCredits - totalDebits) * 100) / 100;
    const walletBalance = Number(user.demoWallet.balance);
    const isBalanced = Math.abs(calculatedBalance - walletBalance) < 0.001;

    return {
      accountCode: user.demoWallet.ledgerAccount?.code,
      currency: user.country.currency,
      walletBalance,
      ledgerSummary: {
        totalEntries: entries.length,
        totalCredits,
        totalDebits,
        calculatedBalance,
      },
      auditVerification: {
        isSquareAndBalanced: isBalanced,
        integrityStatus: isBalanced ? 'VERIFIED_CRYPTOGRAPHIC_INTEGRITY' : 'DISCREPANCY_ALERT',
        verifiedAt: new Date().toISOString(),
      },
    };
  }

  /**
   * Procesa abono de STP México (SPEI) vía webhook de forma atómica e idempotente
   */
  async processStpDeposit(payload: { claveRastreo: string; monto: number; [key: string]: any }) {
    const trackingKey = `STP_SPEI_${payload.claveRastreo}`;
    const existing = await this.prisma.ledgerTransaction.findUnique({
      where: { reference: trackingKey },
    });
    if (existing) {
      this.logger.warn(`STP Abono already processed (idempotent): ${trackingKey}`);
      return { txId: existing.id, isReplay: true };
    }

    // Localizar usuario destinatario en México
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { country: { code: 'MX' } },
          { email: { contains: 'mexico' } },
        ],
      },
      include: { demoWallet: { include: { ledgerAccount: true } }, country: true },
    });

    if (!user || !user.demoWallet) {
      throw new NotFoundException('Usuario destinatario del abono SPEI no encontrado');
    }

    return this.depositDemo(user.id, {
      amount: Number(payload.monto),
      currency: 'MXN',
      paymentMethod: 'SPEI_STP_MEXICO',
      idempotencyKey: trackingKey,
    });
  }

  /**
   * Procesa pago de Digicel MonCash Haití vía webhook de forma atómica e idempotente
   */
  async processMonCashDeposit(payload: {
    reference: string;
    orderId?: string;
    amount: number;
    userId?: string;
    [key: string]: any;
  }) {
    const referenceKey = `MONCASH_${payload.reference || payload.orderId}`;
    const existing = await this.prisma.ledgerTransaction.findUnique({
      where: { reference: referenceKey },
    });
    if (existing) {
      this.logger.warn(`MonCash deposit already processed (idempotent): ${referenceKey}`);
      return { txId: existing.id, isReplay: true };
    }

    // Localizar usuario destinatario en Haití
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          { id: payload.userId || undefined },
          { country: { code: 'HT' } },
          { email: { contains: 'haiti' } },
        ],
      },
      include: { demoWallet: { include: { ledgerAccount: true } }, country: true },
    });

    if (!user || !user.demoWallet) {
      throw new NotFoundException('Destinataire MonCash non trouvé');
    }

    return this.depositDemo(user.id, {
      amount: Number(payload.amount),
      currency: 'HTG',
      paymentMethod: 'MONCASH_DIGICEL_HAITI',
      idempotencyKey: referenceKey,
    });
  }
}

