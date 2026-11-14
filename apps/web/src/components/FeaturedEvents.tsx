'use client';

import React from 'react';
import { useApp } from '@/lib/i18n/context';
import { Activity, Clock, Flame, Check } from 'lucide-react';

interface MatchEvent {
  id: string;
  sport: string;
  competition: string;
  homeTeam: string;
  awayTeam: string;
  homeScore?: number;
  awayScore?: number;
  timeInfo: string;
  isLive: boolean;
  odds: {
    home: number;
    draw?: number;
    away: number;
    over25?: number;
    under25?: number;
  };
}

const mockEvents: MatchEvent[] = [
  {
    id: 'evt-1',
    sport: 'football',
    competition: 'Liga MX · México (Clausura)',
    homeTeam: 'Club América',
    awayTeam: 'Guadalajara Chivas',
    homeScore: 1,
    awayScore: 0,
    timeInfo: "68' 2T",
    isLive: true,
    odds: { home: 1.65, draw: 3.4, away: 4.8, over25: 1.9, under25: 1.85 },
  },
  {
    id: 'evt-2',
    sport: 'football',
    competition: 'Concacaf Nations League',
    homeTeam: 'Haïti (Les Grenadiers)',
    awayTeam: 'Jamaica',
    timeInfo: 'Hoy 18:30',
    isLive: false,
    odds: { home: 2.45, draw: 3.1, away: 2.85, over25: 2.1, under25: 1.7 },
  },
  {
    id: 'evt-3',
    sport: 'football',
    competition: 'UEFA Champions League · Cuartos',
    homeTeam: 'Real Madrid',
    awayTeam: 'Manchester City',
    timeInfo: 'Mañana 14:00',
    isLive: false,
    odds: { home: 2.7, draw: 3.5, away: 2.4, over25: 1.65, under25: 2.2 },
  },
  {
    id: 'evt-4',
    sport: 'basketball',
    competition: 'NBA · Temporada Regular',
    homeTeam: 'Los Angeles Lakers',
    awayTeam: 'Golden State Warriors',
    homeScore: 89,
    awayScore: 92,
    timeInfo: 'Q3 04:12',
    isLive: true,
    odds: { home: 2.1, away: 1.75 },
  },
  {
    id: 'evt-5',
    sport: 'baseball',
    competition: 'MLB · Liga Americana',
    homeTeam: 'New York Yankees',
    awayTeam: 'Boston Red Sox',
    timeInfo: 'Hoy 19:05',
    isLive: false,
    odds: { home: 1.8, away: 2.05 },
  },
  {
    id: 'evt-6',
    sport: 'football',
    competition: 'Liga MX · Jornada 14',
    homeTeam: 'Tigres UANL',
    awayTeam: 'Monterrey Rayados',
    timeInfo: 'Sábado 21:05',
    isLive: false,
    odds: { home: 2.15, draw: 3.25, away: 3.3, over25: 1.95, under25: 1.8 },
  },
];

interface FeaturedEventsProps {
  selectedSport: string;
  activeTab: 'live' | 'upcoming';
}

