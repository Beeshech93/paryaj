import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { HealthController } from './health.controller';
import { HealthService } from './health.service';

describe('HealthController', () => {
  let controller: HealthController;
  let service: HealthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [
        HealthService,
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string, defaultValue?: string) => {
              if (key === 'REAL_MONEY_ENABLED') return 'false';
              if (key === 'NODE_ENV') return 'test';
              return defaultValue;
            }),
          },
        },
      ],
    }).compile();

    controller = module.get<HealthController>(HealthController);
    service = module.get<HealthService>(HealthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('getHealth', () => {
    it('should return operational status with real-money disabled by default', () => {
      const result = controller.getHealth();

      expect(result).toHaveProperty('status', 'ok');
      expect(result).toHaveProperty('service', 'NEW BRAND API');
      expect(result).toHaveProperty('version', '0.1.0');
      expect(result).toHaveProperty('compliance');
      expect(result.compliance.realMoneyEnabled).toBe(false);
      expect(result.compliance.mode).toBe('REGULATED_DEMO_SIMULATION');
      expect(result.compliance.supportedMarkets).toContain('MX');
      expect(result.compliance.supportedMarkets).toContain('HT');
      expect(result.compliance.supportedLocales).toContain('es');
      expect(result.compliance.supportedLocales).toContain('fr');
      expect(result.checks.database).toBe('ready');
    });
  });
});

