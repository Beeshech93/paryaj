'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Printer,
  Barcode,
  Search,
  CheckCircle2,
  AlertCircle,
  Coins,
  Store,
  Clock,
  ArrowLeft,
  RefreshCw,
  Plus,
  Trash2,
  DollarSign,
  Receipt,
  ShieldCheck,
} from 'lucide-react';

interface PosSelection {
  eventId: string;
  eventName: string;
  marketName: string;
  selection: string;
  odds: number;
}

interface IssuedTicket {
  ticketNumber: string;
  barcode: string;
  securityHash: string;
  terminalCode: string;
  agencyName: string;
  agencyCity: string;
  betType: string;
  stake: number;
  totalOdds: number;
  potentialPayout: number;
  currency: string;
  createdAt: string;
  expiresAt: string;
  selections: PosSelection[];
  termsNotice: string;
}

export default function PosPage() {
  const [activeTab, setActiveTab] = useState<'sales' | 'scanner' | 'cashbox'>('sales');
  const [market, setMarket] = useState<'MX' | 'HT'>('MX');
  const [cashBalance, setCashBalance] = useState<number>(8500);
  const [stake, setStake] = useState<number>(200);
  const [selections, setSelections] = useState<PosSelection[]>([]);
  const [issuedTicket, setIssuedTicket] = useState<IssuedTicket | null>(null);
  const [isPrinting, setIsPrinting] = useState<boolean>(false);

  // Scanner State
  const [queryCode, setQueryCode] = useState<string>('');
  const [scannedTicket, setScannedTicket] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const terminalCode = market === 'MX' ? 'TERM-01' : 'TERM-HT-01';
  const agencyName = market === 'MX' ? 'Banca y Casino Central CDMX' : 'Banca Paryaj Delmas 33';

  // Sample catalog of fixtures for rapid POS ticketing
  const sampleEvents = market === 'MX'
    ? [
        {
          id: 'sr:101',
          name: 'Club América vs Chivas de Guadalajara',
          league: 'Liga MX - Torneo Clausura',
          odds1: 1.85,
          oddsX: 3.40,
          odds2: 4.20,
        },
        {
          id: 'sr:102',
          name: 'Cruz Azul vs Pumas UNAM',
          league: 'Liga MX - Torneo Clausura',
          odds1: 2.10,
          oddsX: 3.35,
          odds2: 3.45,
        },
        {
          id: 'sr:103',
          name: 'Real Madrid vs Manchester City',
          league: 'UEFA Champions League',
          odds1: 2.65,
          oddsX: 3.60,
          odds2: 2.50,
        },
        {
          id: 'sr:104',
          name: 'Monterrey vs Tigres UANL',
          league: 'Clásico Regio (Liga MX)',
          odds1: 2.25,
          oddsX: 3.20,
          odds2: 3.10,
        },
      ]
    : [
        {
          id: 'sr:201',
          name: 'Violette AC vs Racing Club Haïtien',
          league: 'Championnat National D1',
          odds1: 1.45,
          oddsX: 4.20,
          odds2: 6.80,
        },
        {
          id: 'sr:202',
          name: 'FICA vs Baltimore SC',
          league: 'Championnat National D1',
          odds1: 2.25,
          oddsX: 3.10,
          odds2: 3.20,
        },
        {
          id: 'sr:203',
          name: 'Real Madrid vs Paris Saint-Germain',
          league: 'UEFA Champions League',
          odds1: 2.15,
          oddsX: 3.50,
          odds2: 3.10,
        },
      ];

  const totalOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialPayout = Math.round(stake * totalOdds * 100) / 100;

  const handleAddPick = (evt: any, pick: '1' | 'X' | '2', odds: number) => {
    const pickName = pick === '1' ? evt.name.split(' vs ')[0] : pick === '2' ? evt.name.split(' vs ')[1] : 'Empate / Nul';
    const newSel: PosSelection = {
      eventId: evt.id,
      eventName: evt.name,
      marketName: '1X2 (Resultado)',
      selection: pickName,
      odds,
    };
    setSelections((prev) => {
      const filtered = prev.filter((s) => s.eventId !== evt.id);
      return [...filtered, newSel];
    });
  };

  const handlePrintTicket = () => {
    if (selections.length === 0) return;

    const timestampStr = Date.now().toString(36).toUpperCase();
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const ticketNumber = `TK-${new Date().getFullYear()}-${timestampStr}-${randomSuffix}`;
    const barcode = `BC${Date.now()}${randomSuffix}`;

    const ticket: IssuedTicket = {
      ticketNumber,
      barcode,
      securityHash: `HMAC-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
      terminalCode,
      agencyName,
      agencyCity: market === 'MX' ? 'Ciudad de México' : 'Port-au-Prince',
      betType: selections.length > 1 ? 'PARLAY' : 'SIMPLE',
      stake,
      totalOdds: Math.round(totalOdds * 100) / 100,
      potentialPayout,
      currency: currencySymbol,
      createdAt: new Date().toLocaleTimeString(),
      expiresAt: new Date(Date.now() + 60 * 86400000).toLocaleDateString(),
      selections,
      termsNotice:
        market === 'MX'
          ? 'Autorizado por SEGOB (México). Validez de cobro: 60 días en cualquier terminal física autorizada.'
          : 'Valable selon la Réglementation Loterie Nationale d’Haïti (LEH). Période de grâce 60 jours.',
    };

    setIssuedTicket(ticket);
    setCashBalance((prev) => prev + stake);
  };

  const handleScanTicket = () => {
    setScanError(null);
    setPayoutSuccess(null);
    if (!queryCode.trim()) return;

    // Verify against currently issued ticket or generate verified test slip
    if (issuedTicket && (issuedTicket.ticketNumber.includes(queryCode) || issuedTicket.barcode.includes(queryCode))) {
      setScannedTicket({
        ...issuedTicket,
        status: 'WON', // Mark ready to pay
        canRedeem: true,
      });
      return;
    }

    // Default simulated winner ticket
    const sampleStake = 200;
    const sampleOdds = 3.85;
    setScannedTicket({
      ticketNumber: queryCode.startsWith('TK-') ? queryCode : `TK-2026-${queryCode.toUpperCase()}`,
      barcode: `BC${Date.now()}`,
      securityHash: 'SEC-89A7B39F',
      terminalCode,
      agencyName,
      betType: 'PARLAY (2 Partidos)',
      stake: sampleStake,
      totalOdds: sampleOdds,
      potentialPayout: Math.round(sampleStake * sampleOdds),
      currency: currencySymbol,
      status: 'WON',
      createdAt: new Date(Date.now() - 7200000).toLocaleTimeString(),
      canRedeem: true,
      selections: [
        {
          eventName: 'América vs Chivas',
          marketName: '1X2',
          selection: 'Club América',
          odds: 1.95,
          status: 'ACERTADO',
        },
        {
          eventName: 'Cruz Azul vs Pumas',
          marketName: '1X2',
          selection: 'Cruz Azul',
          odds: 1.97,
          status: 'ACERTADO',
        },
      ],
    });
  };

  const handleRedeemCash = () => {
    if (!scannedTicket) return;
    const amount = scannedTicket.potentialPayout;
    setCashBalance((prev) => Math.max(0, prev - amount));
    setPayoutSuccess(`¡Premio de $${amount.toLocaleString()} ${currencySymbol} PAGADO EN EFECTIVO! Recibo emitido.`);
    setScannedTicket((prev: any) => ({ ...prev, status: 'PAID', canRedeem: false }));
  };

  return (
    <div className="min-h-screen bg-[#070e12] text-slate-100 flex flex-col font-sans">
      {/* POS Top Bar */}
      <header className="bg-[#0b171c] border-b border-slate-800 px-4 py-2.5 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-md">
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Web Principal
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-black flex items-center justify-center font-black text-lg">
              <Store className="w-5 h-5 text-black" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-white tracking-wide">PUNTO DE VENTA / CAJERO</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                  RETAIL EN VIVO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">{agencyName} ({terminalCode})</p>
            </div>
          </div>
        </div>

        {/* Cash In Drawer & Market Switcher */}
        <div className="flex items-center gap-4">
          {/* Drawer Balance Widget */}
          <div className="flex items-center gap-2.5 bg-slate-900 border border-emerald-500/30 px-3.5 py-1.5 rounded-xl shadow-inner">
            <Coins className="w-4 h-4 text-emerald-400" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Efectivo en Gaveta</span>
              <span className="text-sm font-mono font-bold text-emerald-400">
                ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
            </div>
          </div>

          {/* Market selector */}
          <div className="flex items-center bg-slate-800 rounded-lg p-0.5 text-xs font-bold">
            <button
              onClick={() => {
                setMarket('MX');
                setSelections([]);
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                market === 'MX' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇲🇽 México (MXN)
            </button>
            <button
              onClick={() => {
                setMarket('HT');
                setSelections([]);
              }}
              className={`px-3 py-1 rounded-md transition-colors ${
                market === 'HT' ? 'bg-emerald-500 text-black shadow' : 'text-slate-400 hover:text-white'
              }`}
            >
              🇭🇹 Haïti (HTG)
            </button>
          </div>
        </div>
      </header>

      {/* POS Navigation Sub-Bar */}
      <div className="bg-[#0e1d23] border-b border-slate-800/80 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'sales'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Receipt className="w-4 h-4" />
            1. Venta de Boletos (F2)
          </button>
          <button
            onClick={() => setActiveTab('scanner')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'scanner'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Barcode className="w-4 h-4" />
            2. Escanear y Pagar Premios (F4)
          </button>
          <button
            onClick={() => setActiveTab('cashbox')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
              activeTab === 'cashbox'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            3. Arqueo y Cierre de Caja (F9)
          </button>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Clock className="w-3.5 h-3.5 text-slate-400" />
          <span>Turno Abierto: 08:30 AM | Cajero: {market === 'MX' ? 'Operador CDMX' : 'Caissier Delmas'}</span>
        </div>
      </div>

      {/* Main POS Content Grid */}
      <main className="flex-1 p-4 max-w-7xl mx-auto w-full">
        {activeTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Left: Sports Fixtures Table */}
            <div className="lg:col-span-8 bg-[#0b171c] rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
                <div>
                  <h2 className="font-bold text-base text-white flex items-center gap-2">
                    ⚽ Partidos Disponibles para Venta en Ventanilla
                  </h2>
                  <p className="text-xs text-slate-400">Selecciona cuotas para añadir al boleto térmico del cliente</p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/30">
                  {sampleEvents.length} Eventos en Terminal
                </span>
              </div>

              {/* Event Cards */}
              <div className="space-y-3">
                {sampleEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-3.5 rounded-xl bg-slate-900/90 border border-slate-800/80 hover:border-slate-700 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div>
                      <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase">{evt.league}</span>
                      <h3 className="font-bold text-sm text-white mt-0.5">{evt.name}</h3>
                    </div>

                    {/* Odds 1X2 Buttons */}
                    <div className="grid grid-cols-3 gap-2 min-w-[280px]">
                      <button
                        onClick={() => handleAddPick(evt, '1', evt.odds1)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-black transition-colors border border-slate-700/60"
                      >
                        <span className="text-[10px] font-bold opacity-75">1</span>
                        <span className="font-mono font-black text-sm">{evt.odds1.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => handleAddPick(evt, 'X', evt.oddsX)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-black transition-colors border border-slate-700/60"
                      >
                        <span className="text-[10px] font-bold opacity-75">X</span>
                        <span className="font-mono font-black text-sm">{evt.oddsX.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => handleAddPick(evt, '2', evt.odds2)}
                        className="flex flex-col items-center justify-center p-2 rounded-lg bg-slate-800 hover:bg-emerald-500 hover:text-black transition-colors border border-slate-700/60"
                      >
                        <span className="text-[10px] font-bold opacity-75">2</span>
                        <span className="font-mono font-black text-sm">{evt.odds2.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cashier Bet Slip & Thermal Slip Generation */}
            <div className="lg:col-span-4 bg-[#0b171c] rounded-2xl border border-slate-800 p-4 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-bold text-sm text-white">Boleto de Venta</h3>
                  </div>
                  {selections.length > 0 && (
                    <button
                      onClick={() => setSelections([])}
                      className="text-xs text-rose-400 hover:text-rose-300 flex items-center gap-1 font-semibold"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Limpiar
                    </button>
                  )}
                </div>

                {/* Selections List */}
                {selections.length === 0 ? (
                  <div className="py-12 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <Barcode className="w-8 h-8 text-slate-600" />
                    <p>Haz clic en las cuotas de la izquierda para emitir un ticket físico de ventanilla.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selections.map((sel) => (
                      <div
                        key={sel.eventId}
                        className="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px]">{sel.eventName}</span>
                          <span className="font-bold text-white mt-0.5">{sel.selection}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-emerald-400">{sel.odds.toFixed(2)}</span>
                          <button
                            onClick={() => setSelections(selections.filter((s) => s.eventId !== sel.eventId))}
                            className="text-slate-500 hover:text-rose-400"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Quick Cash Buttons */}
                <div className="mt-4 pt-3 border-t border-slate-800">
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase">
                    Importe en Efectivo ({currencySymbol})
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[50, 100, 200, 500].map((val) => (
                      <button
                        key={val}
                        onClick={() => setStake(val)}
                        className={`py-1.5 rounded-lg font-mono font-bold text-xs transition-colors ${
                          stake === val ? 'bg-emerald-500 text-black' : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-right font-mono font-bold text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Calculations Summary */}
                <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-800 space-y-1.5 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Selecciones:</span>
                    <span className="font-bold text-white">{selections.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cuota Total:</span>
                    <span className="font-mono font-bold text-amber-400">{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold text-sm pt-1 border-t border-slate-800">
                    <span>Ganancia Potencial:</span>
                    <span className="font-mono text-emerald-400">
                      ${potentialPayout.toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              <button
                disabled={selections.length === 0}
                onClick={handlePrintTicket}
                className="mt-4 w-full py-3.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 disabled:opacity-40 disabled:hover:bg-emerald-500 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20 transition-all active:scale-[0.98]"
              >
                <Printer className="w-4 h-4" />
                Emitir e Imprimir Ticket (F8)
              </button>
            </div>
          </div>
        )}

        {/* Tab 2: Ticket Scanner and Redemption */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto bg-[#0b171c] rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
              <Barcode className="w-6 h-6 text-emerald-400" />
              <div>
                <h2 className="font-bold text-lg text-white">Escaneo y Cobro de Boletos en Ventanilla</h2>
                <p className="text-xs text-slate-400">Escanea con lector láser de código de barras o escribe el número de ticket</p>
              </div>
            </div>

            {/* Barcode Search Form */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Escanear código de barras o ej: WIN777..."
                  value={queryCode}
                  onChange={(e) => setQueryCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScanTicket()}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-9 pr-4 py-2.5 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleScanTicket}
                className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-bold text-sm transition-colors"
              >
                Verificar
              </button>
            </div>

            {/* Payout Success Alert */}
            {payoutSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{payoutSuccess}</span>
              </div>
            )}

            {/* Ticket Details Card */}
            {scannedTicket && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700/80 space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">NÚMERO DE BOLETO</span>
                    <span className="font-mono font-bold text-base text-white">{scannedTicket.ticketNumber}</span>
                  </div>
                  <div>
                    {scannedTicket.status === 'WON' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                        ● PREMIADO / LISTO PARA COBRAR
                      </span>
                    )}
                    {scannedTicket.status === 'PAID' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
                        ✓ YA PAGADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Selections breakdown */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase">Detalle de Pronósticos</span>
                  {scannedTicket.selections?.map((s: any, idx: number) => (
                    <div key={idx} className="flex justify-between items-center text-xs p-2 rounded bg-slate-800/60">
                      <span>{s.eventName} ({s.selection})</span>
                      <span className="font-mono text-emerald-400 font-bold">{s.odds}</span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-xl bg-slate-800/80 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Importe Jugado:</span>
                    <span className="font-mono font-bold text-white">${scannedTicket.stake} {scannedTicket.currency}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block">Total a Pagar en Efectivo:</span>
                    <span className="font-mono font-black text-lg text-emerald-400">
                      ${scannedTicket.potentialPayout?.toLocaleString()} {scannedTicket.currency}
                    </span>
                  </div>
                </div>

                {scannedTicket.canRedeem && (
                  <button
                    onClick={handleRedeemCash}
                    className="w-full py-4 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/20"
                  >
                    <Coins className="w-5 h-5" />
                    Pagar Premio en Efectivo (${scannedTicket.potentialPayout?.toLocaleString()} {scannedTicket.currency})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Cashbox Shift Closing & Z-Report */}
        {activeTab === 'cashbox' && (
          <div className="max-w-2xl mx-auto bg-[#0b171c] rounded-2xl border border-slate-800 p-6 shadow-xl">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-emerald-400" />
                <div>
                  <h2 className="font-bold text-lg text-white">Arqueo y Cierre de Turno (Reporte Z)</h2>
                  <p className="text-xs text-slate-400">Conciliación de caja diaria para el agente y entrega a administración</p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-slate-300">
                Turno #{Date.now().toString(36).toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Flotante Inicial de Caja:</span>
                <p className="text-lg font-mono font-bold text-white mt-1">$5,000.00 {currencySymbol}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Ventas en Efectivo del Turno:</span>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-1">+$4,230.00 {currencySymbol}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Premios Pagados en Ventanilla:</span>
                <p className="text-lg font-mono font-bold text-rose-400 mt-1">-$730.00 {currencySymbol}</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400">Saldo Actual en Gaveta:</span>
                <p className="text-lg font-mono font-bold text-emerald-400 mt-1">
                  ${cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
                </p>
              </div>
            </div>

            <button
              onClick={() => alert(`Reporte Z emitido para ${agencyName}. Cuadre contable verificado.`)}
              className="w-full py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700"
            >
              <Printer className="w-4 h-4 text-emerald-400" />
              Imprimir Arqueo de Caja (Reporte Z)
            </button>
          </div>
        )}
      </main>

      {/* Thermal Ticket Modal (Print Preview 80mm) */}
      {issuedTicket && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-white text-black p-6 rounded-lg font-mono text-xs shadow-2xl flex flex-col items-center">
            {/* Ticket Header */}
            <div className="text-center border-b-2 border-dashed border-black pb-3 w-full">
              <h2 className="font-black text-base tracking-widest">NEW BRAND</h2>
              <p className="text-[10px] uppercase font-bold tracking-wider">PUNTO DE VENTA AUTORIZADO</p>
              <p className="text-[10px] text-gray-700">{issuedTicket.agencyName}</p>
              <p className="text-[10px] text-gray-600">{issuedTicket.agencyCity} • {issuedTicket.terminalCode}</p>
              <p className="text-[10px] mt-1 text-gray-500">{issuedTicket.createdAt}</p>
            </div>

            {/* Ticket Body */}
            <div className="py-3 border-b-2 border-dashed border-black w-full space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>BOLETO:</span>
                <span>{issuedTicket.ticketNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>TIPO:</span>
                <span className="font-bold">{issuedTicket.betType}</span>
              </div>

              {/* Selections */}
              <div className="pt-2 space-y-2">
                <span className="font-bold block text-[10px]">EVENTOS SELECCIONADOS:</span>
                {issuedTicket.selections.map((s, idx) => (
                  <div key={idx} className="text-[10px] leading-tight border-b border-gray-200 pb-1">
                    <p className="font-semibold">{s.eventName}</p>
                    <div className="flex justify-between text-gray-700">
                      <span>Pick: {s.selection}</span>
                      <span className="font-bold">@{s.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>CUOTA TOTAL:</span>
                  <span>{issuedTicket.totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IMPORTE PAGADO:</span>
                  <span>${issuedTicket.stake.toLocaleString()} {issuedTicket.currency}</span>
                </div>
                <div className="flex justify-between text-sm text-black font-black bg-gray-100 p-1 rounded">
                  <span>PREMIO POTENCIAL:</span>
                  <span>${issuedTicket.potentialPayout.toLocaleString()} {issuedTicket.currency}</span>
                </div>
              </div>
            </div>

            {/* Barcode & Anti-Counterfeit Section */}
            <div className="py-3 text-center w-full flex flex-col items-center">
              {/* Simulated Barcode */}
              <div className="w-48 h-10 bg-black flex items-center justify-around px-2 my-1">
                {Array.from({ length: 32 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-8 bg-white inline-block"
                    style={{ width: i % 3 === 0 ? '3px' : '1px' }}
                  ></span>
                ))}
              </div>
              <span className="text-[10px] tracking-widest font-bold">{issuedTicket.barcode}</span>
              <span className="text-[9px] text-gray-500 mt-1">HASH: {issuedTicket.securityHash}</span>
              <p className="text-[8px] text-gray-500 mt-2 text-center leading-tight">
                {issuedTicket.termsNotice}
              </p>
            </div>

            {/* Print & Close Actions */}
            <div className="w-full pt-3 border-t border-gray-300 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2 rounded bg-black text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-gray-800"
              >
                <Printer className="w-3.5 h-3.5" />
                Imprimir
              </button>
              <button
                onClick={() => {
                  setIssuedTicket(null);
                  setSelections([]);
                }}
                className="px-4 py-2 rounded bg-gray-200 text-black font-bold text-xs hover:bg-gray-300"
              >
                Nueva Venta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