export const FeaturedEvents: React.FC<FeaturedEventsProps> = ({ selectedSport, activeTab }) => {
  const { t, market, addBetSelection, betSelections } = useApp();
  const [realEvents, setRealEvents] = React.useState<MatchEvent[]>(mockEvents);

  React.useEffect(() => {
    let isMounted = true;
    async function load() {
      try {
        const res = await fetch(`/api/sports/feed?market=${market}`);
        if (res.ok) {
          const data = await res.json();
          if (data.events && Array.isArray(data.events) && data.events.length > 0) {
            const mapped: MatchEvent[] = data.events.map((ev: any) => ({
              id: ev.id,
              sport: ev.sport === 'soccer' ? 'football' : ev.sport || 'football',
              competition: ev.league,
              homeTeam: ev.homeTeam || ev.name.split(' vs ')[0] || 'Local',
              awayTeam: ev.awayTeam || ev.name.split(' vs ')[1] || 'Visita',
              timeInfo: ev.time || (ev.isLive ? 'EN VIVO' : 'Programado'),
              isLive: Boolean(ev.isLive),
              odds: {
                home: ev.odds1 || 1.90,
                draw: ev.hasDraw ? ev.oddsX : undefined,
                away: ev.odds2 || 1.90,
                over25: 1.85,
                under25: 1.95,
              },
            }));
            if (isMounted) {
              setRealEvents(mapped);
            }
          }
        }
      } catch (e) {
        console.warn('Error loading featured feed:', e);
      }
    }
    load();
    return () => { isMounted = false; };
  }, [market]);

  const filtered = realEvents.filter((ev) => {
    if (activeTab === 'live' && !ev.isLive) return false;
    if (activeTab === 'upcoming' && ev.isLive) return false;
    if (selectedSport !== 'all' && ev.sport !== selectedSport) return false;
    return true;
  });

  const isSelected = (eventId: string, pickName: string) => {
    return betSelections.some((b) => b.eventId === eventId && b.pickName === pickName);
  };

  const handleSelectOdds = (
    event: MatchEvent,
    marketName: string,
    pickName: string,
    odds: number,
  ) => {
    addBetSelection({
      id: `${event.id}-${pickName}`,
      eventId: event.id,
      eventName: `${event.homeTeam} vs ${event.awayTeam}`,
      marketName,
      pickName,
      odds,
    });
  };

  return (
    <section id="featured-events" className="py-10 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Flame className="w-5 h-5 text-brand-gold" />
            <h3 className="text-xl sm:text-2xl font-black text-white">{t.events.title}</h3>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {filtered.length} eventos disponibles
          </span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-brand-navy/30 border border-brand-navyLight">
            <Activity className="w-8 h-8 text-slate-500 mx-auto mb-2" />
            <p className="text-sm text-slate-400">
              No hay eventos en vivo en esta categoría en este momento. Cambia a &ldquo;Próximos Eventos&rdquo;.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filtered.map((event) => (
              <div
                key={event.id}
                className="rounded-2xl bg-brand-card border border-brand-navyLight hover:border-slate-700 p-5 shadow-lg space-y-4 transition-all"
              >
                {/* Event Header info */}
                <div className="flex items-center justify-between text-xs border-b border-slate-800 pb-3">
                  <span className="text-slate-400 font-medium truncate">{event.competition}</span>
                  <div className="flex items-center gap-2">
                    {event.isLive ? (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-950/80 border border-rose-500/50 text-rose-400 font-mono font-bold text-[11px]">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                        {event.timeInfo}
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-slate-400 font-mono text-[11px]">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {event.timeInfo}
                      </span>
                    )}
                  </div>
                </div>

                {/* Teams & Scores */}
                <div className="flex items-center justify-between">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center justify-between pr-4">
                      <span className="font-bold text-sm sm:text-base text-white">
                        {event.homeTeam}
                      </span>
                      {event.isLive && (
                        <span className="font-mono font-black text-brand-gold text-sm sm:text-base">
                          {event.homeScore}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between pr-4">
                      <span className="font-bold text-sm sm:text-base text-white">
                        {event.awayTeam}
                      </span>
                      {event.isLive && (
                        <span className="font-mono font-black text-brand-gold text-sm sm:text-base">
                          {event.awayScore}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Odds Grid (1 - X - 2 / Moneyline) */}
                <div className="grid grid-cols-3 gap-2 pt-2">
                  {/* Home */}
                  <button
                    onClick={() =>
                      handleSelectOdds(event, 'Ganador del Partido (1X2)', `1 (${event.homeTeam})`, event.odds.home)
                    }
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected(event.id, `1 (${event.homeTeam})`)
                        ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-md'
                        : 'bg-brand-navy/60 hover:bg-brand-navyLight border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold text-slate-400">1</span>
                    <span className="text-sm font-mono font-black">{event.odds.home.toFixed(2)}</span>
                  </button>

                  {/* Draw */}
                  {event.odds.draw ? (
                    <button
                      onClick={() =>
                        handleSelectOdds(event, 'Ganador del Partido (1X2)', 'X (Empate)', event.odds.draw!)
                      }
                      className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                        isSelected(event.id, 'X (Empate)')
                          ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-md'
                          : 'bg-brand-navy/60 hover:bg-brand-navyLight border-slate-800 text-slate-200'
                      }`}
                    >
                      <span className="text-[10px] uppercase font-semibold text-slate-400">X (Empate)</span>
                      <span className="text-sm font-mono font-black">{event.odds.draw.toFixed(2)}</span>
                    </button>
                  ) : (
                    <div className="p-2.5 rounded-xl bg-brand-navy/20 border border-slate-800 flex items-center justify-center text-[10px] text-slate-600">
                      N/A
                    </div>
                  )}

                  {/* Away */}
                  <button
                    onClick={() =>
                      handleSelectOdds(event, 'Ganador del Partido (1X2)', `2 (${event.awayTeam})`, event.odds.away)
                    }
                    className={`p-2.5 rounded-xl border flex flex-col items-center justify-center transition-all ${
                      isSelected(event.id, `2 (${event.awayTeam})`)
                        ? 'bg-brand-gold text-black border-brand-gold font-bold shadow-md'
                        : 'bg-brand-navy/60 hover:bg-brand-navyLight border-slate-800 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-semibold text-slate-400">2</span>
                    <span className="text-sm font-mono font-black">{event.odds.away.toFixed(2)}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

