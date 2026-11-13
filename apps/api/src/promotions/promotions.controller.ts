import { Controller, Get, Post, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PromotionsService } from './promotions.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Promotions & Bonificaciones Demo')
@Controller('promotions')
export class PromotionsController {
  constructor(private readonly promotionsService: PromotionsService) {}

  @Get()
  @ApiOperation({
    summary: 'Listar promociones y paquetes de bonos demo activos',
    description: 'Devuelve bonos de bienvenida, multiplicadores de cuotas y cashbacks disponibles.',
  })
  async list() {
    return this.promotionsService.listActivePromotions();
  }

  @Post(':slug/claim')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Reclamar y activar un bono demo con asiento contable',
    description:
      'Valida que la promoción no haya sido reclamada previamente, acredita el monto demo en la billetera y registra el asiento en el Ledger inmutable.',
  })
  @ApiResponse({ status: 200, description: 'Bono demo activado con éxito' })
  @ApiResponse({ status: 409, description: 'La promoción ya fue reclamada previamente por el usuario' })
  async claim(@CurrentUser() user: any, @Param('slug') slug: string) {
    return this.promotionsService.claimPromotion(user.userId, slug);
  }
}

