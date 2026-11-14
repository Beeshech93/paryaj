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
    this.logger.log(`[SportsGameOdds Reference] Consultando eventos v2 (API Key configurada: ${Boolean(this.apiKey)})`);

    if (!this.apiKey) {
      this.logger.warn('[SportsGameOdds] No se detectó SPORTSGAMEODDS_API_KEY en variables de entorno.');
      return [];
    }

    try {
      // Reference standard: 5-part oddID format {statID}-{statEntityID}-{periodID}-{betTypeID}-{sideID}
      const oddIDs = 'points-home-game-ml-home,points-draw-game-ml-draw,points-away-game-ml-away';
      const url = `${this.baseUrl}/events/?oddsAvailable=true&oddIDs=${oddIDs}&includeOpposingOddIDs=true&limit=25`;

      const response = await fetch(url, {
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

      return events.map((ev) => {
        const homeOddObj = ev.odds?.['points-home-game-ml-home'];
        const drawOddObj = ev.odds?.['points-draw-game-ml-draw'];
        const awayOddObj = ev.odds?.['points-away-game-ml-away'];

        const hBookies = homeOddObj ? Object.values<any>(homeOddObj.bookmakers || {}) : [];
        const dBookies = drawOddObj ? Object.values<any>(drawOddObj.bookmakers || {}) : [];
        const aBookies = awayOddObj ? Object.values<any>(awayOddObj.bookmakers || {}) : [];

        return {
          id: `sgo:${ev.eventID}`,
          name: `${ev.teams?.home?.name || 'Local'} vs ${ev.teams?.away?.name || 'Visita'}`,
          homeTeam: ev.teams?.home?.name,
          awayTeam: ev.teams?.away?.name,
          sport: ev.sportID,
          competition: ev.leagueID,
          scheduled: ev.status?.startsAt,
          status: ev.status?.live ? 'LIVE' : ev.status?.completed ? 'COMPLETED' : 'SCHEDULED',
          provider: this.providerCode,
          odds: {
            home: hBookies[0]?.decimal || 1.95,
            draw: dBookies[0]?.decimal || 3.30,
            away: aBookies[0]?.decimal || 3.60,
          },
        };
      });
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
