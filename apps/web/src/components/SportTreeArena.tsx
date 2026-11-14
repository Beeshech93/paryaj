'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/i18n/context';
import {
  Search,
  ChevronDown,
  ChevronRight,
  Radio,
  Star,
  Clock,
  Check,
  X,
  RefreshCw,
  Zap,
  Flame,
  Ticket,
  Trophy,
  Share2,
} from 'lucide-react';

interface LeagueBranch {
  id: string;
  name: string;
  count: number;
}

interface CountryCategory {
  id: string;
  name: string;
  flag: string;
  count: number;
  leagues: LeagueBranch[];
}

interface TreeMatch {
  id: string;
  leagueId: string;
  leagueName: string;
  country: string;
  flag: string;
  home: string;
  away: string;
  time: string;
  isLive: boolean;
  minute?: string;
  score?: string;
  odds1: number;
  oddsX: number;
  odds2: number;
  over25: number;
  under25: number;
  double1X: number;
  doubleX2: number;
  moreMarketsCount: number;
}

const TREE_COUNTRIES: CountryCategory[] = [
  {
    id: 'ucl',
    name: 'UEFA Champions League',
    flag: '⭐',
    count: 18,
    leagues: [
      { id: 'ucl-phase', name: 'Fase de Liga (League Phase)', count: 18 },
      { id: 'uel-phase', name: 'UEFA Europa League', count: 18 },
      { id: 'uecl-phase', name: 'UEFA Conference League', count: 18 },
    ],
  },
  {
    id: 'national-teams',
    name: 'National teams',
    flag: '🌍',
    count: 65,
    leagues: [
      { id: 'uefa-nations-a', name: 'UEFA Nations League. League A', count: 10 },
      { id: 'uefa-nations-b', name: 'UEFA Nations League. League B', count: 14 },
      { id: 'friendlies', name: 'Friendlies (Amistosos Internacionales)', count: 11 },
      { id: 'concacaf-nations', name: 'CONCACAF Nations League. League A', count: 8 },
      { id: 'afcon-qualif', name: 'Africa Cup of Nations. Qualification', count: 20 },
    ],
  },
  {
    id: 'england',
    name: 'England (Inglaterra)',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    count: 157,
    leagues: [
      { id: 'premier-league', name: 'Premier League', count: 20 },
      { id: 'championship', name: 'Championship', count: 12 },
      { id: 'fa-cup', name: 'FA Cup', count: 20 },
      { id: 'league-cup', name: 'EFL League Cup', count: 4 },
    ],
  },
  {
    id: 'spain',
    name: 'Spain (España)',
    flag: '🇪🇸',
    count: 180,
    leagues: [
      { id: 'laliga', name: 'LaLiga EA Sports', count: 20 },
      { id: 'laliga-hypermotion', name: 'Segunda División (LaLiga Hypermotion)', count: 10 },
      { id: 'copa-del-rey', name: 'Copa del Rey', count: 5 },
    ],
  },
  {
    id: 'italy',
    name: 'Italy (Italia)',
    flag: '🇮🇹',
    count: 137,
    leagues: [
      { id: 'serie-a', name: 'Serie A', count: 20 },
      { id: 'serie-b', name: 'Serie B', count: 10 },
      { id: 'coppa-italia', name: 'Coppa Italia', count: 4 },
    ],
  },
  {
    id: 'germany',
    name: 'Germany (Alemania)',
    flag: '🇩🇪',
    count: 75,
    leagues: [
      { id: 'bundesliga', name: 'Bundesliga', count: 18 },
      { id: 'bundesliga-2', name: '2. Bundesliga', count: 9 },
      { id: 'dfb-pokal', name: 'DFB Pokal', count: 8 },
    ],
  },
  {
    id: 'france',
    name: 'France (Francia)',
    flag: '🇫🇷',
    count: 58,
    leagues: [
      { id: 'ligue-1', name: 'Ligue 1 McDonald’s', count: 18 },
      { id: 'ligue-2', name: 'Ligue 2', count: 9 },
      { id: 'coupe-france', name: 'Coupe de France', count: 17 },
    ],
  },
  {
    id: 'mexico',
    name: 'México',
    flag: '🇲🇽',
    count: 36,
    leagues: [
      { id: 'liga-mx', name: 'Liga MX (Clausura)', count: 18 },
      { id: 'liga-expansion', name: 'Liga de Expansión MX', count: 10 },
    ],
  },
  {
    id: 'haiti',
    name: 'Haïti / Caraïbes',
    flag: '🇭🇹',
    count: 16,
    leagues: [
      { id: 'haiti-d1', name: 'Championnat National D1 Haïti', count: 8 },
      { id: 'cfu-shield', name: 'CFU Club Shield Caraïbes', count: 8 },
    ],
  },
];

