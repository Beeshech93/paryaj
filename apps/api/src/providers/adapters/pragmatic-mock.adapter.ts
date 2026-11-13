import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import { ICasinoProviderAdapter, GameSession, GameRoundResult } from '../provider.interfaces';

@Injectable()
export class PragmaticMockAdapter implements ICasinoProviderAdapter {
  readonly providerCode = 'PRAGMATIC_DEMO_ADAPTER';
  readonly providerName = 'Pragmatic Demo Adapter (Certified Mock)';
  readonly isLive = false;

  async createSession(userId: string, gameId: string, currency: string): Promise<GameSession> {
    const sessionId = `PRAG-SESSION-${crypto.randomUUID()}`;
    return {
      sessionId,
      gameId,
      userId,
      currency,
      mode: 'DEMO',
      launchUrl: `https://mock.pragmatic-play.games/launch?game=${gameId}&token=${sessionId}&demo=true`,
      createdAt: new Date(),
    };
  }

  async playRound(sessionId: string, betAmount: number, params?: Record<string, any>): Promise<GameRoundResult> {
    const roundId = `PRAG-RND-${crypto.randomUUID()}`;
    const rand = Math.random();

    // Volatile slot model (~96.5% RTP)
    let multiplier = 0;
    if (rand > 0.62) {
      if (rand > 0.99) multiplier = 50.0;
      else if (rand > 0.95) multiplier = 15.0;
      else if (rand > 0.85) multiplier = 4.0;
      else if (rand > 0.72) multiplier = 2.5;
      else multiplier = 1.0;
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
        serverSeed: crypto.randomBytes(16).toString('hex'),
        clientSeed: 'mock-client-seed',
        nonce: Math.floor(Math.random() * 10000),
        hash: crypto.createHash('sha256').update(roundId).digest('hex'),
      },
      details: {
        provider: 'PRAGMATIC_PLAY_SIMULATED',
        tumbleCount: multiplier > 2 ? 3 : 1,
      },
    };
  }
}

