import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AffiliatesService } from './affiliates.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Affiliates & Referrals')
@Controller('affiliates')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AffiliatesController {
  constructor(private readonly affiliatesService: AffiliatesService) {}

  @Get('me')
  @ApiOperation({
    summary: 'Panel del afiliado: enlace único de referidos y comisiones simuladas',
    description: 'Devuelve código de referencia, estadísticas de jugadores referidos y comisiones devengadas.',
  })
  async getMyAffiliate(@CurrentUser() user: any) {
    return this.affiliatesService.getOrCreateAffiliate(user.userId);
  }
}

