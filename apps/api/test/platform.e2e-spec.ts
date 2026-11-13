import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';
import { HttpExceptionFilter } from '../src/common/filters/http-exception.filter';

describe('NEW BRAND Platform Core (e2e)', () => {
  let app: INestApplication;

  const mockPrisma = {
    $connect: jest.fn(),
    $disconnect: jest.fn(),
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
      findUnique: jest.fn().mockImplementation(({ where }) => {
        if (where.slug === 'aztec-sunburst-1000') {
          return Promise.resolve({
            id: 'g-1',
            title: 'Aztec Sunburst 1000',
            slug: 'aztec-sunburst-1000',
            provider: { code: 'NEW_BRAND_STUDIOS', name: 'NEW BRAND Studios' },
            rtp: 96.8,
          });
        }
        return Promise.resolve(null);
      }),
    },
    gameProvider: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    sport: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'sp-1', name: 'Fútbol', slug: 'futbol', competitions: [] },
      ]),
    },
    event: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'evt-1',
          homeTeam: 'Club América',
          awayTeam: 'Guadalajara Chivas',
          status: 'LIVE',
          scheduledStart: new Date(),
          competition: { name: 'Liga MX', sport: { name: 'Fútbol' } },
          markets: [],
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({ id: 'evt-1', homeTeam: 'Club América' }),
    },
    promotion: {
      findMany: jest.fn().mockResolvedValue([
        { id: 'p-1', title: 'Bono Bienvenida', slug: 'bono-bienvenida', bonusAmount: 10000, isActive: true },
      ]),
    },
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(PrismaService)
      .useValue(mockPrisma)
      .compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    app.useGlobalFilters(new HttpExceptionFilter());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('1. Health & Regulatory Diagnostics', () => {
    it('/api/health (GET) should report healthy status with real money strictly disabled', async () => {
      const res = await request(app.getHttpServer()).get('/api/health').expect(200);

      expect(res.body.status).toBe('ok');
      expect(res.body.compliance.realMoneyEnabled).toBe(false);
      expect(res.body.compliance.mode).toBe('REGULATED_DEMO_SIMULATION');
      expect(res.body.compliance.supportedMarkets).toContain('MX');
      expect(res.body.compliance.supportedMarkets).toContain('HT');
    });
  });

  describe('2. Casino & Gaming Catalog', () => {
    it('/api/casino/games (GET) should return games catalog with RTP specifications', async () => {
      const res = await request(app.getHttpServer()).get('/api/casino/games').expect(200);

      expect(res.body).toHaveProperty('data');
      expect(res.body).toHaveProperty('meta');
      expect(Array.isArray(res.body.data)).toBe(true);
      expect(res.body.data[0].title).toBe('Aztec Sunburst 1000');
    });

    it('/api/casino/providers (GET) should list certified mock and internal adapters', async () => {
      const res = await request(app.getHttpServer()).get('/api/casino/providers').expect(200);

      expect(Array.isArray(res.body)).toBe(true);
      const providerCodes = res.body.map((p: any) => p.code);
      expect(providerCodes).toContain('NEW_BRAND_STUDIOS');
      expect(providerCodes).toContain('PRAGMATIC_DEMO_ADAPTER');
      expect(providerCodes).toContain('EVOLUTION_LIVE_ADAPTER');
    });
  });

  describe('3. Sportsbook & Feeds', () => {
    it('/api/sports (GET) should list active sports disciplines and competitions', async () => {
      const res = await request(app.getHttpServer()).get('/api/sports').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].name).toBe('Fútbol');
    });

    it('/api/sports/events (GET) should return matches and markets', async () => {
      const res = await request(app.getHttpServer()).get('/api/sports/events').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].homeTeam).toBe('Club América');
    });
  });

  describe('4. Promotions & Marketing', () => {
    it('/api/promotions (GET) should return active demo promotion packages', async () => {
      const res = await request(app.getHttpServer()).get('/api/promotions').expect(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body[0].title).toBe('Bono Bienvenida');
    });
  });

  describe('5. Security & Standardized Exception Filter', () => {
    it('should catch 404 errors with the standardized security envelope', async () => {
      const res = await request(app.getHttpServer())
        .get('/api/casino/games/unregistered-game-slug-xyz')
        .expect(404);

      expect(res.body).toHaveProperty('statusCode', 404);
      expect(res.body).toHaveProperty('timestamp');
      expect(res.body).toHaveProperty('path', '/api/casino/games/unregistered-game-slug-xyz');
      expect(res.body).toHaveProperty('complianceNote');
    });
  });
});