const INITIAL_MATCHES: TreeMatch[] = [
  // UCL
  {
    id: 'match-ucl-1',
    leagueId: 'ucl-phase',
    leagueName: 'UEFA Champions League',
    country: 'Europa',
    flag: '⭐',
    home: 'Real Madrid',
    away: 'Manchester City',
    time: '20:00 (Hoy)',
    isLive: true,
    minute: '2T 68\'',
    score: '2 - 1',
    odds1: 2.15,
    oddsX: 3.65,
    odds2: 3.10,
    over25: 1.65,
    under25: 2.25,
    double1X: 1.34,
    doubleX2: 1.68,
    moreMarketsCount: 142,
  },
  {
    id: 'match-ucl-2',
    leagueId: 'ucl-phase',
    leagueName: 'UEFA Champions League',
    country: 'Europa',
    flag: '⭐',
    home: 'Bayern Munich',
    away: 'Paris Saint-Germain',
    time: '20:00 (Hoy)',
    isLive: true,
    minute: '1T 34\'',
    score: '1 - 0',
    odds1: 1.95,
    oddsX: 3.80,
    odds2: 3.70,
    over25: 1.55,
    under25: 2.45,
    double1X: 1.28,
    doubleX2: 1.85,
    moreMarketsCount: 138,
  },
  // Premier League
  {
    id: 'match-epl-1',
    leagueId: 'premier-league',
    leagueName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    home: 'Arsenal',
    away: 'Liverpool',
    time: 'Sábado 12:30',
    isLive: false,
    odds1: 2.40,
    oddsX: 3.50,
    odds2: 2.85,
    over25: 1.72,
    under25: 2.10,
    double1X: 1.42,
    doubleX2: 1.56,
    moreMarketsCount: 115,
  },
  {
    id: 'match-epl-2',
    leagueId: 'premier-league',
    leagueName: 'Premier League',
    country: 'England',
    flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿',
    home: 'Chelsea',
    away: 'Manchester United',
    time: 'Sábado 15:00',
    isLive: false,
    odds1: 1.90,
    oddsX: 3.75,
    odds2: 3.90,
    over25: 1.60,
    under25: 2.30,
    double1X: 1.25,
    doubleX2: 1.92,
    moreMarketsCount: 98,
  },
  // LaLiga
  {
    id: 'match-laliga-1',
    leagueId: 'laliga',
    leagueName: 'LaLiga EA Sports',
    country: 'Spain',
    flag: '🇪🇸',
    home: 'Barcelona',
    away: 'Atlético de Madrid',
    time: 'Domingo 16:00',
    isLive: false,
    odds1: 1.85,
    oddsX: 3.70,
    odds2: 4.10,
    over25: 1.70,
    under25: 2.15,
    double1X: 1.22,
    doubleX2: 1.95,
    moreMarketsCount: 124,
  },
  // Liga MX
  {
    id: 'match-ligamx-1',
    leagueId: 'liga-mx',
    leagueName: 'Liga MX (Clausura)',
    country: 'México',
    flag: '🇲🇽',
    home: 'Club América',
    away: 'Chivas Guadalajara',
    time: 'Sábado 21:00 (CDMX)',
    isLive: false,
    odds1: 1.80,
    oddsX: 3.60,
    odds2: 4.30,
    over25: 1.85,
    under25: 1.95,
    double1X: 1.20,
    doubleX2: 2.00,
    moreMarketsCount: 88,
  },
  {
    id: 'match-ligamx-2',
    leagueId: 'liga-mx',
    leagueName: 'Liga MX (Clausura)',
    country: 'México',
    flag: '🇲🇽',
    home: 'Cruz Azul',
    away: 'Tigres UANL',
    time: 'Domingo 19:00 (CDMX)',
    isLive: false,
    odds1: 2.35,
    oddsX: 3.25,
    odds2: 3.10,
    over25: 1.95,
    under25: 1.85,
    double1X: 1.36,
    doubleX2: 1.60,
    moreMarketsCount: 82,
  },
  // Haiti D1
  {
    id: 'match-haiti-1',
    leagueId: 'haiti-d1',
    leagueName: 'Championnat National D1 Haïti',
    country: 'Haïti',
    flag: '🇭🇹',
    home: 'Violette AC',
    away: 'Racing Club Haïtien',
    time: 'Dimanche 17:00 (Port-au-Prince)',
    isLive: false,
    odds1: 2.10,
    oddsX: 3.15,
    odds2: 3.40,
    over25: 2.05,
    under25: 1.75,
    double1X: 1.30,
    doubleX2: 1.70,
    moreMarketsCount: 46,
  },
];

