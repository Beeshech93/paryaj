import { Controller, Get, Patch, Param, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { UsersService } from './users.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@ApiTags('Users Management (Admin & Compliance)')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR')
  @ApiOperation({ summary: 'Listar usuarios registrados (Filtro por país y rol)' })
  @ApiQuery({ name: 'countryCode', required: false, enum: ['MX', 'HT'] })
  @ApiQuery({ name: 'role', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  async findAll(
    @Query('countryCode') countryCode?: string,
    @Query('role') role?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.usersService.findAll({ countryCode, role, page, limit });
  }

  @Get(':id')
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER', 'AUDITOR')
  @ApiOperation({ summary: 'Obtener detalle de usuario, wallet, KYC y límites de juego' })
  async findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id/role')
  @Roles('SUPER_ADMIN')
  @ApiOperation({ summary: 'Actualizar rol de un usuario (Solo Super Admin)' })
  async updateRole(@Param('id') id: string, @Body('role') role: string) {
    return this.usersService.updateRole(id, role);
  }

  @Patch(':id/status')
  @Roles('SUPER_ADMIN', 'COMPLIANCE_OFFICER')
  @ApiOperation({ summary: 'Suspender o activar usuario' })
  async updateStatus(@Param('id') id: string, @Body('isActive') isActive: boolean) {
    return this.usersService.updateStatus(id, isActive);
  }
}

