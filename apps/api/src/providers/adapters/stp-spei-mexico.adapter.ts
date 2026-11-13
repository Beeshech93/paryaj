import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { IPaymentProviderAdapter } from '../provider.interfaces';

export interface StpSpeiDepositPayload {
  id: number;
  fechaOperacion: number;
  institucionOrdenante: number;
  institucionBeneficiaria: number;
  claveRastreo: string;
  monto: number;
  nombreOrdenante: string;
  cuentaOrdenante: string;
  cuentaBeneficiaria: string; // CLABE del jugador
  conceptoPago: string;
  firma: string;
}

export interface StpSpeiWithdrawPayload {
  cuentaBeneficiaria: string;
  nombreBeneficiario: string;
  institucionContraparte: number;
  monto: number;
  conceptoPago: string;
  claveRastreo: string;
}

@Injectable()
export class StpSpeiMexicoAdapter implements IPaymentProviderAdapter {
  readonly providerCode = 'STP_SPEI_MEXICO';
  private readonly logger = new Logger(StpSpeiMexicoAdapter.name);

  private readonly stpUrl = process.env.STP_API_URL || 'https://demo.stpmex.com:7024/speiws/rest';
  private readonly stpEmpresa = process.env.STP_EMPRESA || 'NEW_BRAND_MX';
  private readonly isProduction = process.env.REAL_MONEY_ENABLED === 'true';

  async processSimulatedDeposit(walletId: string, amount: number, currency: string) {
    const txId = `SPEI-DEP-${crypto.randomUUID().substring(0, 12).toUpperCase()}`;
    const trackingKey = `STP${Date.now()}`;

    this.logger.log(`[STP SPEI MX] Procesando depósito para Wallet ${walletId}: $${amount} ${currency}`);

    return {
      txId,
      trackingKey,
      status: 'COMPLETED',
      provider: this.providerCode,
      currency,
      timestamp: new Date().toISOString(),
    };
  }

  async processSimulatedWithdrawal(walletId: string, amount: number, destination: string) {
    const txId = `SPEI-WTH-${crypto.randomUUID().substring(0, 12).toUpperCase()}`;
    const trackingKey = `STPOUT${Date.now()}`;

    this.logger.log(
      `[STP SPEI MX] Procesando retiro para Wallet ${walletId}: $${amount} hacia CLABE ${destination}`,
    );

    return {
      txId,
      trackingKey,
      status: 'PROCESSING',
      destinationClabe: destination,
      estimatedMinutes: 2,
    };
  }

  /**
   * Genera una cuenta CLABE única para el usuario en México (Prefijo STP 646)
   */
  generateUserClabe(userId: string): string {
    const bankCode = '646'; // STP
    const plaza = '180';
    // Generate 11-digit deterministic account sequence based on user UUID
    const cleanId = userId.replace(/[^0-9]/g, '');
    const accountDigits = (cleanId + '12345678901').substring(0, 11);
    const rawClabe = `${bankCode}${plaza}${accountDigits}`;

    // Compute check digit (dígito verificador ponderado módulo 10)
    const weights = [3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7, 1, 3, 7];
    let sum = 0;
    for (let i = 0; i < 17; i++) {
      sum += (parseInt(rawClabe.charAt(i), 10) * weights[i]) % 10;
    }
    const checkDigit = (10 - (sum % 10)) % 10;

    return `${rawClabe}${checkDigit}`;
  }

  /**
   * Validación criptográfica de firma digital de webhook de abono STP
   */
  verifyWebhookSignature(payload: StpSpeiDepositPayload, publicKeyPem?: string): boolean {
    if (!this.isProduction) {
      return true; // Bypass en desarrollo / demo
    }

    if (!publicKeyPem) {
      this.logger.warn('STP public key not configured in production');
      return false;
    }

    try {
      const verifier = crypto.createVerify('RSA-SHA256');
      const dataToVerify = `||${payload.institucionOrdenante}|${payload.cuentaBeneficiaria}|${payload.monto}|${payload.claveRastreo}||`;
      verifier.update(dataToVerify);
      return verifier.verify(publicKeyPem, payload.firma, 'base64');
    } catch (err) {
      this.logger.error('Error verifying STP digital signature', err);
      return false;
    }
  }
}