export const SportTreeArena: React.FC = () => {
  const {
    t,
    market,
    locale,
    isRealMode,
    realBalance,
    demoBalance,
    updateRealBalance,
    updateDemoBalance,
    openWallet,
    addBetSelection,
    removeBetSelection,
    betSelections,
    clearBetSelections,
  } = useApp();

  // Navigation states
  const [activeSport, setActiveSport] = useState<string>('football');
  const [activeFilter, setActiveFilter] = useState<'todo' | 'live' | 'hot'>('todo');
  const [selectedLeague, setSelectedLeague] = useState<string>('all');
  const [expandedCountries, setExpandedCountries] = useState<Record<string, boolean>>({
    ucl: true,
    england: true,
    spain: true,
    mexico: true,
  });
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState<'todos' | 'hoy' | '3h' | '12h'>('todos');
  const [betType, setBetType] = useState<'simple' | 'combinada'>('simple');
  const [quickStake, setQuickStake] = useState<number>(100);
  const [customStake, setCustomStake] = useState<string>('100');
  const [bookingCode, setBookingCode] = useState<string | null>(null);
  const [betFeedback, setBetFeedback] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const currentBalance = isRealMode ? realBalance : demoBalance;

  const sportsBar = [
    { id: 'todo', label: 'Todo', icon: '🌐' },
    { id: 'live', label: 'Live', icon: '🔴', isLive: true },
    { id: 'hot', label: 'Hot', icon: '🔥', isHot: true },
    { id: 'football', label: 'Fútbol', icon: '⚽' },
    { id: 'basketball', label: 'Baloncesto', icon: '🏀' },
    { id: 'baseball', label: 'Béisbol', icon: '⚾' },
    { id: 'american', label: 'Fútbol americano', icon: '🏈' },
    { id: 'tennis', label: 'Tenis', icon: '🎾' },
    { id: 'hockey', label: 'Hockey sobre hielo', icon: '🏒' },
    { id: 'volleyball', label: 'Voleibol', icon: '🏐' },
    { id: 'futsal', label: 'Futsal', icon: '🥅' },
  ];

  const toggleCountry = (countryId: string) => {
    setExpandedCountries((prev) => ({
      ...prev,
      [countryId]: !prev[countryId],
    }));
  };

  const isSelectionActive = (eventId: string, pickName: string) => {
    return betSelections.some((b) => b.eventId === eventId && b.pickName === pickName);
  };

  const handlePickOdds = (
    match: TreeMatch,
    marketName: string,
    pickName: string,
    odds: number,
  ) => {
    const selectionId = `${match.id}-${marketName}-${pickName}`;
    const exists = betSelections.some((b) => b.id === selectionId);
    if (exists) {
      removeBetSelection(selectionId);
    } else {
      addBetSelection({
        id: selectionId,
        eventId: match.id,
        eventName: `${match.home} vs ${match.away}`,
        marketName,
        pickName,
        odds,
      });
    }
  };

  // Filter matches based on tree selection and filters
  const filteredMatches = INITIAL_MATCHES.filter((m) => {
    if (activeFilter === 'live' && !m.isLive) return false;
    if (selectedLeague !== 'all' && m.leagueId !== selectedLeague) return false;
    if (searchQuery.trim() !== '') {
      const q = searchQuery.toLowerCase();
      return (
        m.home.toLowerCase().includes(q) ||
        m.away.toLowerCase().includes(q) ||
        m.leagueName.toLowerCase().includes(q) ||
        m.country.toLowerCase().includes(q)
      );
    }
    return true;
  });

  // Calculate Parlay / Single payouts
  const currentStakeNum = parseFloat(customStake) || quickStake;
  const totalOddsMultiplier = betSelections.reduce((acc, b) => acc * b.odds, 1);
  const potentialPayout =
    betType === 'combinada'
      ? Math.round(currentStakeNum * totalOddsMultiplier * 100) / 100
      : Math.round(
          betSelections.reduce((acc, b) => acc + currentStakeNum * b.odds, 0) * 100,
        ) / 100;

  const handleConfirmBet = () => {
    if (betSelections.length === 0) {
      alert('Selecciona al menos una cuota para apostar');
      return;
    }

    const totalToDeduct =
      betType === 'combinada' ? currentStakeNum : currentStakeNum * betSelections.length;

    if (currentBalance < totalToDeduct) {
      alert(`Saldo insuficiente (${currencySign} ${currentBalance.toFixed(2)}). Por favor recarga.`);
      openWallet('deposit');
      return;
    }

    if (isRealMode) {
      updateRealBalance(-totalToDeduct);
    } else {
      updateDemoBalance(-totalToDeduct);
    }

    setBetFeedback(
      `¡Apuesta ${betType.toUpperCase()} registrada con éxito! Ganancia potencial: ${currencySign} ${potentialPayout.toLocaleString(
        'en-US',
      )} ${currencySymbol}`,
    );

    setTimeout(() => {
      setBetFeedback(null);
      clearBetSelections();
    }, 4000);
  };

  const handleGenerateBookingCode = () => {
    if (betSelections.length === 0) {
      alert('Agrega selecciones para generar el código de taquilla POS');
      return;
    }
    const randCode = 'PM-' + Math.floor(100000 + Math.random() * 900000);
    setBookingCode(randCode);
  };

  return (
    <div id="sports-tree" className="w-full bg-[#070b0f] text-slate-200 font-sans border-b border-[#1b2631]">
      {/* 1. TOP SPORTS SELECTOR BAR (Fútbol, Baloncesto, Tenis, etc.) */}
      <div className="bg-[#0e141a] border-b border-[#1b2530] px-4 py-2.5 overflow-x-auto scrollbar-none sticky top-16 z-20 shadow-md">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto scrollbar-none">
            {sportsBar.map((sp) => {
              const isSelected = activeSport === sp.id;
              return (
                <button
                  key={sp.id}
                  onClick={() => {
                    setActiveSport(sp.id);
                    if (sp.id === 'live') setActiveFilter('live');
                    else if (sp.id === 'hot') setActiveFilter('hot');
                    else setActiveFilter('todo');
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-all ${
                    isSelected
                      ? 'bg-[#10b981] text-black shadow-md shadow-emerald-500/20 scale-105'
                      : 'bg-[#141d26] hover:bg-[#1a2632] text-slate-300 hover:text-white border border-slate-800'
                  }`}
                >
                  <span>{sp.icon}</span>
                  <span>{sp.label}</span>
                </button>
              );
            })}
          </div>

          <div className="hidden lg:flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="px-2 py-1 rounded bg-[#141d26] border border-slate-800 text-emerald-400 font-bold">
              Coeff. DE
            </span>
            <span className="text-[11px] text-slate-500">Formato Decimal</span>
          </div>
        </div>
      </div>

      {/* 2. THREE-COLUMN DESKTOP LAYOUT (Tree Left, Matches Center, BetSlip Right) */}
      <div className="max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* LEFT COLUMN: THE SPORTS & LEAGUE TREE (Cols 1-3) */}
          <div className="lg:col-span-3 bg-[#0d131a] rounded-2xl border border-[#1b2530] p-4 flex flex-col space-y-4 shadow-xl self-start max-h-[880px] overflow-y-auto scrollbar-thin">
            {/* Tree Search */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar país, liga o equipo..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-[#141c25] border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Tree Title & All Leagues shortcut */}
            <div className="flex items-center justify-between pb-2 border-b border-slate-800">
              <span className="text-xs font-black uppercase text-white tracking-wider flex items-center gap-1.5">
                <Trophy className="w-3.5 h-3.5 text-emerald-400" />
                <span>Árbol de Ligas</span>
              </span>
              <button
                onClick={() => setSelectedLeague('all')}
                className={`text-[11px] font-bold px-2 py-0.5 rounded transition-all ${
                  selectedLeague === 'all'
                    ? 'bg-emerald-500 text-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Todas ({INITIAL_MATCHES.length})
              </button>
            </div>

            {/* Tree Accordion by Country */}
            <div className="space-y-1">
              {TREE_COUNTRIES.map((ctry) => {
                const isOpen = expandedCountries[ctry.id] || false;
                return (
                  <div key={ctry.id} className="rounded-xl overflow-hidden border border-slate-800/60 bg-[#101720]/80">
                    {/* Country Header */}
                    <button
                      onClick={() => toggleCountry(ctry.id)}
                      className="w-full flex items-center justify-between p-2.5 hover:bg-[#16202c] transition-colors text-left"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-base select-none">{ctry.flag}</span>
                        <span className="text-xs font-bold text-slate-200 truncate">{ctry.name}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-slate-800 text-slate-400">
                          {ctry.count}
                        </span>
                        {isOpen ? (
                          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                        ) : (
                          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                        )}
                      </div>
                    </button>

                    {/* Sub-Leagues list */}
                    {isOpen && (
                      <div className="bg-[#0b1016] py-1 border-t border-slate-800/80 space-y-0.5">
                        {ctry.leagues.map((lg) => {
                          const isSelected = selectedLeague === lg.id;
                          return (
                            <button
                              key={lg.id}
                              onClick={() => setSelectedLeague(lg.id)}
                              className={`w-full flex items-center justify-between px-3.5 py-1.5 text-[11px] transition-colors ${
                                isSelected
                                  ? 'bg-emerald-500/20 text-emerald-300 font-bold border-l-2 border-emerald-400'
                                  : 'text-slate-400 hover:bg-[#131b24] hover:text-slate-200'
                              }`}
                            >
                              <span className="truncate pr-2">{lg.name}</span>
                              <span className="text-[10px] font-mono text-slate-500 shrink-0">{lg.count}</span>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* CENTER COLUMN: MATCH FIXTURES & ODDS GRID (Cols 4-9) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Filter Bar: Live / Today / Hours */}
            <div className="bg-[#0d131a] rounded-xl border border-[#1b2530] p-3 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveFilter('todo')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === 'todo'
                      ? 'bg-slate-700 text-white'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Todo ({INITIAL_MATCHES.length})
                </button>
                <button
                  onClick={() => setActiveFilter('live')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === 'live'
                      ? 'bg-rose-600 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  Live (2)
                </button>
                <button
                  onClick={() => setActiveFilter('hot')}
                  className={`flex items-center gap-1 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    activeFilter === 'hot'
                      ? 'bg-amber-500 text-black font-black'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <Flame className="w-3.5 h-3.5" />
                  Hot
                </button>
              </div>

              {/* Time Filters */}
              <div className="flex items-center gap-1 text-xs">
                {(['todos', 'hoy', '3h', '12h'] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTimeFilter(t)}
                    className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase transition-all ${
                      timeFilter === t
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Odds Table Column Header */}
            <div className="hidden sm:grid grid-cols-12 gap-2 text-[10px] font-mono font-bold uppercase text-slate-400 px-3 py-1 bg-[#0b1016] rounded-lg border border-slate-800">
              <span className="col-span-5">EVENTO / COMPETICIÓN</span>
              <span className="col-span-1 text-center">1</span>
              <span className="col-span-1 text-center">X</span>
              <span className="col-span-1 text-center">2</span>
              <span className="col-span-1 text-center">+2.5</span>
              <span className="col-span-1 text-center">-2.5</span>
              <span className="col-span-1 text-center">1X</span>
              <span className="col-span-1 text-center">MÁS</span>
            </div>

            {/* Matches List */}
            <div className="space-y-3">
              {filteredMatches.length === 0 ? (
                <div className="p-8 rounded-2xl bg-[#0d131a] border border-slate-800 text-center text-slate-400 text-xs">
                  No se encontraron partidos para la liga o filtro seleccionado.
                </div>
              ) : (
                filteredMatches.map((m) => (
                  <div
                    key={m.id}
                    className="p-3 sm:p-4 rounded-2xl bg-[#0d131a] border border-[#1b2530] hover:border-slate-700 transition-all shadow-md space-y-3"
                  >
                    {/* Top League Title & Live status */}
                    <div className="flex items-center justify-between text-xs text-slate-400 pb-2 border-b border-slate-800/60">
                      <div className="flex items-center gap-2">
                        <span className="select-none">{m.flag}</span>
                        <span className="font-bold text-white text-[11px] sm:text-xs">{m.leagueName}</span>
                        <span className="text-[10px] text-slate-500">• {m.country}</span>
                      </div>

                      {m.isLive ? (
                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-400 font-mono text-[10px] font-bold">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping" />
                          <span>EN VIVO {m.minute}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400 font-mono">
                          <Clock className="w-3 h-3 text-slate-500" />
                          <span>{m.time}</span>
                        </div>
                      )}
                    </div>

                    {/* Match Center: Teams, Score & Odds Row */}
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                      {/* Teams & Score */}
                      <div className="sm:col-span-5 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-white">{m.home}</span>
                          {m.score && (
                            <span className="font-mono font-black text-emerald-400 text-xs">
                              {m.score.split('-')[0]}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs sm:text-sm text-white">{m.away}</span>
                          {m.score && (
                            <span className="font-mono font-black text-emerald-400 text-xs">
                              {m.score.split('-')[1]}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Odds Buttons (1, X, 2, Over, Under, 1X, +Markets) */}
                      <div className="sm:col-span-7 grid grid-cols-7 gap-1.5">
                        {/* 1 */}
                        <button
                          onClick={() => handlePickOdds(m, '1X2', `1 (${m.home})`, m.odds1)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, `1 (${m.home})`)
                              ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-md shadow-emerald-500/30'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">1</span>
                          <span>{m.odds1.toFixed(2)}</span>
                        </button>

                        {/* X */}
                        <button
                          onClick={() => handlePickOdds(m, '1X2', 'Empate (X)', m.oddsX)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, 'Empate (X)')
                              ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-md shadow-emerald-500/30'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">X</span>
                          <span>{m.oddsX.toFixed(2)}</span>
                        </button>

                        {/* 2 */}
                        <button
                          onClick={() => handlePickOdds(m, '1X2', `2 (${m.away})`, m.odds2)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, `2 (${m.away})`)
                              ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-md shadow-emerald-500/30'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-200'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">2</span>
                          <span>{m.odds2.toFixed(2)}</span>
                        </button>

                        {/* +2.5 */}
                        <button
                          onClick={() => handlePickOdds(m, 'Goles Totales', 'Más de 2.5', m.over25)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, 'Más de 2.5')
                              ? 'bg-amber-500 text-black border-amber-300 font-black shadow-md'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">+2.5</span>
                          <span>{m.over25.toFixed(2)}</span>
                        </button>

                        {/* -2.5 */}
                        <button
                          onClick={() => handlePickOdds(m, 'Goles Totales', 'Menos de 2.5', m.under25)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, 'Menos de 2.5')
                              ? 'bg-amber-500 text-black border-amber-300 font-black shadow-md'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">-2.5</span>
                          <span>{m.under25.toFixed(2)}</span>
                        </button>

                        {/* 1X */}
                        <button
                          onClick={() => handlePickOdds(m, 'Doble Oportunidad', '1X', m.double1X)}
                          className={`py-2 rounded-lg font-mono font-bold text-xs transition-all border flex flex-col items-center justify-center ${
                            isSelectionActive(m.id, '1X')
                              ? 'bg-emerald-500 text-black border-emerald-400 font-black shadow-md'
                              : 'bg-[#151d26] hover:bg-[#1c2734] border-slate-800 text-slate-300'
                          }`}
                        >
                          <span className="text-[9px] text-slate-400 sm:hidden">1X</span>
                          <span>{m.double1X.toFixed(2)}</span>
                        </button>

                        {/* More markets button */}
                        <button
                          onClick={() => alert(`Abriendo los ${m.moreMarketsCount} mercados de ${m.home} vs ${m.away}`)}
                          className="py-2 rounded-lg bg-[#111822] hover:bg-[#182330] border border-slate-800 text-slate-400 hover:text-emerald-400 font-mono text-[11px] font-bold transition-all flex items-center justify-center"
                        >
                          +{m.moreMarketsCount}
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* RIGHT COLUMN: BET SLIP / CUPÓN DE APUESTAS (Cols 10-12) */}
          <div className="lg:col-span-3 bg-[#0d131a] rounded-2xl border border-[#1b2530] p-4 flex flex-col justify-between shadow-xl self-start sticky top-28 space-y-4">
            {/* Bet Slip Header */}
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Ticket className="w-4 h-4 text-emerald-400" />
                  <h3 className="font-black text-xs uppercase tracking-wider text-white">Cupón de Apuesta</h3>
                </div>
                {betSelections.length > 0 && (
                  <button
                    onClick={clearBetSelections}
                    className="text-[10px] text-rose-400 hover:text-rose-300 font-bold"
                  >
                    Borrar todo
                  </button>
                )}
              </div>

              {/* Simple / Combinada Switcher */}
              <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-[#141c25] border border-slate-800 mt-3">
                <button
                  onClick={() => setBetType('simple')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    betType === 'simple'
                      ? 'bg-slate-700 text-white shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Simple ({betSelections.length})
                </button>
                <button
                  onClick={() => setBetType('combinada')}
                  className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                    betType === 'combinada'
                      ? 'bg-emerald-500 text-black font-black shadow'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Combinada
                </button>
              </div>

              {/* Selections List */}
              <div className="mt-3 space-y-2 max-h-56 overflow-y-auto pr-1 scrollbar-thin">
                {betSelections.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-500 italic space-y-1">
                    <p>No tienes selecciones activas.</p>
                    <p className="text-[11px] text-slate-600">Haz clic en cualquier cuota para comenzar.</p>
                  </div>
                ) : (
                  betSelections.map((sel) => (
                    <div
                      key={sel.id}
                      className="p-2.5 rounded-xl bg-[#131b24] border border-slate-800 flex items-start justify-between gap-2 relative group"
                    >
                      <div className="space-y-0.5 flex-1 truncate">
                        <span className="text-[10px] text-emerald-400 font-bold block truncate">
                          {sel.eventName}
                        </span>
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-white truncate">{sel.pickName}</span>
                          <span className="text-xs font-mono font-black text-amber-400">
                            {sel.odds.toFixed(2)}
                          </span>
                        </div>
                      </div>
                      <button
                        onClick={() => removeBetSelection(sel.id)}
                        className="text-slate-500 hover:text-rose-400 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Bet Stake, Odds & Summary */}
            <div className="pt-3 border-t border-slate-800 space-y-3">
              {/* Quick Stakes */}
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-bold block mb-1.5">
                  Monto Rápido ({currencySymbol})
                </span>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 250, 500, 1000].map((amt) => (
                    <button
                      key={amt}
                      onClick={() => {
                        setQuickStake(amt);
                        setCustomStake(String(amt));
                      }}
                      className={`py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                        currentStakeNum === amt
                          ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                          : 'bg-[#141c25] hover:bg-[#1a2532] text-slate-300 border-slate-800'
                      }`}
                    >
                      {amt}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom Stake Input */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400">Monto:</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1.5 text-xs text-slate-400 font-mono">{currencySign}</span>
                  <input
                    type="number"
                    min="10"
                    max="100000"
                    value={customStake}
                    onChange={(e) => setCustomStake(e.target.value)}
                    className="w-full pl-7 pr-3 py-1.5 rounded-lg bg-[#0b1016] border border-slate-800 text-xs font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Combined Odds & Payout calculation */}
              <div className="bg-[#121922] p-2.5 rounded-xl border border-slate-800 space-y-1 text-xs">
                {betType === 'combinada' && (
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Cuota Total:</span>
                    <span className="font-mono font-bold text-white">{totalOddsMultiplier.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-300">Ganancia Posible:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    {currencySign}
                    {potentialPayout.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Booking Code Display if generated */}
              {bookingCode && (
                <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-amber-400 uppercase font-bold block">Código de Taquilla POS:</span>
                    <span className="font-mono font-black text-sm tracking-wider">{bookingCode}</span>
                  </div>
                  <span className="text-[10px] bg-amber-500 text-black font-black px-2 py-0.5 rounded">
                    VÁLIDO 24H
                  </span>
                </div>
              )}

              {/* Feedback Alert */}
              {betFeedback && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs text-center font-bold animate-pulse">
                  {betFeedback}
                </div>
              )}

              {/* Actions: Confirm Bet & Generate Booking Code */}
              <div className="space-y-2">
                <button
                  onClick={handleConfirmBet}
                  disabled={betSelections.length === 0}
                  className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-lg ${
                    betSelections.length === 0
                      ? 'bg-slate-800 text-slate-600 cursor-not-allowed'
                      : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-black hover:scale-[1.02] shadow-emerald-500/30'
                  }`}
                >
                  Confirmar Apuesta ({currencySign}
                  {currentStakeNum * (betType === 'simple' ? Math.max(1, betSelections.length) : 1)})
                </button>

                <button
                  onClick={handleGenerateBookingCode}
                  disabled={betSelections.length === 0}
                  className="w-full py-2 rounded-xl bg-[#141c25] hover:bg-[#1a2532] border border-slate-700 text-slate-300 hover:text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <Share2 className="w-3.5 h-3.5 text-amber-400" />
                  <span>Generar Código de Apuesta</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
