import { Injectable, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { ILiveCasinoProviderAdapter } from '../provider.interfaces';

export interface EvolutionLiveTable {
  id: string;
  name: string;
  gameType: 'ROULETTE' | 'BLACKJACK' | 'BACCARAT' | 'GAME_SHOW';
  minBet: number;
  maxBet: number;
  isOnline: boolean;
  dealerName: string;
  languages: string[];
}

@Injectable()
export class EvolutionGamingRealAdapter implements ILiveCasinoProviderAdapter {
  readonly providerCode = 'EVOLUTION_LIVE';
  private readonly logger = new Logger(EvolutionGamingRealAdapter.name);

  private readonly casinoKey = process.env.EVOLUTION_CASINO_KEY || 'NEW_BRAND_EVO_LIVE';
  private readonly apiToken = process.env.EVOLUTION_API_TOKEN || 'DEMO_EVO_TOKEN';
  private readonly isProduction = process.env.REAL_MONEY_ENABLED === 'true';

  async listLiveTables(): Promise<Array<{ id: string; name: string; gameType: string; minBet: number; maxBet: number; isOnline: boolean; dealerName: string; language: string }>> {
    this.logger.log(`[Evolution Live] Listando mesas en vivo disponibles para México y Haití`);

    return [
      {
        id: 'evo_roulette_es_1',
        name: 'Ruleta en Vivo México (Español)',
        gameType: 'ROULETTE',
        minBet: 10,
        maxBet: 50000,
        isOnline: true,
        dealerName: 'Valentina',
        language: 'es',
      },
      {
        id: 'evo_blackjack_vip',
        name: 'Blackjack VIP Latino',
        gameType: 'BLACKJACK',
        minBet: 100,
        maxBet: 100000,
        isOnline: true,
        dealerName: 'Mateo',
        language: 'es',
      },
      {
        id: 'evo_lightning_roulette',
        name: 'Lightning Roulette (Multiplicadores 500x)',
        gameType: 'ROULETTE',
        minBet: 5,
        maxBet: 25000,
        isOnline: true,
        dealerName: 'Camila',
        language: 'es',
      },
      {
        id: 'evo_baccarat_fr_1',
        name: 'Speed Baccarat (Français)',
        gameType: 'BACCARAT',
        minBet: 50,
        maxBet: 75000,
        isOnline: true,
        dealerName: 'Jean-Luc',
        language: 'fr',
      },
      {
        id: 'evo_crazy_time',
        name: 'Crazy Time Live Game Show',
        gameType: 'GAME_SHOW',
        minBet: 2,
        maxBet: 50000,
        isOnline: true,
        dealerName: 'Marc & Sophie',
        language: 'fr',
      },
    ];
  }

  async connectTableSession(
    userId: string,
    tableId: string,
    currency: string = 'MXN',
  ): Promise<{ streamUrl: string; token: string; tableId: string; status: string }> {
    const sessionToken = `EVO_SESSION_${crypto.randomUUID()}`;
    this.logger.log(`[Evolution Live] Creando sesión de transmisión para usuario ${userId} en mesa ${tableId}`);

    const streamUrl = this.isProduction
      ? `https://live.evolutiongaming.com/client/live?tableId=${tableId}&token=${sessionToken}&currency=${currency}&lang=es`
      : `https://mock.evolutiongaming.com/stream?table=${tableId}&token=${sessionToken}&currency=${currency}`;

    return {
      streamUrl,
      token: sessionToken,
      tableId,
      status: 'CONNECTED',
    };
  }
}

