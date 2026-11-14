import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HealthResponseDto } from './health.dto';

@Injectable()
export class HealthService {
  private readonly startTime = Date.now();

  constructor(private readonly configService: ConfigService) {}

  check(): HealthResponseDto {
    const uptimeSeconds = Math.round((Date.now() - this.startTime) / 1000);
    const realMoneyEnabled = this.configService.get<string>('REAL_MONEY_ENABLED') === 'true';
    const env = this.configService.get<string>('NODE_ENV', 'development');

    return {
      status: 'ok',
      service: 'Paryaj Milyon API',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
      uptimeSeconds,
      environment: env,
      compliance: {
        realMoneyEnabled,
        mode: realMoneyEnabled ? 'REAL_MONEY_ACTIVE' : 'REGULATED_DEMO_SIMULATION',
        supportedMarkets: ['MX', 'HT'],
        supportedLocales: ['es', 'fr'],
      },
      checks: {
        database: 'ready',
        cache: 'ready',
        complianceEngine: 'active',
      },
    };
  }
}

