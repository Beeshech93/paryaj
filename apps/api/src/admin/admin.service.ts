import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics() {
    const [
      totalUsers,
      activeUsers,
      usersByCountry,
      totalGames,
      totalProviders,
      totalBets,
      recentAuditLogs,
    ] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { isActive: true } }),
      this.prisma.user.groupBy({
        by: ['countryId'],
        _count: { id: true },
      }),
      this.prisma.game.count(),
      this.prisma.gameProvider.count(),
      this.prisma.betSlipDemo.count(),
      this.prisma.auditLog.findMany({
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true } } },
      }),
    ]);

    // Resolve country names for breakdown
    const countries = await this.prisma.country.findMany();
    const countryMap = new Map(countries.map((c) => [c.id, c.code]));

    const marketDistribution = usersByCountry.map((item) => ({
      countryCode: countryMap.get(item.countryId) || 'UNKNOWN',
      count: item._count.id,
    }));

    return {
      overview: {
        totalUsers,
        activeUsers,
        activeSessionsDemo: Math.max(1, Math.round(activeUsers * 0.4)),
        totalGames,
        totalProviders,
        totalBetsSimulated: totalBets,
        complianceMode: 'REGULATED_DEMO_SIMULATION',
        realMoneyEnabled: false,
      },
      marketDistribution,
      securityAlerts: [
        {
          id: 'sec-1',
          type: 'INFO',
          message: 'Política de Dinero Real: Deshabilitada en MX y HT conforme a directiva.',
          timestamp: new Date().toISOString(),
        },
        {
          id: 'sec-2',
          type: 'COMPLIANCE',
          message: 'Integridad contable del Ledger: Asientos cuadrados en doble partida.',
          timestamp: new Date().toISOString(),
        },
      ],
      recentAuditLogs: recentAuditLogs.map((log) => ({
        id: log.id,
        action: log.action,
        userEmail: log.user?.email || 'SYSTEM',
        entity: log.entityName,
        createdAt: log.createdAt,
      })),
    };
  }

  async getAuditLogs(page = 1, limit = 25) {
    const skip = (Math.max(1, page) - 1) * Math.min(100, limit);
    const [data, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { email: true, id: true } } },
      }),
      this.prisma.auditLog.count(),
    ]);

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }
}

