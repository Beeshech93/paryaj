import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('PrismaService', () => {
  let service: PrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined with all domain delegates ready', () => {
    expect(service).toBeDefined();
    // Verify essential domain models exist on Prisma client
    expect(service.user).toBeDefined();
    expect(service.profile).toBeDefined();
    expect(service.role).toBeDefined();
    expect(service.country).toBeDefined();
    expect(service.kYCRecord).toBeDefined();
    expect(service.game).toBeDefined();
    expect(service.gameProvider).toBeDefined();
    expect(service.sport).toBeDefined();
    expect(service.competition).toBeDefined();
    expect(service.event).toBeDefined();
    expect(service.market).toBeDefined();
    expect(service.oddsSnapshot).toBeDefined();
    expect(service.demoWallet).toBeDefined();
    expect(service.ledgerAccount).toBeDefined();
    expect(service.ledgerTransaction).toBeDefined();
    expect(service.ledgerEntry).toBeDefined();
    expect(service.betSlipDemo).toBeDefined();
    expect(service.betDemo).toBeDefined();
    expect(service.promotion).toBeDefined();
    expect(service.affiliate).toBeDefined();
    expect(service.auditLog).toBeDefined();
    expect(service.responsibleGamingLimit).toBeDefined();
  });
});

