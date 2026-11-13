import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CasinoService } from './casino.service';
import { GameQueryDto } from './dto/game-query.dto';
import { PlayRoundDto } from './dto/play-round.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Casino & Digital Games')
@Controller('casino')
export class CasinoController {
  constructor(private readonly casinoService: CasinoService) {}

  @Get('games')
  @ApiOperation({
    summary: 'Catálogo de juegos de casino y filtros por categoría o popularidad',
    description: 'Devuelve títulos paginados con proveedor, RTP certificado, volatilidad e indicadores.',
  })
  async getCatalog(@Query() query: GameQueryDto) {
    return this.casinoService.getCatalog(query);
  }

  @Get('providers')
  @ApiOperation({
    summary: 'Proveedores certificados y adaptadores activos',
    description: 'Lista de adaptadores integrados (NEW BRAND Studios, Pragmatic Mock, Evolution Live Mock).',
  })
  async getProviders() {
    return this.casinoService.listProviders();
  }

  @Get('games/:slug')
  @ApiOperation({ summary: 'Obtener información y especificaciones técnicas de un juego' })
  async getGame(@Param('slug') slug: string) {
    return this.casinoService.getGameBySlug(slug);
  }

  @Post('games/:slug/session')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Iniciar sesión de juego demo',
    description: 'Genera el token de sesión y la URL de ejecución con el adaptador correspondiente.',
  })
  async launchSession(@CurrentUser() user: any, @Param('slug') slug: string) {
    return this.casinoService.launchSession(user.userId, slug);
  }

  @Post('games/:slug/play')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Ejecutar tirada o ronda demo con cálculo Provably Fair y asiento contable',
    description:
      'Debita el importe demo, calcula el resultado mediante el adaptador de juego, acredita el premio y registra los asientos contables en el Ledger inmutable.',
  })
  async playRound(
    @CurrentUser() user: any,
    @Param('slug') slug: string,
    @Body() dto: PlayRoundDto,
  ) {
    return this.casinoService.playRound(user.userId, slug, dto);
  }
}

