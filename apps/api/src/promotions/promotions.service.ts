import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

@Injectable()
export class PromotionsService {
  private readonly logger = new Logger(PromotionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async listActivePromotions() {
    return this.prisma.promotion.findMany({
      where: { isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPromotionBySlug(slug: string) {
    const promo = await this.prisma.promotion.findUnique({
      where: { slug },
    });
    if (!promo) {
      throw new NotFoundException(`Promoción '${slug}' no encontrada`);
    }
    return promo;
  }

  async claimPromotion(userId: string, promoSlug: string) {
    const promo = await this.getPromotionBySlug(promoSlug);

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

    // Check if user already claimed this promo via audit logs
    const alreadyClaimed = await this.prisma.auditLog.findFirst({
      where: {
        userId: user.id,
        action: 'PROMOTION_CLAIMED',
        entityId: promo.id,
      },
    });

    if (alreadyClaimed) {
      throw new ConflictException('Esta promoción ya ha sido activada en tu cuenta.');
    }

    const bonusAmount = Number(promo.bonusAmount);

    // Atomic Double-Entry Ledger Commitment
    const result = await this.prisma.$transaction(async (tx) => {
      // 1. Ensure Bonus Expense Account exists
      const bonusExpense = await tx.ledgerAccount.upsert({
        where: { code: 'BONUS_EXPENSE' },
        update: {},
        create: { code: 'BONUS_EXPENSE', accountType: 'EXPENSE', currency: user.country.currency },
      });

      // 2. Increment user wallet balance
      const newBal = Number(user.demoWallet!.balance) + bonusAmount;
      await tx.demoWallet.update({
        where: { id: user.demoWallet!.id },
        data: { balance: new Decimal(newBal) },
      });

      // 3. Increment user ledger account balance
      if (user.demoWallet!.ledgerAccountId) {
        await tx.ledgerAccount.update({
          where: { id: user.demoWallet!.ledgerAccountId },
          data: { balance: new Decimal(newBal) },
        });

        // 4. Record Ledger Transaction
        const ledgerTx = await tx.ledgerTransaction.create({
          data: {
            reference: `PROMO-${promo.slug.toUpperCase()}-${user.id}`,
            transactionType: 'DEMO_PROMO_BONUS',
            status: 'COMMITTED',
            description: `Activación de ${promo.title}: +$${bonusAmount} ${user.country.currency}`,
          },
        });

        // 5. Debit Bonus Expense, Credit Player Ledger Account
        await tx.ledgerEntry.createMany({
          data: [
            {
              transactionId: ledgerTx.id,
              accountId: bonusExpense.id,
              entryType: 'DEBIT',
              amount: new Decimal(bonusAmount),
            },
            {
              transactionId: ledgerTx.id,
              accountId: user.demoWallet!.ledgerAccountId,
              entryType: 'CREDIT',
              amount: new Decimal(bonusAmount),
            },
          ],
        });
      }

      // 6. Record Audit Log
      await tx.auditLog.create({
        data: {
          userId: user.id,
          action: 'PROMOTION_CLAIMED',
          entityName: 'Promotion',
          entityId: promo.id,
          payload: JSON.stringify({ promo: promo.slug, amount: bonusAmount, newBal }),
        },
      });

      return {
        promoId: promo.id,
        title: promo.title,
        bonusAwarded: bonusAmount,
        newBalance: newBal,
        currency: user.country.currency,
        message: `¡${promo.title} activado con éxito! +$${bonusAmount.toLocaleString()} acreditados en tu saldo demo.`,
      };
    });

    return result;
  }
}

