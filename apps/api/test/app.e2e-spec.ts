import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.setGlobalPrefix('api');
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/health (GET)', () => {
    return request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect((res) => {
        expect(res.body.status).toEqual('ok');
        expect(res.body.service).toEqual('NEW BRAND API');
        expect(res.body.compliance.realMoneyEnabled).toBe(false);
        expect(res.body.compliance.mode).toBe('REGULATED_DEMO_SIMULATION');
        expect(res.body.compliance.supportedMarkets).toEqual(['MX', 'HT']);
      });
  });
});

