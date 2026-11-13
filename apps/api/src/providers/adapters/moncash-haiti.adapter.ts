import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { IPaymentProviderAdapter } from '../provider.interfaces';

export interface MonCashOrderPayload {
  orderId: string;
  amount: number;
  receiverPhone?: string;
  description: string;
}

@Injectable()
export class MonCashHaitiAdapter implements IPaymentProviderAdapter {
  readonly providerCode = 'MONCASH_DIGICEL_HAITI';
  private readonly logger = new Logger(MonCashHaitiAdapter.name);

  private readonly moncashUrl = process.env.MONCASH_API_URL || 'https://sandbox.moncashbutton.digicelgroup.com/Api';
  private readonly clientId = process.env.MONCASH_CLIENT_ID || 'DEMO_MONCASH_CLIENT_ID';
  private readonly clientSecret = process.env.MONCASH_CLIENT_SECRET || 'DEMO_MONCASH_SECRET';
  private readonly isProduction = process.env.REAL_MONEY_ENABLED === 'true';

  async processSimulatedDeposit(walletId: string, amount: number, currency: string) {
    const txId = `MONCASH-DEP-${crypto.randomUUID().substring(0, 10).toUpperCase()}`;
    const token = `MC_TOKEN_${Date.now()}`;

    this.logger.log(`[MonCash HT] Generando orden de pago para Wallet ${walletId}: ${amount} HTG`);

    return {
      txId,
      paymentToken: token,
      redirectUrl: `${this.moncashUrl}/Payment/Redirect?token=${token}`,
      status: 'PENDING_APPROVAL',
      provider: this.providerCode,
      currency: 'HTG',
    };
  }

  async processSimulatedWithdrawal(walletId: string, amount: number, destinationPhone: string) {
    const txId = `MONCASH-WTH-${crypto.randomUUID().substring(0, 10).toUpperCase()}`;

    this.logger.log(
      `[MonCash HT] Enviando transferencia de retiro hacia cuenta MonCash ${destinationPhone}: ${amount} HTG`,
    );

    return {
      txId,
      status: 'COMPLETED',
      destinationPhone,
      amount,
      currency: 'HTG',
      reference: `DIGICEL-TX-${Date.now().toString(36).toUpperCase()}`,
    };
  }

  /**
   * Valida el formato de número telefónico MonCash de Haití (+509 o 8 dígitos)
   */
  isValidHaitiPhone(phone: string): boolean {
    const clean = phone.replace(/[^0-9]/g, '');
    if (clean.length === 8) {
      // MonCash Digicel prefijos comunes en Haití: 3, 4
      return /^[34][0-9]{7}$/.test(clean);
    }
    if (clean.length === 11 && clean.startsWith('509')) {
      return /^509[34][0-9]{7}$/.test(clean);
    }
    return false;
  }
}

