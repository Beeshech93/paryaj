import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';

describe('WalletService', () => {
  let service: WalletService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      user: {
        findUnique: jest.fn(),
      },
      ledgerTransaction: {
        findUnique: jest.fn(),
      },
      ledgerEntry: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
      $transaction: jest.fn().mockImplementation(async (callback) => {
        return callback({
          ledgerAccount: {
            create: jest.fn().mockResolvedValue({ id: 'acc-1' }),
            upsert: jest.fn().mockResolvedValue({ id: 'house-liab-1' }),
            update: jest.fn().mockResolvedValue({}),
          },
          demoWallet: {
            update: jest.fn().mockResolvedValue({}),
          },
          ledgerTransaction: {
            create: jest.fn().mockResolvedValue({
              id: 'tx-123',
              reference: 'IDEMP-TEST-KEY',
              status: 'COMMITTED',
            }),
          },
          ledgerEntry: {
            createMany: jest.fn().mockResolvedValue({ count: 2 }),
          },
          auditLog: {
            create: jest.fn().mockResolvedValue({ id: 'log-1' }),
          },
        });
      }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('depositDemo', () => {
    it('should deposit funds, increment balance, and commit ledger entries', async () => {
      prisma.ledgerTransaction.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        country: { code: 'MX', currency: 'MXN' },
        demoWallet: {
          id: 'wallet-1',
          balance: new Decimal(10000.0),
          ledgerAccountId: 'acc-1',
          isLocked: false,
        },
      });

      const res = await service.depositDemo('usr-1', {
        amount: 5000.0,
        idempotencyKey: 'IDEMP-KEY-1',
      });

      expect(res.status).toBe('COMMITTED');
      expect(res.amount).toBe(5000.0);
      expect(res.balance).toBe(15000.0);
      expect(res.isIdempotentReplay).toBe(false);
    });

    it('should return existing transaction on duplicate idempotency key (preventing double credit)', async () => {
      prisma.ledgerTransaction.findUnique.mockResolvedValue({
        id: 'tx-existing',
        reference: 'IDEMP-KEY-REPLAY',
        status: 'COMMITTED',
      });
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        country: { code: 'MX', currency: 'MXN' },
        demoWallet: {
          id: 'wallet-1',
          balance: new Decimal(10000.0),
          isLocked: false,
        },
      });

      const res = await service.depositDemo('usr-1', {
        amount: 5000.0,
        idempotencyKey: 'IDEMP-KEY-REPLAY',
      });

      expect(res.isIdempotentReplay).toBe(true);
      expect(res.txId).toBe('tx-existing');
    });
  });

  describe('withdrawDemo', () => {
    it('should reject withdrawal when demo balance is insufficient', async () => {
      prisma.ledgerTransaction.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        country: { code: 'MX', currency: 'MXN' },
        demoWallet: {
          id: 'wallet-1',
          balance: new Decimal(200.0),
          isLocked: false,
        },
      });

      await expect(
        service.withdrawDemo('usr-1', {
          amount: 500.0,
          idempotencyKey: 'IDEMP-WTH-ERR',
        }),
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAuditStatement', () => {
    it('should mathematically verify ledger squareness', async () => {
      prisma.user.findUnique.mockResolvedValue({
        id: 'usr-1',
        country: { code: 'MX', currency: 'MXN' },
        demoWallet: {
          id: 'wallet-1',
          balance: new Decimal(12000.0),
          ledgerAccountId: 'acc-1',
          ledgerAccount: { code: 'WALLET_DEMO_usr-1' },
        },
      });

      prisma.ledgerEntry.findMany.mockResolvedValue([
        { entryType: 'CREDIT', amount: new Decimal(15000.0) },
        { entryType: 'DEBIT', amount: new Decimal(3000.0) },
      ]);

      const stmt = await service.getAuditStatement('usr-1');

      expect(stmt.walletBalance).toBe(12000.0);
      expect(stmt.ledgerSummary.calculatedBalance).toBe(12000.0);
      expect(stmt.auditVerification.isSquareAndBalanced).toBe(true);
      expect(stmt.auditVerification.integrityStatus).toBe('VERIFIED_CRYPTOGRAPHIC_INTEGRITY');
    });
  });
});

