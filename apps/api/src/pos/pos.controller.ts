import { Controller, Get, Post, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { PosService } from './pos.service';
import { CreatePosTicketDto } from './dto/create-pos-ticket.dto';
import { RedeemPosTicketDto } from './dto/redeem-pos-ticket.dto';

@ApiTags('Punto de Venta & Retail (POS)')
@Controller('pos')
export class PosController {
  constructor(private readonly posService: PosService) {}

  @Get('agencies')
  @ApiOperation({
    summary: 'Listar agencias y bancas físicas autorizadas',
    description: 'Directorio de puntos de venta y bancas en México y Haití.',
  })
  @ApiQuery({ name: 'country', required: false, enum: ['MX', 'HT'] })
  async getAgencies(@Query('country') country?: string) {
    return this.posService.listAgencies(country);
  }

  @Get('terminals/:code')
  @ApiOperation({
    summary: 'Consultar estado y arqueo de una terminal de venta física',
    description: 'Devuelve datos de la terminal, balance en efectivo en gaveta y estado del turno actual.',
  })
  async getTerminalInfo(@Param('code') code: string) {
    return this.posService.getTerminalInfo(code);
  }

  @Post('tickets/create')
  @ApiOperation({
    summary: 'Emitir e imprimir boleto físico de apuesta en ventanilla (POS Ticket)',
    description:
      'Registra la apuesta pagada en efectivo, genera el código de barras y hash criptográfico anti-fraude y devuelve el formato listo para impresión térmica (58mm/80mm).',
  })
  @ApiResponse({ status: 201, description: 'Boleto físico generado y registrado para impresión' })
  async createTicket(@Body() dto: CreatePosTicketDto) {
    return this.posService.createTicket(dto);
  }

  @Get('tickets/verify/:code')
  @ApiOperation({
    summary: 'Verificar boleto físico mediante escaneo de código de barras o número de ticket',
    description: 'Comprueba validez, estado de los partidos, resultado final y monto a pagar al cliente.',
  })
  async verifyTicket(@Param('code') code: string) {
    return this.posService.verifyTicket(code);
  }

  @Post('tickets/redeem')
  @ApiOperation({
    summary: 'Pagar boleto premiado en ventanilla / efectivo (Cash Payout)',
    description:
      'Liquida el boleto ganador, marca su estado como PAGADO en el sistema central para prevenir doble cobro y descuenta el efectivo de la gaveta.',
  })
  @ApiResponse({ status: 200, description: 'Boleto pagado en efectivo con éxito' })
  async redeemTicket(@Body() dto: RedeemPosTicketDto) {
    return this.posService.redeemTicket(dto);
  }
}

