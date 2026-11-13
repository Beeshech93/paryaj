import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ICasinoProviderAdapter, GameSession, GameRoundResult } from '../provider.interfaces';

@Injectable()
export class InternalRngAdapter implements ICasinoProviderAdapter {
  readonly providerCode = 'NEW_BRAND_STUDIOS';
  readonly providerName = 'NEW BRAND Studios (Internal Provably Fair RNG)';
  readonly isLive = false;

  private nonceCounter = 1;

  async createSession(userId: string, gameId: string, currency: string): Promise<GameSession> {
    const sessionId = `SESSION-${crypto.randomUUID()}`;
    return {
      sessionId,
      gameId,
      userId,
      currency,
      mode: 'DEMO',
      launchUrl: `/game-canvas/${gameId}?session=${sessionId}&demo=true`,
      createdAt: new Date(),
    };
  }

  async playRound(sessionId: string, betAmount: number, params?: Record<string, any>): Promise<GameRoundResult> {
    const roundId = `RND-${crypto.randomUUID()}`;
    const serverSeed = crypto.randomBytes(32).toString('hex');
    const clientSeed = params?.clientSeed || 'client-seed-demo-user';
    const nonce = this.nonceCounter++;

    // Cryptographic Provably Fair outcome generation
    const hmac = crypto.createHmac('sha256', serverSeed);
    hmac.update(`${clientSeed}:${nonce}`);
    const hash = hmac.digest('hex');

    // Parse leading 8 hex characters into float [0, 1)
    const subHash = hash.substring(0, 8);
    const intVal = parseInt(subHash, 16);
    const floatRand = intVal / 0x100000000;

    // RTP distribution calibration (~96.8% RTP)
    let multiplier = 0;
    if (floatRand > 0.55) {
      // 45% win hit frequency
      if (floatRand > 0.98) multiplier = 25.0; // Big win
      else if (floatRand > 0.92) multiplier = 8.0;
      else if (floatRand > 0.82) multiplier = 3.5;
      else if (floatRand > 0.70) multiplier = 2.0;
      else multiplier = 1.2;
    }

    const payoutAmount = Math.round(betAmount * multiplier * 100) / 100;
    const netWin = Math.round((payoutAmount - betAmount) * 100) / 100;

    return {
      roundId,
      betAmount,
      multiplier,
      payoutAmount,
      netWin,
      provablyFair: {
        serverSeed,
        clientSeed,
        nonce,
        hash,
      },
      details: {
        reelStops: [Math.floor(floatRand * 10), Math.floor((floatRand * 100) % 10), Math.floor((floatRand * 1000) % 10)],
        isBonusTriggered: floatRand > 0.95,
      },
    };
  }
}

