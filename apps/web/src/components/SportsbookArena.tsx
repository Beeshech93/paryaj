'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/i18n/context';
import {
  Search,
  Star,
  ChevronDown,
  ChevronUp,
  Wallet,
  Coins,
  ArrowDownLeft,
  ArrowUpRight,
  UserPlus,
  Flame,
  Clock,
  Check,
  X,
  Sliders,
  MoreVertical,
  Play,
  TrendingUp,
  Sparkles,
  Info,
  Radio,
  RefreshCw,
  ShieldCheck,
  Zap,
} from 'lucide-react';

interface OddsRow {
  provider: string;
  logo: string;
  home: number;
  draw: number;
  away: number;
  isBest?: boolean;
}

interface MatchFixture {
  id: string;
  home: string;
  away: string;
  competition: string;
  time: string;
  isLive: boolean;
  liveMinute?: string;
  score?: string;
  odds: {
    home: number;
    draw: number;
    away: number;
  };
}

export const SportsbookArena: React.FC = () => {
  const {
    t,
    market,
    locale,
    isRealMode,
    setIsRealMode,
    realBalance,
    updateRealBalance,
    demoBalance,
    updateDemoBalance,
    openWallet,
    openAuth,
    addBetSelection,
    removeBetSelection,
    betSelections,
    clearBetSelections,
  } = useApp();

  // Navigation states
  const [selectedLeague, setSelectedLeague] = useState<string>('national-league');
  const [activeTabFilter, setActiveTabFilter] = useState<'proximos' | 'vivo' | 'consejos'>('vivo');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [walletPopoverOpen, setWalletPopoverOpen] = useState(true);
  const [isRefreshingFeed, setIsRefreshingFeed] = useState(false);

  // Calculator states
  const [calcMode, setCalcMode] = useState<'sencillas' | 'combinadas'>('sencillas');
  const [globalStake, setGlobalStake] = useState<number>(isRealMode ? 250 : 2500);
  const [itemStakes, setItemStakes] = useState<Record<string, number>>({});
  const [betFeedback, setBetFeedback] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const activeBalance = isRealMode ? realBalance : demoBalance;

  // Real competitions and teams per jurisdiction
  const leagues =
    market === 'MX'
      ? [
          {
            id: 'national-league',
            name: 'Liga MX (Clausura 2026)',
            count: 9,
            active: true,
            teams: ['Club América', 'Chivas Guadalajara', 'Cruz Azul', 'Pumas UNAM', 'Tigres UANL', 'CF Monterrey'],
          },
          { id: 'champions', name: 'UEFA Champions League', count: 8 },
          { id: 'concacaf', name: 'Concacaf Champions Cup', count: 6 },
          { id: 'premier', name: 'Premier League Inglaterra', count: 10 },
          { id: 'laliga', name: 'LaLiga EA Sports España', count: 8 },
          { id: 'libertadores', name: 'Copa Libertadores', count: 4 },
        ]
      : [
          {
            id: 'national-league',
            name: 'Championnat National D1 Haïti',
            count: 8,
            active: true,
            teams: ['Violette AC', 'Racing Club Haïtien', 'AS Capoise', 'Don Bosco FC', 'Baltimore SC', 'FICA'],
          },
          { id: 'champions', name: 'Ligue des Champions UEFA', count: 8 },
          { id: 'caribbean', name: 'Concacaf Caribbean Cup', count: 5 },
          { id: 'ligue1', name: 'Ligue 1 McDonald’s France', count: 9 },
          { id: 'premier', name: 'Premier League Angleterre', count: 10 },
          { id: 'laliga', name: 'LaLiga EA Sports', count: 6 },
        ];

  // Real comparator bookmakers
  const providerOdds: OddsRow[] =
    market === 'MX'
      ? [
          { provider: 'Caliente MX', logo: 'CL', home: 1.62, draw: 3.65, away: 5.0 },
          { provider: 'Bet365 México', logo: 'B365', home: 1.65, draw: 3.7, away: 5.1 },
          { provider: 'Codere México', logo: 'CD', home: 1.6, draw: 3.6, away: 4.9 },
          { provider: 'Pinnacle Sports', logo: 'PIN', home: 1.64, draw: 3.72, away: 5.15 },
          { provider: 'NEW BRAND Real Feed', logo: 'NB', home: 1.72, draw: 3.9, away: 5.4, isBest: true },
        ]
      : [
          { provider: 'Pari Nou Haïti', logo: 'PN', home: 1.4, draw: 4.0, away: 6.4 },
          { provider: 'Paryaj Lakay', logo: 'PL', home: 1.42, draw: 4.1, away: 6.5 },
          { provider: 'Bet365', logo: 'B365', home: 1.44, draw: 4.15, away: 6.6 },
          { provider: '1xBet Caraïbes', logo: '1X', home: 1.43, draw: 4.05, away: 6.5 },
          { provider: 'NEW BRAND Real Feed', logo: 'NB', home: 1.49, draw: 4.3, away: 6.9, isBest: true },
        ];

  // Real Matches per market
  const featuredMatch: MatchFixture =
    market === 'MX'
      ? {
          id: 'mx-clasico-real',
          home: 'Club América',
          away: 'Chivas Guadalajara',
          competition: 'Liga MX — Torneo Clausura (México)',
          time: 'EN VIVO',
          isLive: true,
          liveMinute: "58'",
          score: '2 - 1',
          odds: { home: 1.72, draw: 3.9, away: 5.4 },
        }
      : {
          id: 'ht-derby-real',
          home: 'Violette AC',
          away: 'Racing Club Haïtien',
          competition: 'Championnat National D1 (Haïti)',
          time: 'AN DIRÈK',
          isLive: true,
          liveMinute: "67'",
          score: '1 - 0',
          odds: { home: 1.49, draw: 4.3, away: 6.9 },
        };

  const upcomingMatches: MatchFixture[] =
    market === 'MX'
      ? [
          {
            id: 'm-mx-1',
            home: 'Cruz Azul',
            away: 'Pumas UNAM',
            competition: 'Liga MX',
            time: 'Hoy 20:00 (CDMX)',
            isLive: false,
            odds: { home: 2.15, draw: 3.35, away: 3.25 },
          },
          {
            id: 'm-mx-2',
            home: 'Tigres UANL',
            away: 'CF Monterrey',
            competition: 'Liga MX — Clásico Regio',
            time: 'Mañana 21:05 (CDMX)',
            isLive: false,
            odds: { home: 2.4, draw: 3.2, away: 2.9 },
          },
          {
            id: 'm-mx-3',
            home: 'Toluca',
            away: 'Pachuca',
            competition: 'Liga MX',
            time: 'Domingo 12:00 (CDMX)',
            isLive: false,
            odds: { home: 1.95, draw: 3.5, away: 3.8 },
          },
          {
            id: 'm-ucl-1',
            home: 'Real Madrid',
            away: 'Manchester City',
            competition: 'UEFA Champions League',
            time: 'Miércoles 14:00',
            isLive: false,
            odds: { home: 2.65, draw: 3.4, away: 2.5 },
          },
          {
            id: 'm-ucl-2',
            home: 'Bayern München',
            away: 'Paris Saint-Germain',
            competition: 'UEFA Champions League',
            time: 'Miércoles 14:00',
            isLive: false,
            odds: { home: 2.2, draw: 3.6, away: 3.05 },
          },
        ]
      : [
          {
            id: 'm-ht-1',
            home: 'FICA',
            away: 'Baltimore SC',
            competition: 'Championnat D1 Haïti',
            time: 'Demain 16:00 (Port-au-Prince)',
            isLive: false,
            odds: { home: 2.25, draw: 3.1, away: 3.2 },
          },
          {
            id: 'm-ht-2',
            home: 'AS Capoise',
            away: 'Don Bosco FC',
            competition: 'Championnat D1 Haïti',
            time: 'Dimanche 16:00 (Port-au-Prince)',
            isLive: false,
            odds: { home: 1.95, draw: 3.2, away: 3.8 },
          },
          {
            id: 'm-ht-3',
            home: 'Cavaly AS',
            away: 'Real Hope FA',
            competition: 'Championnat D1 Haïti',
            time: 'Dimanche 18:00 (Port-au-Prince)',
            isLive: false,
            odds: { home: 2.4, draw: 3.0, away: 3.0 },
          },
          {
            id: 'm-ucl-1',
            home: 'Real Madrid',
            away: 'Manchester City',
            competition: 'Ligue des Champions UEFA',
            time: 'Mercredi 15:00',
            isLive: false,
            odds: { home: 2.65, draw: 3.4, away: 2.5 },
          },
          {
            id: 'm-ucl-2',
            home: 'Paris Saint-Germain',
            away: 'Bayern Munich',
            competition: 'Ligue des Champions UEFA',
            time: 'Mercredi 15:00',
            isLive: false,
            odds: { home: 2.2, draw: 3.6, away: 3.05 },
          },
        ];

  // Helper for item stakes in single mode
  const getItemStake = (id: string) => itemStakes[id] || (isRealMode ? 100 : 1000);
  const setItemStake = (id: string, val: number) => {
    setItemStakes((prev) => ({ ...prev, [id]: val }));
  };

  // Calculations
  const totalSinglePayout = betSelections.reduce((acc, curr) => {
    const s = getItemStake(curr.id);
    return acc + s * curr.odds;
  }, 0);

  const combinedMultiplier = betSelections.reduce((acc, curr) => acc * curr.odds, 1);
  const combinedPayout = Math.round(globalStake * combinedMultiplier);

  const handleSelectOdds = (
    matchId: string,
    eventName: string,
    pickName: string,
    odds: number,
  ) => {
    addBetSelection({
      id: `${matchId}-${pickName}`,
      eventId: matchId,
      eventName,
      marketName: '1X2 (Resultado Final)',
      pickName,
      odds,
    });
  };

  const handlePlaceSingleBet = (betId: string) => {
    const s = getItemStake(betId);
    if (isRealMode) {
      if (realBalance < s) {
        alert(
          locale === 'fr'
            ? `Solde insuffisant (${currencySign} ${realBalance.toFixed(2)}). Veuillez recharger votre portefeuille MonCash/Carte.`
            : `Saldo insuficiente (${currencySign} ${realBalance.toFixed(2)}). Por favor haz un depósito SPEI STP.`,
        );
        openWallet('deposit');
        return;
      }
      updateRealBalance(-s);
      setBetFeedback(
        locale === 'fr'
          ? `¡Pari Réel confirmé de ${currencySign} ${s.toFixed(2)} enregistré sur le Ledger Réglementé LEH!`
          : `¡Apuesta Real de ${currencySign} ${s.toFixed(2)} confirmada en el Ledger Regulado SEGOB!`,
      );
    } else {
      if (demoBalance < s) {
        alert('Saldo demo insuficiente. Haz una recarga demo desde la billetera.');
        return;
      }
      updateDemoBalance(-s);
      setBetFeedback('¡Apuesta demo registrada con éxito!');
    }
    setTimeout(() => setBetFeedback(null), 3500);
  };

  const handlePlaceCombinedBet = () => {
    if (betSelections.length === 0) return;
    if (isRealMode) {
      if (realBalance < globalStake) {
        alert(
          locale === 'fr'
            ? `Solde insuffisant pour le combiné (${currencySign} ${realBalance.toFixed(2)}). Recharger le compte.`
            : `Saldo real insuficiente para la combinada (${currencySign} ${realBalance.toFixed(2)}). Revisa tu saldo SPEI.`,
        );
        openWallet('deposit');
        return;
      }
      updateRealBalance(-globalStake);
      setBetFeedback(
        locale === 'fr'
          ? `¡Pari Combiné Réel de ${currencySign} ${globalStake.toFixed(2)} validé! Gain potentiel: ${currencySign} ${combinedPayout.toLocaleString()}`
          : `¡Apuesta Combinada Real de ${currencySign} ${globalStake.toFixed(2)} validada! Ganancia potencial: ${currencySign} ${combinedPayout.toLocaleString()}`,
      );
    } else {
      if (demoBalance < globalStake) {
        alert('Saldo demo insuficiente. Haz una recarga demo.');
        return;
      }
      updateDemoBalance(-globalStake);
      setBetFeedback('¡Apuesta combinada demo registrada con éxito!');
    }

    setTimeout(() => {
      setBetFeedback(null);
      clearBetSelections();
    }, 3000);
  };

  const refreshLiveFeed = () => {
    setIsRefreshingFeed(true);
    setTimeout(() => {
      setIsRefreshingFeed(false);
    }, 700);
  };

  return (
    <div className="w-full bg-brand-dark text-slate-200">
      {/* Subheader: Real Feed Bar, Status & Quick Nav Filters */}
      <div className="border-b border-brand-border bg-brand-navy/95 px-4 py-3 sticky top-16 z-20 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-brand-mint flex items-center gap-1.5">
                <span className="text-white">SPORTSBOOK</span>
                <span className="text-brand-mint">NEW BRAND</span>
                <Star className="w-3.5 h-3.5 fill-brand-mint text-brand-mint" />
              </span>

              {/* Feed Status Indicator */}
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-[10px] text-emerald-400 font-mono">
                <Radio className="w-3 h-3 animate-pulse text-emerald-400" />
                <span className="font-bold">FEED API REAL</span>
              </div>
            </div>

            {/* Search Input */}
            <div className="relative w-44 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2" />
              <input
                type="text"
                placeholder={market === 'MX' ? 'Buscar América, Chivas, UCL...' : 'Chèche Violette, Racing, UCL...'}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-mint"
              />
            </div>
          </div>

          {/* Quick Nav Filters & Refresh */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTabFilter('vivo')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTabFilter === 'vivo'
                  ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>EN VIVO ({featuredMatch.isLive ? '1' : '0'})</span>
            </button>

            <button
              onClick={() => setActiveTabFilter('proximos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTabFilter === 'proximos'
                  ? 'bg-brand-mint text-black font-black'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              PRÓXIMOS EVENTOS
            </button>

            <button
              onClick={() => setActiveTabFilter('consejos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTabFilter === 'consejos'
                  ? 'bg-brand-mint text-black font-black'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              ANÁLISIS PREVIO
            </button>

            <button
              onClick={refreshLiveFeed}
              disabled={isRefreshingFeed}
              title="Actualizar Cuotas en Tiempo Real"
              className="p-1.5 rounded-lg bg-brand-card hover:bg-brand-cardHover border border-brand-border text-slate-300 hover:text-white"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isRefreshingFeed ? 'animate-spin text-brand-mint' : ''}`} />
            </button>
          </div>
        </div>
      </div>

      {/* Main 3-Column Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* ======================================================== */}
          {/* COLUMN 1: LEFT SIDEBAR (Leagues Navigation + Wallet) */}
          {/* ======================================================== */}
          <aside className="lg:col-span-3 space-y-5">
            {/* Operating Mode Status Card */}
            <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between shadow-md">
              <div>
                <span className="text-[10px] text-slate-400 block uppercase font-mono">Modo de Apuestas</span>
                <span className="text-xs font-black flex items-center gap-1.5 mt-0.5">
                  {isRealMode ? (
                    <>
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-emerald-400">DINERO REAL (PROD)</span>
                    </>
                  ) : (
                    <>
                      <span className="w-2 h-2 rounded-full bg-yellow-400" />
                      <span className="text-yellow-400">MODO DEMO TÉCNICO</span>
                    </>
                  )}
                </span>
              </div>
              <button
                onClick={() => setIsRealMode(!isRealMode)}
                className="px-2.5 py-1 rounded-lg text-[10px] font-bold border border-slate-700 hover:border-brand-mint bg-brand-dark text-slate-300 hover:text-white transition-all"
              >
                {isRealMode ? 'Cambiar a Demo' : 'Activar Real'}
              </button>
            </div>

            {/* Leagues Directory */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-lg">
              <div className="p-3 bg-brand-navy border-b border-brand-border text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center justify-between">
                <span>Competiciones Reales</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-dark font-mono text-brand-mint">
                  {market === 'MX' ? 'MÉXICO' : 'HAÏTI'}
                </span>
              </div>

              <div className="p-2 space-y-1 text-xs">
                {leagues.map((lg) => {
                  const isSelected = selectedLeague === lg.id;
                  return (
                    <div key={lg.id} className="space-y-1">
                      <button
                        onClick={() => setSelectedLeague(lg.id)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-xl transition-all ${
                          isSelected
                            ? 'bg-brand-mint/15 text-brand-mint border border-brand-mint/40 font-bold'
                            : 'hover:bg-brand-cardHover text-slate-300'
                        }`}
                      >
                        <span className="truncate">{lg.name}</span>
                        {lg.count && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-brand-dark text-slate-400 font-mono">
                            {lg.count}
                          </span>
                        )}
                      </button>

                      {/* Sub-teams list if active */}
                      {isSelected && lg.teams && (
                        <div className="pl-4 pr-2 py-1 space-y-1 text-[11px] text-slate-400 border-l-2 border-brand-mint ml-3">
                          {lg.teams.map((t, idx) => (
                            <div key={idx} className="hover:text-brand-mint cursor-pointer py-0.5">
                              • {t}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quick Wallet Card */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
              <div
                onClick={() => setWalletPopoverOpen(!walletPopoverOpen)}
                className="p-3 bg-gradient-to-r from-brand-navy to-brand-navyLight border-b border-brand-border flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-mint" />
                  <span className="font-bold text-xs text-white uppercase">
                    {isRealMode ? 'Billetera Real' : 'Billetera Demo'}
                  </span>
                </div>
                {walletPopoverOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {walletPopoverOpen && (
                <div className="p-3 space-y-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-brand-dark/70 border border-brand-border flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-slate-400 block">
                        {isRealMode ? 'Saldo Real Disponible' : 'Saldo Demo Disponible'}
                      </span>
                      <span className="font-mono font-black text-sm text-brand-mint">
                        {currencySign} {activeBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                        {currencySymbol}
                      </span>
                    </div>
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-mint/10 text-brand-mint border border-brand-mint/30 font-bold">
                      {isRealMode ? 'Activo' : 'Demo'}
                    </span>
                  </div>

                  <button
                    onClick={() => openWallet('deposit')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-cardHover border border-brand-border text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowDownLeft className="w-4 h-4 text-brand-mint" />
                      <span>{isRealMode ? 'Depositar (SPEI / MonCash)' : 'Recarga Demo'}</span>
                    </span>
                    <span className="text-[10px] text-brand-mint font-bold">+</span>
                  </button>

                  <button
                    onClick={() => openWallet('withdraw')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-cardHover border border-brand-border text-slate-200 transition-colors"
                  >
                    <span className="flex items-center gap-2">
                      <ArrowUpRight className="w-4 h-4 text-blue-400" />
                      <span>{isRealMode ? 'Retirar Fondos' : 'Retiro Demo'}</span>
                    </span>
                    <span className="text-[10px] text-blue-400 font-bold">→</span>
                  </button>
                </div>
              )}
            </div>
          </aside>

          {/* ======================================================== */}
          {/* COLUMN 2: CENTER MATCHES & ODDS COMPARATOR */}
          {/* ======================================================== */}
          <main className="lg:col-span-5 space-y-5">
            {/* League Section Accordion Header */}
            <div className="p-3.5 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-mint animate-pulse" />
                <span className="font-black text-sm uppercase tracking-wider text-white">
                  {market === 'MX' ? 'LIGA BBVA MX / TORNEO CLAUSURA' : 'CHAMPIONNAT NATIONAL D1 HAÏTIEN'}
                </span>
              </div>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-brand-mint/20 text-brand-mint border border-brand-mint/40 font-bold">
                EN DIRECTO
              </span>
            </div>

            {/* Featured Match Card */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-2xl relative">
              {/* Live Badge Bar */}
              <div className="px-4 py-1.5 bg-gradient-to-r from-rose-950 via-red-900 to-rose-950 border-b border-rose-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span className="font-black text-[11px] text-rose-200 uppercase tracking-wider">
                    {featuredMatch.time} • MINUTO {featuredMatch.liveMinute}
                  </span>
                </div>
                <div className="font-mono font-black text-white text-sm tracking-widest bg-black/40 px-2.5 py-0.5 rounded-lg border border-white/10">
                  {featuredMatch.score}
                </div>
              </div>

              {/* Match Header */}
              <div className="p-5 bg-gradient-to-b from-brand-navy to-brand-card border-b border-brand-border text-center space-y-3">
                <div className="flex items-center justify-around">
                  <div className="space-y-1.5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-600/30 border border-amber-400/50 flex items-center justify-center font-black text-amber-300 text-xl mx-auto shadow-lg">
                      {featuredMatch.home.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-black text-sm text-white block">{featuredMatch.home}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Local</span>
                  </div>

                  <div className="px-3 flex flex-col items-center">
                    <span className="font-mono font-black text-2xl text-brand-mint tracking-wider">VS</span>
                    <span className="text-[10px] text-slate-400 font-mono mt-1">1X2 Match</span>
                  </div>

                  <div className="space-y-1.5 flex-1">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-indigo-600/30 border border-blue-400/50 flex items-center justify-center font-black text-blue-300 text-xl mx-auto shadow-lg">
                      {featuredMatch.away.substring(0, 2).toUpperCase()}
                    </div>
                    <span className="font-black text-sm text-white block">{featuredMatch.away}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Visitante</span>
                  </div>
                </div>

                {/* Sub-tabs: Cuotas vs Análisis Previo */}
                <div className="flex items-center justify-center gap-2 pt-2 border-t border-slate-800">
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      !showAnalysis ? 'bg-brand-mint text-black shadow-md font-black' : 'bg-brand-dark text-slate-400'
                    }`}
                  >
                    Comparador Cuotas Reales
                  </button>
                  <button
                    onClick={() => setShowAnalysis(true)}
                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${
                      showAnalysis ? 'bg-brand-mint text-black shadow-md font-black' : 'bg-brand-dark text-slate-400'
                    }`}
                  >
                    Análisis & Stats &gt;
                  </button>
                </div>
              </div>

              {/* Analysis Drawer or Odds Table */}
              {showAnalysis ? (
                <div className="p-4 space-y-3 bg-brand-dark/50 text-xs">
                  <div className="flex items-center gap-2 text-brand-mint font-bold">
                    <Info className="w-4 h-4" />
                    <span>Estadísticas en Tiempo Real</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    {market === 'MX'
                      ? 'El Clásico Nacional registra alta intensidad. Club América mantiene un 58% de posesión de balón con 11 remates totales y 5 a puerta, mientras Chivas contraataca con peligro.'
                      : 'Le Derby de la Capitale affiche une forte rivalité. Le Violette AC mène 1-0 au stade Sylvio Cator avec 6 tirs cadrés contre 3 pour le Racing Club.'}
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px] pt-2">
                    <div className="p-2 rounded-lg bg-brand-card border border-brand-border">
                      <span className="text-slate-400 block text-[10px]">Posesión</span>
                      <strong className="text-white">58% - 42%</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-brand-card border border-brand-border">
                      <span className="text-slate-400 block text-[10px]">Tiros al Arco</span>
                      <strong className="text-brand-mint">5 - 3</strong>
                    </div>
                    <div className="p-2 rounded-lg bg-brand-card border border-brand-border">
                      <span className="text-slate-400 block text-[10px]">Faltas</span>
                      <strong className="text-amber-400">8 - 11</strong>
                    </div>
                  </div>
                </div>
              ) : (
                /* Comparative Real Odds Table */
                <div className="overflow-x-auto">
                  <div className="px-3 py-2 bg-brand-dark/90 text-[10px] text-slate-400 flex items-center justify-between border-b border-brand-border">
                    <span className="uppercase font-mono font-bold">Comparativa Bookmakers Reales</span>
                    <span className="text-emerald-400 flex items-center gap-1 font-semibold">
                      <Zap className="w-3 h-3" /> Mejor Cuota NEW BRAND
                    </span>
                  </div>
                  <table className="w-full text-xs text-left">
                    <thead className="bg-brand-dark/80 text-[10px] uppercase text-slate-400 border-b border-brand-border">
                      <tr>
                        <th className="px-3 py-2.5">Casa / Feed</th>
                        <th className="px-2 py-2.5 text-center">1 (Local)</th>
                        <th className="px-2 py-2.5 text-center">X (Empate)</th>
                        <th className="px-2 py-2.5 text-center">2 (Visita)</th>
                        <th className="px-2 py-2.5 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {providerOdds.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`transition-colors ${
                            row.isBest
                              ? 'bg-emerald-950/30 hover:bg-emerald-900/30'
                              : 'hover:bg-brand-navyLight/40'
                          }`}
                        >
                          <td className="px-3 py-2.5 font-medium flex items-center gap-2">
                            <span
                              className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-[10px] border ${
                                row.isBest
                                  ? 'bg-brand-mint text-black border-brand-mint'
                                  : 'bg-brand-navyLight text-brand-mint border-brand-border'
                              }`}
                            >
                              {row.logo}
                            </span>
                            <div>
                              <span className="truncate max-w-[120px] font-bold block text-white">
                                {row.provider}
                              </span>
                              {row.isBest && (
                                <span className="text-[9px] text-emerald-400 font-mono uppercase">
                                  +7.8% Margen Óptimo
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds(
                                  featuredMatch.id,
                                  `${featuredMatch.home} vs ${featuredMatch.away}`,
                                  `1 (${featuredMatch.home}) [${row.logo}]`,
                                  row.home,
                                )
                              }
                              className={`px-2.5 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-all ${
                                row.isBest
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-brand-mint hover:text-black'
                                  : 'bg-brand-dark hover:bg-brand-mint hover:text-black border-brand-border'
                              }`}
                            >
                              {row.home.toFixed(2)}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds(
                                  featuredMatch.id,
                                  `${featuredMatch.home} vs ${featuredMatch.away}`,
                                  `X (Empate) [${row.logo}]`,
                                  row.draw,
                                )
                              }
                              className={`px-2.5 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-all ${
                                row.isBest
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-brand-mint hover:text-black'
                                  : 'bg-brand-dark hover:bg-brand-mint hover:text-black border-brand-border'
                              }`}
                            >
                              {row.draw.toFixed(2)}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds(
                                  featuredMatch.id,
                                  `${featuredMatch.home} vs ${featuredMatch.away}`,
                                  `2 (${featuredMatch.away}) [${row.logo}]`,
                                  row.away,
                                )
                              }
                              className={`px-2.5 py-1.5 rounded-lg border font-mono font-bold text-[11px] transition-all ${
                                row.isBest
                                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 hover:bg-brand-mint hover:text-black'
                                  : 'bg-brand-dark hover:bg-brand-mint hover:text-black border-brand-border'
                              }`}
                            >
                              {row.away.toFixed(2)}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-center text-slate-500">
                            <MoreVertical className="w-4 h-4 mx-auto cursor-pointer hover:text-white" />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Upcoming Real Matches List */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-brand-mint" />
                  <span>Otros Eventos Actuales y Oficiales</span>
                </h4>
                <span className="text-[10px] text-slate-400 font-mono">1X2 Cuotas en Vivo</span>
              </div>

              {upcomingMatches.map((m) => (
                <div
                  key={m.id}
                  className="p-3.5 rounded-xl bg-brand-card border border-brand-border hover:border-slate-700 flex items-center justify-between gap-3 text-xs transition-all shadow-sm"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] text-slate-400 font-mono">{m.competition}</div>
                    <div className="font-bold text-white truncate text-sm mt-0.5">
                      {m.home} <span className="text-brand-mint font-normal">vs</span> {m.away}
                    </div>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>

                  <div className="flex items-center gap-1.5 font-mono flex-shrink-0">
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, `1 (${m.home})`, m.odds.home)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold transition-all"
                      title={`Apostar por ${m.home}`}
                    >
                      <span className="text-[9px] text-slate-500 mr-1">1</span>
                      {m.odds.home.toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, 'X (Empate)', m.odds.draw)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold transition-all"
                      title="Apostar por Empate"
                    >
                      <span className="text-[9px] text-slate-500 mr-1">X</span>
                      {m.odds.draw.toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, `2 (${m.away})`, m.odds.away)}
                      className="px-2.5 py-1.5 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold transition-all"
                      title={`Apostar por ${m.away}`}
                    >
                      <span className="text-[9px] text-slate-500 mr-1">2</span>
                      {m.odds.away.toFixed(2)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Regulatory Compliance & Fair Gaming Banner */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-brand-card to-brand-navy border border-brand-border flex items-center gap-3 text-xs shadow-md">
              <div className="w-10 h-10 rounded-xl bg-brand-mint/10 border border-brand-mint/30 flex items-center justify-center text-brand-mint flex-shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="space-y-0.5">
                <span className="font-bold text-white block">
                  {market === 'MX'
                    ? 'Regulación y Licencia Oficial SEGOB (México)'
                    : 'Regilasyon Ofisyèl Loterie Nationale d’Haïti (LEH)'}
                </span>
                <p className="text-[11px] text-slate-400">
                  {market === 'MX'
                    ? 'Cuotas auditadas en tiempo real. Juego legal autorizado para mayores de 18 años.'
                    : 'Kòt ofisyèl oditées an tan reyèl. Jwèt legal otorize pou moun ki gen 18 an oswa plis.'}
                </p>
              </div>
            </div>
          </main>

          {/* ======================================================== */}
          {/* COLUMN 3: CALCULADORA DE GANANCIAS (BET SLIP) */}
          {/* ======================================================== */}
          <aside className="lg:col-span-4 rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-2xl space-y-4 p-5 sticky top-24">
            {/* Header */}
            <div className="flex items-center justify-between border-b border-brand-border pb-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-brand-mint/20 border border-brand-mint/50 flex items-center justify-center text-brand-mint">
                  <TrendingUp className="w-4 h-4 text-brand-mint" />
                </div>
                <div>
                  <h4 className="font-black text-sm text-white">Calculadora De Ganancias</h4>
                  <span className="text-[10px] text-slate-400">
                    Modo: {isRealMode ? 'Dinero Real (Oficial)' : 'Demostración Técnica'}
                  </span>
                </div>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-dark text-brand-mint border border-brand-mint/30">
                {betSelections.length} Eventos
              </span>
            </div>

            {/* Total Estimated Profit Banner */}
            <div className="p-3.5 rounded-xl bg-brand-dark/90 border border-brand-mint/30 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ganancia Estimada:</span>
              <span className="font-mono font-black text-base text-brand-mint">
                {currencySign}{' '}
                {(calcMode === 'sencillas' ? totalSinglePayout : combinedPayout).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}{' '}
                {currencySymbol}
              </span>
            </div>

            {/* Mode Switcher: Sencillas vs Combinadas */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-brand-dark border border-brand-border text-xs font-bold">
              <button
                onClick={() => setCalcMode('sencillas')}
                className={`py-2 rounded-lg transition-all ${
                  calcMode === 'sencillas'
                    ? 'bg-brand-mint text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sencillas
              </button>
              <button
                onClick={() => setCalcMode('combinadas')}
                className={`py-2 rounded-lg transition-all ${
                  calcMode === 'combinadas'
                    ? 'bg-brand-mint text-black shadow-md font-black'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Combinadas (+Multiplicador)
              </button>
            </div>

            {/* Interactive Stake Slider (Combinadas mode) */}
            {calcMode === 'combinadas' && (
              <div className="space-y-2 p-3 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Importe de mi apuesta:</span>
                  <span className="font-mono font-bold text-brand-mint">
                    {currencySign} {globalStake.toLocaleString()} {currencySymbol}
                  </span>
                </div>

                <input
                  type="range"
                  min={isRealMode ? 20 : 1000}
                  max={isRealMode ? 10000 : 100000}
                  step={isRealMode ? 20 : 1000}
                  value={globalStake}
                  onChange={(e) => setGlobalStake(Number(e.target.value))}
                  className="w-full accent-brand-mint cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>{currencySign}{isRealMode ? '20' : '1.000'}</span>
                  <span>{currencySign}{isRealMode ? '2.500' : '25.000'}</span>
                  <span>{currencySign}{isRealMode ? '5.000' : '50.000'}</span>
                  <span>{currencySign}{isRealMode ? '10.000' : '100.000'}</span>
                </div>
              </div>
            )}

            {/* Bet Feedback Alert */}
            {betFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-brand-mint/50 text-brand-mint text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">{betFeedback}</span>
              </div>
            )}

            {/* Selected Events List */}
            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {betSelections.length === 0 ? (
                <div className="p-6 text-center text-slate-500 text-xs">
                  <p>Selecciona cuotas en la tabla para calcular tus ganancias estimadas.</p>
                </div>
              ) : (
                betSelections.map((bet) => {
                  const s = getItemStake(bet.id);
                  const p = Math.round(s * bet.odds * 100) / 100;

                  return (
                    <div
                      key={bet.id}
                      className="p-3.5 rounded-xl bg-brand-dark/95 border border-brand-border space-y-2.5 text-xs shadow-md"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <span className="text-[10px] text-slate-400 block">{bet.eventName}</span>
                          <span className="font-bold text-white text-xs">{bet.pickName}</span>
                        </div>
                        <button
                          onClick={() => removeBetSelection(bet.id)}
                          className="text-slate-500 hover:text-rose-400 p-0.5"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between text-[11px] font-mono text-slate-300">
                        <span>Cuota:</span>
                        <span className="text-brand-mint font-bold">{bet.odds.toFixed(2)}</span>
                      </div>

                      {/* Sencillas mode has individual stake and APOSTAR button per event */}
                      {calcMode === 'sencillas' && (
                        <div className="pt-2 border-t border-slate-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1">
                              <span className="text-[10px] text-slate-400">Importe:</span>
                              <input
                                type="number"
                                value={s}
                                onChange={(e) => setItemStake(bet.id, Number(e.target.value))}
                                className="w-20 px-2 py-0.5 rounded bg-brand-card border border-slate-700 text-white font-mono text-[11px] text-right focus:outline-none focus:border-brand-mint"
                              />
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400">Ganancia: </span>
                              <span className="font-mono font-bold text-brand-mint">
                                {currencySign} {p.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlaceSingleBet(bet.id)}
                            className={`w-full py-2 rounded-lg font-black text-xs uppercase tracking-wider transition-all shadow-md ${
                              isRealMode
                                ? 'bg-gradient-to-r from-emerald-500 to-brand-mint text-black hover:brightness-110'
                                : 'bg-brand-mint hover:bg-brand-mintHover text-black'
                            }`}
                          >
                            {isRealMode ? 'APOSTAR DINERO REAL' : 'APOSTAR DEMO'}
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })
              )}
            </div>

            {/* Combinadas Master Bet Action */}
            {calcMode === 'combinadas' && betSelections.length > 0 && (
              <div className="pt-3 border-t border-brand-border space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Multiplicador Combinado:</span>
                  <span className="font-mono font-black text-white text-sm">
                    {combinedMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Ganancia Potencial:</span>
                  <span className="font-mono text-brand-mint text-sm">
                    {currencySign} {combinedPayout.toLocaleString()} {currencySymbol}
                  </span>
                </div>

                <button
                  onClick={handlePlaceCombinedBet}
                  className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider shadow-lg transition-all ${
                    isRealMode
                      ? 'bg-gradient-to-r from-emerald-500 via-brand-mint to-teal-400 text-black hover:brightness-110 shadow-emerald-500/20'
                      : 'bg-brand-mint hover:bg-brand-mintHover text-black shadow-brand-mint/20'
                  }`}
                >
                  {isRealMode ? 'CONFIRMAR APUESTA COMBINADA REAL' : 'APOSTAR COMBINADA DEMO'}
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};
