import { Injectable, Logger } from '@nestjs/common';
import { ISportsDataProviderAdapter } from '../provider.interfaces';

export interface SportsGameOddsEvent {
  eventID: string;
  sportID: string;
  leagueID: string;
  status: {
    status: string;
    startsAt: string;
    live: boolean;
    completed: boolean;
  };
  teams: {
    home: { name: string; abbreviation?: string };
    away: { name: string; abbreviation?: string };
  };
  odds?: Record<string, {
    oddID: string;
    name: string;
    bookmakers?: Record<string, {
      bookmakerID: string;
      decimal?: number;
      price?: number;
    }>;
  }>;
}

@Injectable()
export class SportsGameOddsAdapter implements ISportsDataProviderAdapter {
  readonly providerCode = 'SPORTSGAMEODDS';
  private readonly logger = new Logger(SportsGameOddsAdapter.name);

  private readonly baseUrl = 'https://api.sportsgameodds.com/v2';
  private readonly apiKey = process.env.SPORTSGAMEODDS_API_KEY;

  async fetchFixtures(sport: string = 'SOCCER', market: string = 'MX'): Promise<any[]> {
    this.logger.log(`[SportsGameOdds] Consultando eventos v2 (API Key configurada: ${Boolean(this.apiKey)})`);

    if (!this.apiKey) {
      this.logger.warn('[SportsGameOdds] No se detectó SPORTSGAMEODDS_API_KEY en variables de entorno.');
      return [];
    }

    try {
      const response = await fetch(`${this.baseUrl}/events/?oddsAvailable=true&limit=25`, {
        headers: {
          'x-api-key': this.apiKey,
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        this.logger.warn(`SportsGameOdds API respondió con status ${response.status}`);
        return [];
      }

      const resJson = await response.json();
      const events: SportsGameOddsEvent[] = resJson.data || resJson.events || [];

      return events.map((ev) => ({
        id: `sgo:${ev.eventID}`,
        name: `${ev.teams?.home?.name || 'Local'} vs ${ev.teams?.away?.name || 'Visita'}`,
        homeTeam: ev.teams?.home?.name,
        awayTeam: ev.teams?.away?.name,
        sport: ev.sportID,
        competition: ev.leagueID,
        scheduled: ev.status?.startsAt,
        status: ev.status?.live ? 'LIVE' : ev.status?.completed ? 'COMPLETED' : 'SCHEDULED',
        provider: this.providerCode,
      }));
    } catch (err) {
      this.logger.error('[SportsGameOdds] Error de conexión con api.sportsgameodds.com', err);
      return [];
    }
  }

  async fetchOdds(eventId: string): Promise<any> {
    return {
      eventId,
      provider: this.providerCode,
      status: 'AVAILABLE',
    };
  }
}
