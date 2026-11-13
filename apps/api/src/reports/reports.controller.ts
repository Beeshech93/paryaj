import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Regulatory & Financial Reports')
@Controller('reports')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('financial')
  @Roles('SUPER_ADMIN', 'AUDITOR', 'COMPLIANCE_OFFICER')
  @ApiOperation({
    summary: 'Reporte del Libro Mayor Contable (Partida Doble e Integridad Financiera)',
    description: 'Balance de activos, pasivos de jugadores, ingresos brutos y gastos de bonificación.',
  })
  @ApiQuery({ name: 'countryCode', required: false, enum: ['MX', 'HT'] })
  async getFinancialReport(@Query('countryCode') countryCode?: string) {
    return this.reportsService.getFinancialLedgerReport(countryCode);
  }

  @Get('compliance/:countryCode')
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR')
  @ApiOperation({
    summary: 'Informe de cumplimiento normativo por jurisdicción (SEGOB México / LEH Haití)',
    description: 'Verificación de políticas de dinero real inactivo, control 18+, autoexclusión y avance KYC.',
  })
  async getComplianceReport(@Param('countryCode') countryCode: string) {
    return this.reportsService.getJurisdictionComplianceReport(countryCode);
  }

  @Get('gaming')
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR')
  @ApiOperation({
    summary: 'Informe de actividad lúdica y métricas de volumen (Casino & Deportes)',
    description: 'Volumen de rondas jugadas, cupones colocados y calibración de RTP.',
  })
  async getGamingReport() {
    return this.reportsService.getGamingActivityReport();
  }
}

