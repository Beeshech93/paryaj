import { Test, TestingModule } from '@nestjs/testing';
import { SportsService } from './sports.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('SportsService', () => {
  let service: SportsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      sport: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'sp-1', name: 'Fútbol', slug: 'futbol', competitions: [] },
        ]),
      },
      event: {
        findMany: jest.fn().mockResolvedValue([
          { id: 'evt-1', homeTeam: 'Club América', awayTeam: 'Guadalajara Chivas' },
        ]),
        findUnique: jest.fn().mockResolvedValue({ id: 'evt-1', homeTeam: 'Club América' }),
      },
      user: {
        findUnique: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          demoWallet: {
            update: jest.fn().mockResolvedValue({}),
          },
          betSlipDemo: {
            create: jest.fn().mockResolvedValue({
              id: 'slip-abc-123',
              slipType: 'PARLAY',
              stake: new Decimal(200.0),
              totalOdds: 3.5,
              potentialPayout: new Decimal(700.0),
            }),
          },
          betDemo: {
            create: jest.fn().mockResolvedValue({}),
          },
          ledgerAccount: {
            upsert: jest.fn().mockResolvedValue({ id: 'house-liab-id' }),
          },
          ledgerTransaction: {
            create: jest.fn().mockResolvedValue({ id: 'ltx-sports-1' }),
          },
          ledgerEntry: {
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'audit-sports-1' }),
          },
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SportsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<SportsService>(SportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('placeBetSlip', () => {
    it('should reject parlay with less than 2 selections', async () => {
      await expect(
        service.placeBetSlip('usr-1', {
          slipType: 'PARLAY',
          stake: 100,
          selections: [{ eventId: 'evt-1', marketId: 'mkt-1', selection: '1', odds: 2.1 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should reject if demo balance is insufficient', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        demoWallet: { balance: new Decimal(50.0) },
        country: { currency: 'MXN' },
      });

      await expect(
        service.placeBetSlip('usr-1', {
          slipType: 'SINGLE',
          stake: 200,
          selections: [{ eventId: 'evt-1', marketId: 'mkt-1', selection: '1', odds: 1.85 }],
        }),
      ).rejects.toThrow(BadRequestException);
    });

    it('should place a valid parlay bet and compute compounded odds', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        demoWallet: { id: 'wallet-1', balance: new Decimal(5000.0), ledgerAccountId: 'acc-1' },
        country: { currency: 'MXN' },
      });

      const res = await service.placeBetSlip('usr-1', {
        slipType: 'PARLAY',
        stake: 200,
        selections: [
          { eventId: 'evt-1', marketId: 'mkt-1', selection: '1', odds: 2.0 },
          { eventId: 'evt-2', marketId: 'mkt-2', selection: '2', odds: 1.75 },
        ],
      });

      expect(res.status).toBe('PENDING');
      expect(res.totalOdds).toBe(3.5);
      expect(res.potentialPayout).toBe(700.0);
      expect(res.slipType).toBe('PARLAY');
    });
  });
});

