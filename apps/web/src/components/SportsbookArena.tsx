'use client';

import React, { useState } from 'react';
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
} from 'lucide-react';

interface OddsRow {
  provider: string;
  logo: string;
  home: number;
  draw: number;
  away: number;
}

const mockProviderOdds: OddsRow[] = [
  { provider: 'BetPlay Adapter', logo: 'BP', home: 2.12, draw: 4.10, away: 1.64 },
  { provider: 'Rushbet Adapter', logo: 'RB', home: 2.10, draw: 4.10, away: 1.70 },
  { provider: 'Rivalo Adapter', logo: 'RV', home: 2.12, draw: 4.00, away: 1.70 },
  { provider: 'Codere Adapter', logo: 'CD', home: 2.10, draw: 4.00, away: 1.64 },
  { provider: 'NEW BRAND Feed', logo: 'NB', home: 2.15, draw: 4.15, away: 1.72 },
  { provider: 'Mozzart Adapter', logo: 'MZ', home: 2.10, draw: 4.00, away: 1.64 },
  { provider: 'Zamba Adapter', logo: 'ZB', home: 2.12, draw: 4.10, away: 1.64 },
];

const mockLeagues = [
  {
    id: 'liga-mx',
    name: 'Liga MX / Betplay',
    count: 10,
    active: true,
    teams: ['Millonarios', 'América', 'Santa Fe', 'Cúcuta', 'D. Cali', 'Tolima'],
  },
  { id: 'champions', name: 'Champions League', count: 8 },
  { id: 'superliga', name: 'Super Liga', count: 6 },
  { id: 'premier', name: 'Premier League', count: 8 },
  { id: 'superleague', name: 'Super League División', count: 14 },
  { id: 'libertadores', name: 'Copa Libertadores', count: 2 },
];

const upcomingMatches = [
  { id: 'm-2', home: 'Santa Fe', away: 'Cúcuta', time: '12:30 pm / 31 de octubre', odds: { home: 1.95, draw: 4.10, away: 3.50 } },
  { id: 'm-3', home: 'D. Cali', away: 'Tolima', time: '12:30 pm / 31 de octubre', odds: { home: 2.30, draw: 3.10, away: 2.90 } },
  { id: 'm-4', home: 'Nacional', away: 'Huila', time: '12:30 pm / 31 de octubre', odds: { home: 1.45, draw: 4.20, away: 6.00 } },
  { id: 'm-5', home: 'Junior', away: 'Once Caldas', time: '12:30 pm / 31 de octubre', odds: { home: 1.85, draw: 3.40, away: 4.10 } },
  { id: 'm-6', home: 'Chicó', away: 'La Equidad', time: '12:30 pm / 31 de octubre', odds: { home: 2.60, draw: 3.00, away: 2.70 } },
];

