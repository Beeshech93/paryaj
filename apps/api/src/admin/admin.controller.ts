import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Admin Dashboard & Compliance Audit')
@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get('metrics')
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR')
  @ApiOperation({
    summary: 'Métricas clave del panel administrativo',
    description: 'Usuarios activos, sesiones demo, distribución por país (MX/HT), alertas de seguridad e integridad contable.',
  })
  async getMetrics() {
    return this.adminService.getDashboardMetrics();
  }

  @Get('audit-logs')
  @Roles('SUPER_ADMIN', 'AUDITOR')
  @ApiOperation({
    summary: 'Registro inmutable de auditoría para trazabilidad regulatoria',
    description: 'Historial de accesos, modificaciones de roles, apuestas y transacciones financieras.',
  })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async getAuditLogs(@Query('page') page?: number, @Query('limit') limit?: number) {
    return this.adminService.getAuditLogs(page, limit);
  }
}

