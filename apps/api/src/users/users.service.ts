import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(params: { countryCode?: string; role?: string; page?: number; limit?: number }) {
    const page = Math.max(1, params.page || 1);
    const limit = Math.min(50, Math.max(1, params.limit || 20));
    const skip = (page - 1) * limit;

    const where: any = {};
    if (params.countryCode) {
      where.country = { code: params.countryCode.toUpperCase() };
    }
    if (params.role) {
      where.role = { name: params.role.toUpperCase() };
    }

    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
          country: true,
          profile: true,
          demoWallet: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return {
      data: users.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.profile ? `${u.profile.firstName} ${u.profile.lastName}`.trim() : u.email.split('@')[0],
        role: u.role.name,
        country: u.country.code,
        demoBalance: u.demoWallet ? Number(u.demoWallet.balance) : 0,
        isActive: u.isActive,
        createdAt: u.createdAt,
      })),
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        country: true,
        profile: true,
        demoWallet: true,
        kycRecords: true,
        limits: true,
        betSlips: { take: 5, orderBy: { createdAt: 'desc' } },
      },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return user;
  }

  async updateRole(userId: string, roleName: string) {
    const role = await this.prisma.role.findUnique({
      where: { name: roleName.toUpperCase() },
    });
    if (!role) {
      throw new NotFoundException(`Rol ${roleName} no existe`);
    }

    return this.prisma.user.update({
      where: { id: userId },
      data: { roleId: role.id },
      include: { role: true },
    });
  }

  async updateStatus(userId: string, isActive: boolean) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { isActive },
    });
  }
}

