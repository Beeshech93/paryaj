import { Controller, Post, Body, HttpCode, HttpStatus, Logger, BadRequestException } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { WalletService } from './wallet.service';
import { StpSpeiMexicoAdapter, StpSpeiDepositPayload } from '../providers/adapters/stp-spei-mexico.adapter';
import { MonCashHaitiAdapter } from '../providers/adapters/moncash-haiti.adapter';

@ApiTags('Payment Gateways & Webhooks (Production Ready)')
@Controller('wallet/webhooks')
export class WalletWebhookController {
  private readonly logger = new Logger(WalletWebhookController.name);

  constructor(
    private readonly walletService: WalletService,
    private readonly stpAdapter: StpSpeiMexicoAdapter,
    private readonly moncashAdapter: MonCashHaitiAdapter,
  ) {}

  @Post('stp')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook oficial de Abonos SPEI (STP México)',
    description:
      'Recibe notificaciones de transferencias SPEI entrantes, valida firma criptográfica RSA-SHA256 y asienta el saldo mediante partida doble inmutable.',
  })
  @ApiResponse({ status: 200, description: 'Abono SPEI procesado exitosamente por STP' })
  async handleStpWebhook(@Body() payload: StpSpeiDepositPayload) {
    this.logger.log(`[STP Webhook] Recibida notificación de abono: ClaveRastreo=${payload.claveRastreo}, Monto=$${payload.monto}`);

    const isValidSignature = this.stpAdapter.verifyWebhookSignature(payload);
    if (!isValidSignature) {
      this.logger.error(`[STP Webhook] Firma digital RSA inválida para clave de rastreo: ${payload.claveRastreo}`);
      throw new BadRequestException('Firma digital de webhook STP inválida');
    }

    const result = await this.walletService.processStpDeposit(payload);
    return {
      resultado: {
        id: payload.id,
        status: 'CONFIRMED',
      },
      mensaje: 'Abono SPEI acreditado y registrado en el Ledger contable.',
      txId: result.txId,
    };
  }

  @Post('moncash')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Webhook de confirmación de pago Digicel MonCash (Haití)',
    description:
      'Recibe la confirmación de pago de MonCash, valida el formato telefónico de Haití y acredita los fondos en HTG en la billetera del usuario.',
  })
  @ApiResponse({ status: 200, description: 'Pago MonCash acreditado exitosamente' })
  async handleMonCashWebhook(
    @Body() payload: { orderId: string; reference: string; amount: number; phone?: string; userId?: string },
  ) {
    this.logger.log(`[MonCash Webhook] Recibido pago: Ref=${payload.reference}, Monto=${payload.amount} HTG`);

    if (payload.phone && !this.moncashAdapter.isValidHaitiPhone(payload.phone)) {
      this.logger.warn(`[MonCash Webhook] Número telefónico inválido para Haití: ${payload.phone}`);
    }

    const result = await this.walletService.processMonCashDeposit(payload);
    return {
      status: 'SUCCESS',
      reference: payload.reference,
      currency: 'HTG',
      message: 'Paiement MonCash confirmé et crédité avec succès.',
      txId: result.txId,
    };
  }
}

