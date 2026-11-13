import { Test, TestingModule } from '@nestjs/testing';
import { PromotionsService } from './promotions.service';
import { PrismaService } from '../prisma/prisma.service';
import { ConflictException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('PromotionsService', () => {
  let service: PromotionsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      promotion: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'p-1', title: 'Bono Bienvenida', slug: 'bono-bienvenida', bonusAmount: 10000 },
        ]),
        findUnique: jest.fn().mockResolvedValue({
          id: 'p-1',
          title: 'Bono Bienvenida',
          slug: 'bono-bienvenida',
          bonusAmount: new Decimal(10000),
        }),
      },
      user: {
        findUnique: jest.fn(),
      },
      auditLog: {
        findFirst: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          ledgerAccount: {
            upsert: jest.fn().mockResolvedValue({ id: 'acc-bonus-exp' }),
            update: jest.fn().mockResolvedValue({}),
          },
          demoWallet: {
            update: jest.fn().mockResolvedValue({}),
          },
          ledgerTransaction: {
            create: jest.fn().mockResolvedValue({ id: 'tx-promo' }),
          },
          ledgerEntry: {
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'log-promo' }),
          },
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PromotionsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<PromotionsService>(PromotionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('claimPromotion', () => {
    it('should prevent claiming a promotion twice', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        demoWallet: { id: 'w-1', balance: new Decimal(10000) },
        country: { currency: 'MXN' },
      });
      prisma.auditLog.findFirst.mockResolvedValue({ id: 'prior-claim' });

      await expect(service.claimPromotion('usr-1', 'bono-bienvenida')).rejects.toThrow(ConflictException);
    });

    it('should claim promotion and credit demo bonus with double-entry ledger entries', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        demoWallet: { id: 'w-1', balance: new Decimal(10000), ledgerAccountId: 'acc-usr' },
        country: { currency: 'MXN' },
      });
      prisma.auditLog.findFirst.mockResolvedValue(null);

      const res = await service.claimPromotion('usr-1', 'bono-bienvenida');

      expect(res.bonusAwarded).toBe(10000);
      expect(res.newBalance).toBe(20000);
    });
  });
});

