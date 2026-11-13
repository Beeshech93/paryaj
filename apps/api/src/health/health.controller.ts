import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { HealthService } from './health.service';
import { HealthResponseDto } from './health.dto';

@ApiTags('System & Health')
@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  @ApiOperation({
    summary: 'System health, compliance status, and diagnostics',
    description:
      'Returns the platform operational status, environment, uptime, and regulatory compliance flags (real-money disabled by default).',
  })
  @ApiResponse({
    status: 200,
    description: 'System health diagnostics successfully retrieved',
    type: HealthResponseDto,
  })
  getHealth(): HealthResponseDto {
    return this.healthService.check();
  }
}

