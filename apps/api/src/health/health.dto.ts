import { ApiProperty } from '@nestjs/swagger';

export class HealthResponseDto {
  @ApiProperty({ example: 'ok', description: 'General system status' })
  status: string;

  @ApiProperty({ example: 'NEW BRAND API', description: 'Platform service name' })
  service: string;

  @ApiProperty({ example: '0.1.0', description: 'Semantic version of the backend API' })
  version: string;

  @ApiProperty({ example: '2026-11-13T15:40:00.000Z', description: 'Current server UTC ISO timestamp' })
  timestamp: string;

  @ApiProperty({ example: 42.15, description: 'Service uptime in seconds' })
  uptimeSeconds: number;

  @ApiProperty({ example: 'development', description: 'Runtime environment' })
  environment: string;

  @ApiProperty({
    example: {
      realMoneyEnabled: false,
      mode: 'REGULATED_DEMO',
      supportedMarkets: ['MX', 'HT'],
      supportedLocales: ['es', 'fr'],
    },
    description: 'Regulatory and compliance runtime enforcement flags',
  })
  compliance: {
    realMoneyEnabled: boolean;
    mode: string;
    supportedMarkets: string[];
    supportedLocales: string[];
  };

  @ApiProperty({
    example: {
      database: 'connected (simulated / supabase-ready)',
      cache: 'ready (in-memory / redis-ready)',
    },
    description: 'Status of dependent internal sub-systems',
  })
  checks: Record<string, string>;
}

