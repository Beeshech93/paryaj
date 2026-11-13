import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AffiliatesService {
  constructor(private readonly prisma: PrismaService) {}

  async getOrCreateAffiliate(userId: string) {
    let affiliate = await this.prisma.affiliate.findUnique({
      where: { userId },
      include: {
        referrals: {
          select: {
            id: true,
            email: true,
            createdAt: true,
            country: { select: { code: true } },
          },
        },
      },
    });

    if (!affiliate) {
      const generatedCode = `NB-${userId.substring(0, 6).toUpperCase()}`;
      affiliate = await this.prisma.affiliate.create({
        data: {
          userId,
          referralCode: generatedCode,
          commissionRate: 0.2, // 20% simulated commission
        },
        include: {
          referrals: {
            select: {
              id: true,
              email: true,
              createdAt: true,
              country: { select: { code: true } },
            },
          },
        },
      });
    }

    return {
      affiliateId: affiliate.id,
      referralCode: affiliate.referralCode,
      referralLink: `https://newbrand.casino/register?ref=${affiliate.referralCode}`,
      commissionRate: `${affiliate.commissionRate * 100}%`,
      totalReferrals: affiliate.referrals.length,
      totalSimulatedCommission: Number(affiliate.totalSimulatedCommission),
      recentReferrals: affiliate.referrals.slice(0, 10),
    };
  }

  async linkReferral(referralCode: string, newUserId: string) {
    const affiliate = await this.prisma.affiliate.findUnique({
      where: { referralCode },
    });

    if (!affiliate) {
      return null;
    }

    await this.prisma.user.update({
      where: { id: newUserId },
      data: { referredById: affiliate.id },
    });

    await this.prisma.affiliate.update({
      where: { id: affiliate.id },
      data: {
        totalReferrals: { increment: 1 },
      },
    });

    return affiliate;
  }
}

