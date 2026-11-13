import { Test, TestingModule } from '@nestjs/testing';
import { ReportsService } from './reports.service';
import { PrismaService } from '../prisma/prisma.service';
import { Decimal } from '@prisma/client/runtime/library';

describe('ReportsService', () => {
  let service: ReportsService;
  let prisma: any;

  beforeEach(async () => {
    prisma = {
      ledgerAccount: {
        findMany: jest.fn().mockResolvedValue([
          { code: 'HOUSE_REVENUE', accountType: 'REVENUE', balance: new Decimal(50000), currency: 'MXN', _count: { entries: 12 } },
          { code: 'BONUS_EXPENSE', accountType: 'EXPENSE', balance: new Decimal(10000), currency: 'MXN', _count: { entries: 5 } },
        ]),
      },
      ledgerTransaction: { count: jest.fn().mockResolvedValue(17) },
      ledgerEntry: { count: jest.fn().mockResolvedValue(34) },
      country: {
        findUnique: jest.fn().mockResolvedValue({
          id: 'c-mx',
          code: 'MX',
          name: 'México',
          currency: 'MXN',
          regulatoryBody: 'SEGOB',
          realMoneyAllowed: false,
          _count: { users: 15, competitions: 4 },
        }),
      },
      kYCRecord: { count: jest.fn().mockResolvedValue(10) },
      responsibleGamingLimit: { count: jest.fn().mockResolvedValue(5) },
      betSlipDemo: { count: jest.fn().mockResolvedValue(40) },
      game: { count: jest.fn().mockResolvedValue(8) },
      auditLog: { count: jest.fn().mockResolvedValue(120) },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        { provide: PrismaService, useValue: prisma },
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getJurisdictionComplianceReport', () => {
    it('should generate compliance report asserting real-money disabled by default', async () => {
      const rep = await service.getJurisdictionComplianceReport('MX');
      expect(rep.jurisdiction.code).toBe('MX');
      expect(rep.jurisdiction.regulatoryBody).toBe('SEGOB');
      expect(rep.complianceStatus.realMoneyOperatingMode).toContain('STRICTLY_DISABLED');
      expect(rep.complianceStatus.ageVerificationEnforced).toContain('+18');
    });
  });
});

