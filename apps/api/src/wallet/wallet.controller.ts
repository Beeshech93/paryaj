import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { DepositDemoDto } from './dto/deposit-demo.dto';
import { WithdrawDemoDto } from './dto/withdraw-demo.dto';
import { WalletHistoryQueryDto } from './dto/wallet-history-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@ApiTags('Wallet & Inmutable Ledger')
@Controller('wallet')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class WalletController {
  constructor(private readonly walletService: WalletService) {}

  @Get('balance')
  @ApiOperation({
    summary: 'Consultar saldo demo disponible y estado de la cuenta contable',
    description: 'Devuelve balance demo, divisa del mercado (MXN/HTG), estado y código de cuenta en el Ledger.',
  })
  async getBalance(@CurrentUser() user: any) {
    return this.walletService.getBalance(user.userId);
  }

  @Post('deposit')
  @ApiOperation({
    summary: 'Recarga de saldo demo con clave de idempotencia y partida doble contable',
    description:
      'Acredita fondos de demostración de manera atómica, garantizando que repeticiones con la misma clave de idempotencia no dupliquen saldo.',
  })
  @ApiResponse({ status: 201, description: 'Recarga acreditada exitosamente' })
  async deposit(@CurrentUser() user: any, @Body() dto: DepositDemoDto) {
    return this.walletService.depositDemo(user.userId, dto);
  }

  @Post('withdraw')
  @ApiOperation({
    summary: 'Solicitud de retiro simulado con verificación contable e idempotencia',
    description: 'Debita saldo demo y asienta la partida doble correspondiente en el Ledger.',
  })
  @ApiResponse({ status: 201, description: 'Retiro simulado procesado exitosamente' })
  @ApiResponse({ status: 400, description: 'Saldo demo insuficiente' })
  async withdraw(@CurrentUser() user: any, @Body() dto: WithdrawDemoDto) {
    return this.walletService.withdrawDemo(user.userId, dto);
  }

  @Get('transactions')
  @ApiOperation({
    summary: 'Historial inmutable de movimientos contables del usuario en el Ledger',
    description: 'Lista paginada de asientos de débito y crédito con referencias de trazabilidad.',
  })
  async getTransactions(@CurrentUser() user: any, @Query() query: WalletHistoryQueryDto) {
    return this.walletService.getTransactions(user.userId, query);
  }

  @Get('audit-statement')
  @ApiOperation({
    summary: 'Extracto de auditoría contable y verificación de cuadre matemático',
    description: 'Calcula la suma de débitos y créditos del Libro Mayor y certifica la consistencia contra el saldo de la billetera.',
  })
  async getAuditStatement(@CurrentUser() user: any) {
    return this.walletService.getAuditStatement(user.userId);
  }
}