export const SportsbookArena: React.FC = () => {
  const {
    t,
    market,
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
  const [selectedLeague, setSelectedLeague] = useState('liga-mx');
  const [activeTabFilter, setActiveTabFilter] = useState<'proximos' | 'vivo' | 'consejos'>('proximos');
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [walletPopoverOpen, setWalletPopoverOpen] = useState(true);

  // Calculator states
  const [calcMode, setCalcMode] = useState<'sencillas' | 'combinadas'>('sencillas');
  const [globalStake, setGlobalStake] = useState<number>(10000);
  const [itemStakes, setItemStakes] = useState<Record<string, number>>({});
  const [betFeedback, setBetFeedback] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  // Helper for item stakes in single mode
  const getItemStake = (id: string) => itemStakes[id] || 1000;
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
    if (demoBalance < s) {
      alert('Saldo demo insuficiente. Haz una recarga demo desde la billetera.');
      return;
    }
    updateDemoBalance(-s);
    setBetFeedback('¡Apuesta demo registrada con éxito en el Ledger!');
    setTimeout(() => setBetFeedback(null), 3000);
  };

  const handlePlaceCombinedBet = () => {
    if (betSelections.length === 0) return;
    if (demoBalance < globalStake) {
      alert('Saldo demo insuficiente. Haz una recarga demo desde la billetera.');
      return;
    }
    updateDemoBalance(-globalStake);
    setBetFeedback('¡Apuesta combinada demo registrada con éxito!');
    setTimeout(() => {
      setBetFeedback(null);
      clearBetSelections();
    }, 2500);
  };

  return (
    <div className="w-full bg-brand-dark text-slate-200">
      {/* Subheader: Search bar & Quick Nav Filters */}
      <div className="border-b border-brand-border bg-brand-navy/90 px-4 py-3">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm font-black tracking-wider text-brand-mint flex items-center gap-1.5">
              <span>APUESTAS NEW BRAND</span>
              <Star className="w-3.5 h-3.5 fill-brand-mint text-brand-mint" />
            </span>

            {/* Search Input */}
            <div className="relative w-48 sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Buscar eventos..."
                className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-brand-card border border-brand-border text-xs text-white placeholder-slate-500 focus:outline-none focus:border-brand-mint"
              />
            </div>
          </div>

          {/* Quick Nav Filters */}
          <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold scrollbar-none">
            <button
              onClick={() => setActiveTabFilter('proximos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTabFilter === 'proximos'
                  ? 'bg-brand-mint text-black'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              PRÓXIMOS
            </button>
            <button
              onClick={() => setActiveTabFilter('consejos')}
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                activeTabFilter === 'consejos'
                  ? 'bg-brand-mint text-black'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              NOTICIAS Y CONSEJOS
            </button>
            <button
              onClick={() => setActiveTabFilter('vivo')}
              className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTabFilter === 'vivo'
                  ? 'bg-rose-600 text-white'
                  : 'bg-brand-card hover:bg-brand-cardHover text-slate-300'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>EN VIVO</span>
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
            {/* Leagues Directory */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-lg">
              <div className="p-3 bg-brand-navy border-b border-brand-border text-xs font-bold text-slate-300 uppercase tracking-wider">
                Competiciones
              </div>

              <div className="p-2 space-y-1 text-xs">
                {mockLeagues.map((lg) => {
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

            {/* Quick Wallet Card (As highlighted in the design reference) */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
              <div
                onClick={() => setWalletPopoverOpen(!walletPopoverOpen)}
                className="p-3 bg-gradient-to-r from-brand-navy to-brand-navyLight border-b border-brand-border flex items-center justify-between cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Wallet className="w-4 h-4 text-brand-mint" />
                  <span className="font-bold text-xs text-white">BILLETERA DEMO</span>
                </div>
                {walletPopoverOpen ? (
                  <ChevronUp className="w-4 h-4 text-slate-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                )}
              </div>

              {walletPopoverOpen && (
                <div className="p-3 space-y-2 text-xs">
                  <div className="p-2 rounded-xl bg-brand-dark/70 border border-brand-border flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Saldo:</span>
                    <span className="font-mono font-bold text-brand-mint">
                      ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
                    </span>
                  </div>

                  <button
                    onClick={() => openAuth('register')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-cardHover border border-brand-border text-slate-200 transition-colors"
                  >
                    <UserPlus className="w-4 h-4 text-brand-gold" />
                    <span>Registro</span>
                  </button>

                  <button
                    onClick={() => openWallet('deposit')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-cardHover border border-brand-border text-slate-200 transition-colors"
                  >
                    <ArrowDownLeft className="w-4 h-4 text-brand-mint" />
                    <span>Recargas Demo</span>
                  </button>

                  <button
                    onClick={() => openWallet('withdraw')}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-brand-dark hover:bg-brand-cardHover border border-brand-border text-slate-200 transition-colors"
                  >
                    <ArrowUpRight className="w-4 h-4 text-blue-400" />
                    <span>Retiros Simulados</span>
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
            <div className="p-3 rounded-2xl bg-brand-card border border-brand-border flex items-center justify-between">
              <span className="font-black text-sm uppercase tracking-wider text-white">
                LIGA BETPLAY / LIGA MX
              </span>
              <span className="p-1 rounded-full bg-brand-mint text-black">
                <ChevronUp className="w-4 h-4" />
              </span>
            </div>

            {/* Featured Match Card */}
            <div className="rounded-2xl bg-brand-card border border-brand-border overflow-hidden shadow-xl">
              {/* Match Header */}
              <div className="p-4 bg-gradient-to-b from-brand-navy to-brand-card border-b border-brand-border text-center space-y-2">
                <div className="flex items-center justify-around">
                  <div className="space-y-1">
                    <div className="w-12 h-12 rounded-full bg-blue-900/60 border border-blue-400 flex items-center justify-center font-bold text-white text-lg mx-auto shadow-md">
                      M
                    </div>
                    <span className="font-black text-sm text-white block">Millonarios</span>
                  </div>

                  <span className="font-mono font-black text-lg text-brand-mint">VS</span>

                  <div className="space-y-1">
                    <div className="w-12 h-12 rounded-full bg-red-900/60 border border-red-400 flex items-center justify-center font-bold text-white text-lg mx-auto shadow-md">
                      A
                    </div>
                    <span className="font-black text-sm text-white block">América</span>
                  </div>
                </div>

                <div className="text-[11px] text-slate-400 font-mono flex items-center justify-center gap-2">
                  <Clock className="w-3.5 h-3.5" />
                  <span>12:30 pm / 31 de octubre</span>
                </div>

                {/* Sub-tabs: Cuotas vs Análisis Previo */}
                <div className="flex items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => setShowAnalysis(false)}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                      !showAnalysis ? 'bg-brand-mint text-black shadow-md' : 'bg-brand-dark text-slate-400'
                    }`}
                  >
                    Cuotas
                  </button>
                  <button
                    onClick={() => setShowAnalysis(true)}
                    className={`px-4 py-1 rounded-full text-xs font-bold transition-all ${
                      showAnalysis ? 'bg-brand-mint text-black shadow-md' : 'bg-brand-dark text-slate-400'
                    }`}
                  >
                    Análisis previo &gt;
                  </button>
                </div>
              </div>

              {/* Analysis Drawer or Odds Table */}
              {showAnalysis ? (
                <div className="p-4 space-y-3 bg-brand-dark/50 text-xs">
                  <div className="flex items-center gap-2 text-brand-mint font-bold">
                    <Info className="w-4 h-4" />
                    <span>Informe Estadístico y Previo</span>
                  </div>
                  <p className="text-slate-300 leading-relaxed">
                    Acá están todos los goles y momentos destacados previos a la fecha. Ambos equipos llegan con
                    promedios superiores a 1.5 goles por partido y alta efectividad en jugadas a balón parado.
                  </p>
                  <div className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-brand-navy flex items-center justify-center text-brand-mint">
                      <Play className="w-5 h-5 fill-current" />
                    </div>
                    <div>
                      <h5 className="font-bold text-white text-xs">Video Resumen de Entrenamientos</h5>
                      <span className="text-[10px] text-slate-400">Duración: 2m 45s</span>
                    </div>
                  </div>
                </div>
              ) : (
                /* Comparative Odds Table */
                <div className="overflow-x-auto">
                  <table className="w-full text-xs text-left">
                    <thead className="bg-brand-dark/80 text-[10px] uppercase text-slate-400 border-b border-brand-border">
                      <tr>
                        <th className="px-3 py-2.5">Apuesta</th>
                        <th className="px-2 py-2.5 text-center">Local</th>
                        <th className="px-2 py-2.5 text-center">Empate</th>
                        <th className="px-2 py-2.5 text-center">Visitante</th>
                        <th className="px-2 py-2.5 text-center"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-border/60">
                      {mockProviderOdds.map((row, idx) => (
                        <tr key={idx} className="hover:bg-brand-navyLight/40 transition-colors">
                          <td className="px-3 py-2 font-medium flex items-center gap-2">
                            <span className="w-6 h-6 rounded-md bg-brand-navyLight flex items-center justify-center font-bold text-[10px] text-brand-mint border border-brand-border">
                              {row.logo}
                            </span>
                            <span className="truncate max-w-[100px]">{row.provider}</span>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds('m-1', 'Millonarios vs América', `1 (Millonarios) [${row.logo}]`, row.home)
                              }
                              className="px-2.5 py-1 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border font-mono font-bold text-[11px] transition-colors"
                            >
                              {row.home.toFixed(2)}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds('m-1', 'Millonarios vs América', `X (Empate) [${row.logo}]`, row.draw)
                              }
                              className="px-2.5 py-1 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border font-mono font-bold text-[11px] transition-colors"
                            >
                              {row.draw.toFixed(2)}
                            </button>
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              onClick={() =>
                                handleSelectOdds('m-1', 'Millonarios vs América', `2 (América) [${row.logo}]`, row.away)
                              }
                              className="px-2.5 py-1 rounded-lg bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border font-mono font-bold text-[11px] transition-colors"
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

            {/* Upcoming Matches List */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Otros Partidos</h4>
              {upcomingMatches.map((m) => (
                <div
                  key={m.id}
                  className="p-3 rounded-xl bg-brand-card border border-brand-border hover:border-slate-700 flex items-center justify-between gap-2 text-xs transition-all"
                >
                  <div>
                    <div className="font-bold text-white">
                      {m.home} <span className="text-brand-mint font-normal">vs</span> {m.away}
                    </div>
                    <span className="text-[10px] text-slate-400">{m.time}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono">
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, `1 (${m.home})`, m.odds.home)}
                      className="px-2 py-1 rounded bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold"
                    >
                      {m.odds.home.toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, 'X (Empate)', m.odds.draw)}
                      className="px-2 py-1 rounded bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold"
                    >
                      {m.odds.draw.toFixed(2)}
                    </button>
                    <button
                      onClick={() => handleSelectOdds(m.id, `${m.home} vs ${m.away}`, `2 (${m.away})`, m.odds.away)}
                      className="px-2 py-1 rounded bg-brand-dark hover:bg-brand-mint hover:text-black border border-brand-border text-[11px] font-bold"
                    >
                      {m.odds.away.toFixed(2)}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Promotional Banner (matching screenshot BONO $50 MIL) */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-950 to-brand-card border border-blue-500/40 text-center space-y-3 shadow-xl">
              <span className="text-[10px] uppercase font-mono font-bold tracking-widest text-brand-gold bg-black/40 px-2 py-0.5 rounded-full">
                PROMOCIÓN ESPECIAL DEPORTES
              </span>
              <h3 className="text-2xl font-black text-white">
                BONO <span className="text-brand-gold">$50 MIL</span> DEMO
              </h3>
              <p className="text-xs text-slate-300">
                Abre tu cuenta de demostración técnica y prueba toda la plataforma sin riesgo financiero.
              </p>
              <button
                onClick={() => openAuth('register')}
                className="px-6 py-2.5 rounded-xl bg-brand-mint hover:bg-brand-mintHover text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-brand-mint/20 transition-all"
              >
                REGÍSTRATE YA
              </button>
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
                <h4 className="font-black text-sm text-white">Calculadora De Ganancias</h4>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-brand-dark text-brand-mint border border-brand-mint/30">
                {betSelections.length} Eventos
              </span>
            </div>

            {/* Total Estimated Profit Banner */}
            <div className="p-3.5 rounded-xl bg-brand-dark/90 border border-brand-mint/30 flex items-center justify-between">
              <span className="text-xs text-slate-400">Ganancia Total:</span>
              <span className="font-mono font-black text-base text-brand-mint">
                ${(calcMode === 'sencillas' ? totalSinglePayout : combinedPayout).toLocaleString('en-US')}{' '}
                {currencySymbol}
              </span>
            </div>

            {/* Mode Switcher: Sencillas vs Combinadas */}
            <div className="grid grid-cols-2 p-1 rounded-xl bg-brand-dark border border-brand-border text-xs font-bold">
              <button
                onClick={() => setCalcMode('sencillas')}
                className={`py-2 rounded-lg transition-all ${
                  calcMode === 'sencillas'
                    ? 'bg-brand-mint text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Sencillas
              </button>
              <button
                onClick={() => setCalcMode('combinadas')}
                className={`py-2 rounded-lg transition-all ${
                  calcMode === 'combinadas'
                    ? 'bg-brand-mint text-black shadow-md'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Combinadas
              </button>
            </div>

            {/* Interactive Stake Slider (Combinadas mode or global) */}
            {calcMode === 'combinadas' && (
              <div className="space-y-2 p-3 rounded-xl bg-brand-dark/60 border border-brand-border">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-slate-400">Valor de mi apuesta:</span>
                  <span className="font-mono font-bold text-brand-mint">
                    ${globalStake.toLocaleString()} {currencySymbol}
                  </span>
                </div>

                <input
                  type="range"
                  min="1000"
                  max="100000"
                  step="1000"
                  value={globalStake}
                  onChange={(e) => setGlobalStake(Number(e.target.value))}
                  className="w-full accent-brand-mint cursor-pointer"
                />

                <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                  <span>1.000</span>
                  <span>20.000</span>
                  <span>40.000</span>
                  <span>60.000</span>
                  <span>100.000</span>
                </div>
              </div>
            )}

            {/* Bet Feedback Alert */}
            {betFeedback && (
              <div className="p-3 rounded-xl bg-emerald-950 border border-brand-mint/50 text-brand-mint text-xs flex items-center gap-2">
                <Check className="w-4 h-4 flex-shrink-0" />
                <span>{betFeedback}</span>
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
                  const p = Math.round(s * bet.odds);

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
                              <span className="text-[10px] text-slate-400">Apuesta:</span>
                              <input
                                type="number"
                                value={s}
                                onChange={(e) => setItemStake(bet.id, Number(e.target.value))}
                                className="w-16 px-1.5 py-0.5 rounded bg-brand-card border border-slate-700 text-white font-mono text-[11px] text-right focus:outline-none focus:border-brand-mint"
                              />
                            </div>
                            <div className="text-right">
                              <span className="text-[10px] text-slate-400">Ganancia: </span>
                              <span className="font-mono font-bold text-brand-mint">
                                ${p.toLocaleString()}
                              </span>
                            </div>
                          </div>

                          <button
                            onClick={() => handlePlaceSingleBet(bet.id)}
                            className="w-full py-2 rounded-lg bg-brand-mint hover:bg-brand-mintHover text-black font-black text-xs uppercase tracking-wider transition-all"
                          >
                            APOSTAR
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
                  <span className="text-slate-400">Cuota Total Combinada:</span>
                  <span className="font-mono font-black text-white text-sm">
                    {combinedMultiplier.toFixed(2)}x
                  </span>
                </div>
                <div className="flex justify-between text-xs font-bold text-white">
                  <span>Ganancia Potencial:</span>
                  <span className="font-mono text-brand-mint text-sm">
                    ${combinedPayout.toLocaleString()} {currencySymbol}
                  </span>
                </div>

                <button
                  onClick={handlePlaceCombinedBet}
                  className="w-full py-3.5 rounded-xl bg-brand-mint hover:bg-brand-mintHover text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-mint/20 transition-all"
                >
                  APOSTAR COMBINADA
                </button>
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
};

