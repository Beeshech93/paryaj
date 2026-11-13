import { Injectable } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  ICasinoProviderAdapter,
  ILiveCasinoProviderAdapter,
  GameSession,
  GameRoundResult,
} from '../provider.interfaces';

@Injectable()
export class EvolutionLiveMockAdapter implements ICasinoProviderAdapter, ILiveCasinoProviderAdapter {
  readonly providerCode = 'EVOLUTION_LIVE_ADAPTER';
  readonly providerName = 'Evolution Live Casino Adapter (Certified Mock)';
  readonly isLive = true;

  async createSession(userId: string, gameId: string, currency: string): Promise<GameSession> {
    const sessionId = `EVO-LIVE-${crypto.randomUUID()}`;
    return {
      sessionId,
      gameId,
      userId,
      currency,
      mode: 'DEMO',
      launchUrl: `https://mock.evolution.games/live-table/${gameId}?token=${sessionId}&demo=true`,
      createdAt: new Date(),
    };
  }

  async playRound(sessionId: string, betAmount: number, params?: Record<string, any>): Promise<GameRoundResult> {
    const roundId = `EVO-RND-${crypto.randomUUID()}`;
    // European Roulette / Blackjack model (97.3% - 99.2% RTP)
    const outcomes = [0, 0, 1.5, 2.0, 2.0, 3.0, 36.0];
    const multiplier = outcomes[Math.floor(Math.random() * outcomes.length)];
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
        clientSeed: 'live-dealer-shoe-seed',
        nonce: Math.floor(Math.random() * 1000),
        hash: crypto.createHash('sha256').update(roundId).digest('hex'),
      },
      details: {
        dealerName: 'Mariana G.',
        tableId: 'EVO-ROULETTE-VIP-01',
        shoeNumber: 42,
      },
    };
  }

  async listLiveTables() {
    return [
      { id: 'evo-roulette-vip', name: 'Lightning Roulette VIP', gameType: 'ROULETTE', minBet: 10, maxBet: 5000, isOnline: true },
      { id: 'evo-blackjack-plat', name: 'Infinite Blackjack Platinum', gameType: 'BLACKJACK', minBet: 25, maxBet: 10000, isOnline: true },
      { id: 'evo-baccarat-squeeze', name: 'Speed Baccarat Squeeze', gameType: 'BACCARAT', minBet: 20, maxBet: 5000, isOnline: true },
    ];
  }

  async connectTableSession(userId: string, tableId: string) {
    return {
      streamUrl: `wss://mock.evolution.games/stream/${tableId}`,
      token: `EVO-STREAM-${crypto.randomUUID()}`,
    };
  }
}

