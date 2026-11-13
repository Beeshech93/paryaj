import { Controller, Get, Post, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { SportsService } from './sports.service';
import { TheOddsApiAdapter } from '../providers/adapters/the-odds-api.adapter';
import { CreateBetSlipDto } from './dto/create-bet-slip.dto';
import { SportsQueryDto } from './dto/sports-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Sportsbook & Apuestas Deportivas')
@Controller('sports')
export class SportsController {
  constructor(
    private readonly sportsService: SportsService,
    private readonly oddsAdapter: TheOddsApiAdapter,
  ) {}

  @Get('feed/live')
  @ApiOperation({
    summary: 'Feed de eventos y cuotas reales en tiempo real (The Odds API)',
    description: 'Obtiene partidos y cuotas en directo para México (Liga MX) y Haití (Championnat D1) directamente de las casas de apuestas reales.',
  })
  @ApiQuery({ name: 'market', required: false, enum: ['MX', 'HT'] })
  @ApiQuery({ name: 'sport', required: false })
  async getLiveFeed(@Query('market') market?: string, @Query('sport') sport?: string) {
    return this.oddsAdapter.fetchFixtures(sport || 'soccer', market || 'MX');
  }

  @Get()
  @ApiOperation({
    summary: 'Listar disciplinas deportivas y competiciones activas',
    description: 'Fútbol (Liga MX, Champions), Baloncesto (NBA), Béisbol (MLB), etc.',
  })
  async getSports() {
    return this.sportsService.getSportsWithCompetitions();
  }

  @Get('events')
  @ApiOperation({
    summary: 'Listar eventos deportivos, partidos en vivo y cuotas 1X2',
    description: 'Devuelve marcadores, minutos de juego y cuotas de mercado dinámicas.',
  })
  async getEvents(@Query() query: SportsQueryDto) {
    return this.sportsService.getEvents(query);
  }

  @Get('events/:id')
  @ApiOperation({ summary: 'Obtener detalle de un partido, mercados y cuotas comparativas' })
  async getEventById(@Param('id') id: string) {
    return this.sportsService.getEventById(id);
  }

  @Post('bets/place')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Colocar cupón de apuesta deportiva simulada (Simple o Parlay)',
    description:
      'Valida cuotas y balance demo, calcula la cuota acumulada, descuenta el importe y registra el asiento en el Ledger inmutable.',
  })
  @ApiResponse({ status: 201, description: 'Cupón de apuesta registrado con éxito' })
  @ApiResponse({ status: 400, description: 'Saldo insuficiente o parámetros inválidos' })
  async placeBet(@CurrentUser() user: any, @Body() dto: CreateBetSlipDto) {
    return this.sportsService.placeBetSlip(user.userId, dto);
  }

  @Get('bets/my-bets')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Historial de apuestas del usuario autenticado' })
  @ApiQuery({ name: 'status', required: false, enum: ['PENDING', 'WON', 'LOST'] })
  async getMyBets(@CurrentUser() user: any, @Query('status') status?: string) {
    return this.sportsService.getUserBetSlips(user.userId, status);
  }

  @Post('bets/:id/settle')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER')
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Liquidación simulada de cupón de apuesta (Admin/Compliance)',
    description: 'Permite simular el resultado de un cupón (WON o LOST) y asentar los créditos correspondientes.',
  })
  async settleBet(
    @Param('id') id: string,
    @Body('outcome') outcome: 'WON' | 'LOST',
  ) {
    return this.sportsService.settleBetSlip(id, outcome);
  }
}

