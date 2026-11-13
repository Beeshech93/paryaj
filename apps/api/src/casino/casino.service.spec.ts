import { Test, TestingModule } from '@nestjs/testing';
import { CasinoService } from './casino.service';
import { PrismaService } from '../prisma/prisma.service';
import { ProviderRegistryService } from '../providers/provider-registry.service';
import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('CasinoService', () => {
  let service: CasinoService;
  let prisma: any;
  let providerRegistry: any;

  beforeEach(async () => {
    prisma = {
      game: {
        findMany: jest.fn().mockResolvedValue([
          {
            id: 'g-1',
            title: 'Aztec Sunburst 1000',
            slug: 'aztec-sunburst-1000',
            category: 'slots',
            rtp: 96.8,
            volatility: 'HIGH',
            isPopular: true,
            isNew: false,
            provider: { name: 'NEW BRAND Studios', code: 'NEW_BRAND_STUDIOS' },
          },
        ]),
        count: jest.fn().mockResolvedValue(1),
        findUnique: jest.fn().mockResolvedValue({
          id: 'g-1',
          title: 'Aztec Sunburst 1000',
          slug: 'aztec-sunburst-1000',
          provider: { code: 'NEW_BRAND_STUDIOS', name: 'NEW BRAND Studios' },
          rtp: 96.8,
        }),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          demoWallet: {
            update: jest.fn().mockResolvedValue({}),
          },
          ledgerAccount: {
            upsert: jest.fn().mockResolvedValue({ id: 'house-rev-id' }),
          },
          ledgerTransaction: {
            create: jest.fn().mockResolvedValue({ id: 'ltx-round-1' }),
          },
          ledgerEntry: {
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'audit-1' }),
          },
        });
      }),
    };

    const mockAdapter = {
      createSession: jest.fn().mockResolvedValue({ sessionId: 'sess-1' }),
      playRound: jest.fn().mockResolvedValue({
        roundId: 'rnd-123',
        betAmount: 50,
        multiplier: 2.5,
        payoutAmount: 125,
        netWin: 75,
        provablyFair: { hash: 'mock-hash', nonce: 1 },
      }),
    };

    providerRegistry = {
      getAdapter: jest.fn().mockReturnValue(mockAdapter),
      listProviders: jest.fn().mockReturnValue([{ code: 'NEW_BRAND_STUDIOS', name: 'NEW BRAND Studios' }]),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CasinoService,
        { provide: PrismaService, useValue: prisma },
        { provide: ProviderRegistryService, useValue: providerRegistry },
      ],
    }).compile();

    service = module.get<CasinoService>(CasinoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCatalog', () => {
    it('should return games catalog with metadata', async () => {
      const res = await service.getCatalog({ category: 'slots' });
      expect(res.data).toHaveLength(1);
      expect(res.data[0].title).toBe('Aztec Sunburst 1000');
      expect(res.meta.total).toBe(1);
    });
  });

  describe('playRound', () => {
    it('should reject if user has insufficient demo balance', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-poor',
        demoWallet: { balance: new Decimal(10.0), ledgerAccountId: 'acc-1' },
        country: { currency: 'MXN' },
      });

      await expect(
        service.playRound('usr-poor', 'aztec-sunburst-1000', { betAmount: 50.0 }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should execute round, call adapter, and update balance with double-entry ledger entries', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        demoWallet: { id: 'wallet-1', balance: new Decimal(10000.0), ledgerAccountId: 'acc-user' },
        country: { currency: 'MXN' },
      });

      const result = await service.playRound('usr-1', 'aztec-sunburst-1000', { betAmount: 50.0 });

      expect(result.roundId).toBe('rnd-123');
      expect(result.multiplier).toBe(2.5);
      expect(result.payoutAmount).toBe(125);
      expect(result.updatedBalance).toBe(10075);
    });
  });
});

