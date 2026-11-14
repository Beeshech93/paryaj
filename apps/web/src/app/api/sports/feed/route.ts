import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export interface FormattedEvent {
  id: string;
  name: string;
  league: string;
  sport: 'basketball' | 'hockey' | 'football' | 'soccer' | 'other';
  sportLabel: string;
  isLive: boolean;
  minute?: string;
  score?: string;
  time?: string;
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  odds1: number;
  oddsX: number;
  odds2: number;
  hasDraw: boolean;
  oddDetails?: {
    marketId: string;
    bookmaker: string;
    source: string;
    updatedAt?: string;
  };
}

function americanToDecimal(american: string | number | undefined, defaultVal: number): number {
  if (american === undefined || american === null || american === '') return defaultVal;
  const num = typeof american === 'string' ? parseFloat(american.replace('+', '')) : american;
  if (isNaN(num)) return defaultVal;
  if (num > 0) {
    return Math.round(((num / 100) + 1) * 100) / 100;
  } else {
    return Math.round(((100 / Math.abs(num)) + 1) * 100) / 100;
  }
}

function formatStartTime(isoString?: string, fallbackStatus?: string): string {
  if (!isoString) return fallbackStatus || 'Programado';
  try {
    const d = new Date(isoString);
    return d.toLocaleString('es-MX', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return fallbackStatus || 'Programado';
  }
}

const LEAGUES_CONFIG = [
  { id: 'NBA', sport: 'basketball' as const, label: '🏀 NBA (Basketball)', limit: 8 },
  { id: 'NCAAB', sport: 'basketball' as const, label: '🎓 NCAA Basketball', limit: 6 },
  { id: 'NHL', sport: 'hockey' as const, label: '🏒 NHL (Hockey)', limit: 6 },
  { id: 'NFL', sport: 'football' as const, label: '🏈 NFL (Fútbol Americano)', limit: 6 },
  { id: 'UEFA_CHAMPIONS_LEAGUE', sport: 'soccer' as const, label: '⚽ UEFA Champions League', limit: 8 },
  { id: 'MLS', sport: 'soccer' as const, label: '⚽ MLS (Soccer)', limit: 6 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get('market') || 'MX';
  const requestedSport = searchParams.get('sport'); // optional filter: basketball, soccer, etc.
  const apiKey =
    process.env.SPORTSGAMEODDS_API_KEY ||
    process.env.NEXT_PUBLIC_SPORTSGAMEODDS_API_KEY ||
    '5c89b914773bb9b3fae152a8f6a8410f';

  const events: FormattedEvent[] = [];
  let providerSource = 'SPORTSGAMEODDS_V2_MULTI_LEAGUE';

  // 1. Fetch Real Data from SportsGameOdds across all active leagues
  if (apiKey) {
    const fetchPromises = LEAGUES_CONFIG.map(async (cfg) => {
      try {
        const url = `https://api.sportsgameodds.com/v2/events/?leagueID=${cfg.id}&oddsAvailable=true&limit=${cfg.limit}`;
        const res = await fetch(url, {
          headers: {
            'x-api-key': apiKey,
            'Accept': 'application/json',
          },
          cache: 'no-store',
        });

        if (!res.ok) {
          console.warn(`SportsGameOdds league ${cfg.id} returned status ${res.status}`);
          return [];
        }

        const data = await res.json();
        const items = data.data || [];
        if (!Array.isArray(items)) return [];

        const parsed: FormattedEvent[] = [];

        for (const ev of items) {
          const homeName =
            ev.teams?.home?.names?.long ||
            ev.teams?.home?.names?.medium ||
            ev.teams?.home?.names?.short ||
            'Local';
          const awayName =
            ev.teams?.away?.names?.long ||
            ev.teams?.away?.names?.medium ||
            ev.teams?.away?.names?.short ||
            'Visita';

          const isLive = Boolean(ev.status?.live);
          const isCompleted = Boolean(ev.status?.completed);
          const displayStatus = ev.status?.displayLong || ev.status?.displayShort;

          // Scores if available
          const homePts = ev.results?.points?.home ?? ev.results?.home;
          const awayPts = ev.results?.points?.away ?? ev.results?.away;
          const score =
            homePts !== undefined && awayPts !== undefined ? `${homePts} - ${awayPts}` : undefined;

          // Moneyline & 3-Way odds extraction
          const homeML =
            ev.odds?.['points-home-game-ml-home']?.bookOdds ||
            ev.odds?.['points-home-reg-ml3way-home']?.bookOdds;
          const awayML =
            ev.odds?.['points-away-game-ml-away']?.bookOdds ||
            ev.odds?.['points-away-reg-ml3way-away']?.bookOdds;
          const drawML = ev.odds?.['points-all-reg-ml3way-draw']?.bookOdds;

          const odds1 = americanToDecimal(homeML, 1.90);
          const odds2 = americanToDecimal(awayML, 1.90);

          const hasDraw = Boolean(drawML) && cfg.sport === 'soccer';
          const oddsX = drawML ? americanToDecimal(drawML, 3.40) : 0;

          parsed.push({
            id: `sgo:${cfg.id}:${ev.eventID}`,
            name: `${homeName} vs ${awayName}`,
            league: cfg.label,
            sport: cfg.sport,
            sportLabel: cfg.label,
            isLive,
            minute: isLive ? displayStatus || 'LIVE' : undefined,
            score,
            time: isLive ? displayStatus : formatStartTime(ev.status?.startsAt, displayStatus),
            homeTeam: homeName,
            awayTeam: awayName,
            odds1,
            oddsX,
            odds2,
            hasDraw,
            oddDetails: {
              marketId: hasDraw ? 'points-all-reg-ml3way-draw' : 'points-home-game-ml-home',
              bookmaker: 'Consensus / SportsGameOdds Real Feed',
              source: 'api.sportsgameodds.com',
              updatedAt: ev.status?.startsAt,
            },
          });
        }

        return parsed;
      } catch (err) {
        console.warn(`Error fetching league ${cfg.id}:`, err);
        return [];
      }
    });

    const leagueResults = await Promise.allSettled(fetchPromises);
    for (const r of leagueResults) {
      if (r.status === 'fulfilled' && Array.isArray(r.value)) {
        events.push(...r.value);
      }
    }
  }

  // 2. Fetch Real Liga MX from ESPN API Scoreboard (Real games only)
  try {
    const espnMxRes = await fetch(
      'https://site.api.espn.com/apis/site/v2/sports/soccer/mex.1/scoreboard',
      { headers: { 'User-Agent': 'Mozilla/5.0' }, cache: 'no-store' },
    );
    if (espnMxRes.ok) {
      const mxData = await espnMxRes.json();
      if (mxData.events && Array.isArray(mxData.events)) {
        for (const ev of mxData.events) {
          const comp = ev.competitions?.[0];
          const homeCompetitor = comp?.competitors?.find((c: any) => c.homeAway === 'home');
          const awayCompetitor = comp?.competitors?.find((c: any) => c.homeAway === 'away');

          const isLive = comp?.status?.type?.state === 'in';
          const isCompleted = comp?.status?.type?.completed;
          const displayClock = comp?.status?.displayClock || '0\'';
          const homeScore = homeCompetitor?.score || '0';
          const awayScore = awayCompetitor?.score || '0';

          const oddsObj = comp?.odds && comp.odds[0] ? comp.odds[0] : null;
          const mlHome = oddsObj?.moneyline?.home?.close?.odds || oddsObj?.moneyline?.home?.open?.odds;
          const mlAway = oddsObj?.moneyline?.away?.close?.odds || oddsObj?.moneyline?.away?.open?.odds;
          const mlDraw = oddsObj?.moneyline?.draw?.close?.odds || oddsObj?.moneyline?.draw?.open?.odds;

          const homeName = homeCompetitor?.team?.displayName || 'Local';
          const awayName = awayCompetitor?.team?.displayName || 'Visita';

          events.push({
            id: `espn:mx:${ev.id}`,
            name: `${homeName} vs ${awayName}`,
            league: '⚽ Liga BBVA MX (Oficial)',
            sport: 'soccer',
            sportLabel: '⚽ Liga BBVA MX',
            isLive,
            minute: isLive ? displayClock : undefined,
            score: isLive || isCompleted ? `${homeScore} - ${awayScore}` : undefined,
            time: comp?.status?.type?.shortDetail || 'Programado',
            homeTeam: homeName,
            awayTeam: awayName,
            homeLogo: homeCompetitor?.team?.logo,
            awayLogo: awayCompetitor?.team?.logo,
            odds1: americanToDecimal(mlHome, 2.10),
            oddsX: americanToDecimal(mlDraw, 3.35),
            odds2: americanToDecimal(mlAway, 3.25),
            hasDraw: true,
            oddDetails: {
              marketId: 'espn-soccer-ml3way',
              bookmaker: 'ESPN / DraftKings Live Scoreboard',
              source: 'site.api.espn.com',
            },
          });
        }
      }
    }
  } catch (e) {
    console.warn('Error fetching ESPN MX:', e);
  }

  // Sort events: Real LIVE events first, then upcoming events
  events.sort((a, b) => {
    if (a.isLive && !b.isLive) return -1;
    if (!a.isLive && b.isLive) return 1;
    return 0;
  });

  // Filter by sport if requested
  const filteredEvents = requestedSport
    ? events.filter((e) => e.sport === requestedSport)
    : events;

  return NextResponse.json({
    status: 'ok',
    provider: providerSource,
    apiKeyConfigured: Boolean(apiKey),
    market,
    timestamp: new Date().toISOString(),
    count: filteredEvents.length,
    events: filteredEvents,
  });
}
