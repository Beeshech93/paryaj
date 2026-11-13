'use client';

import React, { useState, useEffect } from 'react';
import {
  Printer,
  Barcode,
  Search,
  CheckCircle2,
  AlertCircle,
  Coins,
  Store,
  Clock,
  RefreshCw,
  Plus,
  Trash2,
  DollarSign,
  Receipt,
  ShieldCheck,
  Zap,
  Radio,
  FileText,
  UserCheck,
  Building2,
  ArrowRight,
  TrendingUp,
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

interface ShiftSummary {
  openingBalance: number;
  ticketsSold: number;
  totalSales: number;
  ticketsRedeemed: number;
  totalPaid: number;
  closingBalance: number;
  openedAt: string;
}

export default function PointOfSaleApp() {
  const [activeTab, setActiveTab] = useState<'sales' | 'scanner' | 'cashbox'>('sales');
  const [market, setMarket] = useState<'MX' | 'HT'>('MX');
  const [cashBalance, setCashBalance] = useState<number>(8500);
  const [stake, setStake] = useState<number>(200);
  const [selections, setSelections] = useState<PosSelection[]>([]);
  const [issuedTicket, setIssuedTicket] = useState<IssuedTicket | null>(null);
  const [recentTickets, setRecentTickets] = useState<IssuedTicket[]>([]);

  // Shift & Cashier Data
  const [shift, setShift] = useState<ShiftSummary>({
    openingBalance: 5000,
    ticketsSold: 14,
    totalSales: 4230,
    ticketsRedeemed: 3,
    totalPaid: 730,
    closingBalance: 8500,
    openedAt: '08:00 AM',
  });

  // Scanner State
  const [queryCode, setQueryCode] = useState<string>('');
  const [scannedTicket, setScannedTicket] = useState<any | null>(null);
  const [scanError, setScanError] = useState<string | null>(null);
  const [payoutSuccess, setPayoutSuccess] = useState<string | null>(null);

  // Agency info based on jurisdiction
  const agencies = {
    MX: [
      { id: 'AG-MX-01', name: 'Banca y Casino Central CDMX', city: 'Ciudad de México', terminal: 'TERM-MX-01' },
      { id: 'AG-MX-02', name: 'Agencia Plaza Minerva Guadalajara', city: 'Guadalajara', terminal: 'TERM-MX-02' },
      { id: 'AG-MX-03', name: 'Sucursal San Pedro Garza García', city: 'Monterrey', terminal: 'TERM-MX-03' },
    ],
    HT: [
      { id: 'AG-HT-01', name: 'Banca Paryaj Delmas 33', city: 'Port-au-Prince', terminal: 'TERM-HT-01' },
      { id: 'AG-HT-02', name: 'Kiosk Pétion-Ville Saint-Pierre', city: 'Pétion-Ville', terminal: 'TERM-HT-02' },
      { id: 'AG-HT-03', name: 'Banca Cap-Haïtien Boulevard', city: 'Cap-Haïtien', terminal: 'TERM-HT-03' },
    ],
  };

  const [selectedAgencyIdx, setSelectedAgencyIdx] = useState<number>(0);
  const currentAgency = agencies[market][selectedAgencyIdx] || agencies[market][0];

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const cashierName = market === 'MX' ? 'Carlos Mendoza (Cajero #104)' : 'Jean-Baptiste Pierre (Caissier #208)';

  // Official Real Fixtures per jurisdiction for rapid POS ticketing
  const sampleEvents =
    market === 'MX'
      ? [
          {
            id: 'mx-101',
            name: 'Club América vs Chivas de Guadalajara',
            league: 'Liga MX — Torneo Clausura (El Clásico)',
            isLive: true,
            minute: "58'",
            score: '2 - 1',
            odds1: 1.72,
            oddsX: 3.9,
            odds2: 5.4,
          },
          {
            id: 'mx-102',
            name: 'Cruz Azul vs Pumas UNAM',
            league: 'Liga MX — Torneo Clausura',
            isLive: false,
            time: 'Hoy 20:00',
            odds1: 2.15,
            oddsX: 3.35,
            odds2: 3.25,
          },
          {
            id: 'mx-103',
            name: 'Tigres UANL vs CF Monterrey',
            league: 'Liga MX — Clásico Regio',
            isLive: false,
            time: 'Mañana 21:05',
            odds1: 2.4,
            oddsX: 3.2,
            odds2: 2.9,
          },
          {
            id: 'mx-104',
            name: 'Toluca vs Pachuca',
            league: 'Liga MX — Torneo Clausura',
            isLive: false,
            time: 'Domingo 12:00',
            odds1: 1.95,
            oddsX: 3.5,
            odds2: 3.8,
          },
          {
            id: 'ucl-101',
            name: 'Real Madrid vs Manchester City',
            league: 'UEFA Champions League',
            isLive: false,
            time: 'Miércoles 14:00',
            odds1: 2.65,
            oddsX: 3.4,
            odds2: 2.5,
          },
          {
            id: 'ucl-102',
            name: 'Bayern München vs Paris Saint-Germain',
            league: 'UEFA Champions League',
            isLive: false,
            time: 'Miércoles 14:00',
            odds1: 2.2,
            oddsX: 3.6,
            odds2: 3.05,
          },
        ]
      : [
          {
            id: 'ht-201',
            name: 'Violette AC vs Racing Club Haïtien',
            league: 'Championnat National D1 (Derby Haïtien)',
            isLive: true,
            minute: "67'",
            score: '1 - 0',
            odds1: 1.49,
            oddsX: 4.3,
            odds2: 6.9,
          },
          {
            id: 'ht-202',
            name: 'FICA vs Baltimore SC',
            league: 'Championnat National D1 Haïti',
            isLive: false,
            time: 'Demain 16:00',
            odds1: 2.25,
            oddsX: 3.1,
            odds2: 3.2,
          },
          {
            id: 'ht-203',
            name: 'AS Capoise vs Don Bosco FC',
            league: 'Championnat National D1 Haïti',
            isLive: false,
            time: 'Dimanche 16:00',
            odds1: 1.95,
            oddsX: 3.2,
            odds2: 3.8,
          },
          {
            id: 'ht-204',
            name: 'Cavaly AS vs Real Hope FA',
            league: 'Championnat National D1 Haïti',
            isLive: false,
            time: 'Dimanche 18:00',
            odds1: 2.4,
            oddsX: 3.0,
            odds2: 3.0,
          },
          {
            id: 'ucl-101',
            name: 'Real Madrid vs Manchester City',
            league: 'Ligue des Champions UEFA',
            isLive: false,
            time: 'Mercredi 15:00',
            odds1: 2.65,
            oddsX: 3.4,
            odds2: 2.5,
          },
          {
            id: 'ucl-102',
            name: 'Paris Saint-Germain vs Bayern Munich',
            league: 'Ligue des Champions UEFA',
            isLive: false,
            time: 'Mercredi 15:00',
            odds1: 2.2,
            oddsX: 3.6,
            odds2: 3.05,
          },
        ];

  const totalOdds = selections.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialPayout = Math.round(stake * totalOdds * 100) / 100;

  const handleAddPick = (evt: any, pick: '1' | 'X' | '2', odds: number) => {
    const parts = evt.name.split(' vs ');
    const pickName = pick === '1' ? parts[0] : pick === '2' ? parts[1] : 'Empate / Nul';
    const newSel: PosSelection = {
      eventId: evt.id,
      eventName: evt.name,
      marketName: '1X2 (Resultado Final)',
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
      terminalCode: currentAgency.terminal,
      agencyName: currentAgency.name,
      agencyCity: currentAgency.city,
      betType: selections.length > 1 ? `PARLAY (${selections.length} PARTIDOS)` : 'SIMPLE',
      stake,
      totalOdds: Math.round(totalOdds * 100) / 100,
      potentialPayout,
      currency: currencySymbol,
      createdAt: new Date().toLocaleTimeString(),
      expiresAt: new Date(Date.now() + 60 * 86400000).toLocaleDateString(),
      selections,
      termsNotice:
        market === 'MX'
          ? 'OPERACIÓN EXCLUSIVA DE PUNTO DE VENTA. Autorizado por SEGOB (México). Validez de cobro: 60 días en cualquier terminal física autorizada.'
          : 'OPERASYON EKSKLIZIF BANCA / KIOSK. Valable selon la Réglementation Loterie Nationale d’Haïti (LEH). Période de grâce 60 jours.',
    };

    setIssuedTicket(ticket);
    setRecentTickets((prev) => [ticket, ...prev.slice(0, 9)]);
    setCashBalance((prev) => prev + stake);
    setShift((prev) => ({
      ...prev,
      ticketsSold: prev.ticketsSold + 1,
      totalSales: prev.totalSales + stake,
      closingBalance: prev.closingBalance + stake,
    }));
  };

  const handleScanTicket = () => {
    setScanError(null);
    setPayoutSuccess(null);
    if (!queryCode.trim()) return;

    // Search recent issued tickets first
    const found = recentTickets.find(
      (t) => t.ticketNumber.toLowerCase().includes(queryCode.toLowerCase()) || t.barcode.includes(queryCode),
    );

    if (found) {
      setScannedTicket({
        ...found,
        status: 'WON',
        canRedeem: true,
      });
      return;
    }

    if (issuedTicket && (issuedTicket.ticketNumber.includes(queryCode) || issuedTicket.barcode.includes(queryCode))) {
      setScannedTicket({
        ...issuedTicket,
        status: 'WON',
        canRedeem: true,
      });
      return;
    }

    // Default simulated winner ticket for testing
    const sampleStake = 300;
    const sampleOdds = 4.25;
    setScannedTicket({
      ticketNumber: queryCode.startsWith('TK-') ? queryCode : `TK-2026-${queryCode.toUpperCase()}`,
      barcode: `BC${Date.now()}`,
      securityHash: 'SEC-89A7B39F',
      terminalCode: currentAgency.terminal,
      agencyName: currentAgency.name,
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
          eventName: market === 'MX' ? 'Club América vs Chivas' : 'Violette AC vs Racing Club',
          marketName: '1X2',
          selection: market === 'MX' ? 'Club América' : 'Violette AC',
          odds: 1.85,
          status: 'ACERTADO',
        },
        {
          eventName: market === 'MX' ? 'Cruz Azul vs Pumas' : 'FICA vs Baltimore SC',
          marketName: '1X2',
          selection: market === 'MX' ? 'Cruz Azul' : 'FICA',
          odds: 2.3,
          status: 'ACERTADO',
        },
      ],
    });
  };

  const handleRedeemCash = () => {
    if (!scannedTicket) return;
    const amount = scannedTicket.potentialPayout;
    if (cashBalance < amount) {
      alert(`Atención: Efectivo insuficiente en gaveta para pagar este premio ($${amount.toLocaleString()} ${currencySymbol}). Solicita transferencia de fondo a la administración.`);
      return;
    }
    setCashBalance((prev) => Math.max(0, prev - amount));
    setShift((prev) => ({
      ...prev,
      ticketsRedeemed: prev.ticketsRedeemed + 1,
      totalPaid: prev.totalPaid + amount,
      closingBalance: prev.closingBalance - amount,
    }));
    setPayoutSuccess(
      `¡Premio de ${currencySign} ${amount.toLocaleString()} ${currencySymbol} PAGADO EN EFECTIVO! Recibo de pago entregado al cliente.`,
    );
    setScannedTicket((prev: any) => ({ ...prev, status: 'PAID', canRedeem: false }));
  };

  return (
    <div className="min-h-screen bg-[#070e12] text-slate-100 flex flex-col font-sans selection:bg-emerald-500 selection:text-black">
      {/* 1. POS Top Bar: Agency, Cash Drawer, Terminal Status */}
      <header className="bg-[#0b171c] border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-30 shadow-lg">
        {/* Left: Terminal Branding */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-600 text-black flex items-center justify-center font-black shadow-lg shadow-emerald-500/20">
            <Store className="w-5 h-5 text-black" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-black text-base text-white tracking-wider">TERMINAL DE VENTAS RETAIL</span>
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                PUNTO DE VENTA FÍSICO
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span className="text-white font-medium">{currentAgency.name}</span>
              <span>•</span>
              <span className="font-mono text-emerald-400 font-bold">{currentAgency.terminal}</span>
            </div>
          </div>
        </div>

        {/* Right: Cash In Drawer & Jurisdiction Switcher */}
        <div className="flex items-center gap-4 flex-wrap">
          {/* Agency Selector Dropdown */}
          <div className="hidden md:flex items-center gap-1.5 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-emerald-400" />
            <select
              value={selectedAgencyIdx}
              onChange={(e) => setSelectedAgencyIdx(Number(e.target.value))}
              className="bg-transparent text-white font-semibold focus:outline-none cursor-pointer"
            >
              {agencies[market].map((ag, idx) => (
                <option key={ag.id} value={idx} className="bg-slate-900 text-white">
                  {ag.city} — {ag.name}
                </option>
              ))}
            </select>
          </div>

          {/* Cash Drawer Balance */}
          <div className="flex items-center gap-3 bg-slate-900 border border-emerald-500/30 px-4 py-1.5 rounded-xl shadow-inner">
            <Coins className="w-5 h-5 text-emerald-400 animate-pulse" />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Gaveta de Efectivo</span>
              <span className="text-base font-mono font-black text-emerald-400">
                {currencySign} {cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
            </div>
          </div>

          {/* Market Switcher (MX / HT) */}
          <div className="flex items-center bg-slate-900 border border-slate-800 rounded-xl p-1 text-xs font-bold">
            <button
              onClick={() => {
                setMarket('MX');
                setSelections([]);
                setSelectedAgencyIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                market === 'MX'
                  ? 'bg-emerald-500 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇲🇽 México (MXN)
            </button>
            <button
              onClick={() => {
                setMarket('HT');
                setSelections([]);
                setSelectedAgencyIdx(0);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                market === 'HT'
                  ? 'bg-emerald-500 text-black shadow-md font-black'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              🇭🇹 Haïti (HTG)
            </button>
          </div>
        </div>
      </header>

      {/* 2. POS Navigation Bar (Sales / Scanner / Cashbox) */}
      <div className="bg-[#0e1d23] border-b border-slate-800/80 px-4 py-2.5 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
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
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all ${
              activeTab === 'cashbox'
                ? 'bg-emerald-500 text-black shadow-lg shadow-emerald-500/20'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            3. Arqueo y Cierre de Caja (F9)
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
          <div className="flex items-center gap-1.5">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-emerald-400 font-bold">LÍNEA DEDICADA ACTIVA</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <UserCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>{cashierName}</span>
          </div>
        </div>
      </div>

      {/* 3. Main Content Grid */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {/* TAB 1: TICKET SALES & FAST CASHER DESK */}
        {activeTab === 'sales' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left: Sports Catalog for Fast Ticketing */}
            <div className="lg:col-span-8 bg-[#0b171c] rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col space-y-4">
              <div className="flex flex-wrap items-center justify-between pb-3 border-b border-slate-800 gap-2">
                <div>
                  <h2 className="font-black text-base text-white flex items-center gap-2">
                    <span>⚽ Catálogo Oficial de Partidos en Ventanilla</span>
                  </h2>
                  <p className="text-xs text-slate-400">
                    {market === 'MX'
                      ? 'Cuotas oficiales auditadas para agencias y terminales SEGOB'
                      : 'Kòt ofisyèl verifye pou banca ak kiosk Loterie Nationale d’Haïti (LEH)'}
                  </p>
                </div>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/30 font-bold">
                  {sampleEvents.length} Eventos Disponibles
                </span>
              </div>

              {/* Event Cards */}
              <div className="space-y-3">
                {sampleEvents.map((evt) => (
                  <div
                    key={evt.id}
                    className="p-4 rounded-xl bg-slate-900/90 border border-slate-800 hover:border-slate-700 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-amber-400 tracking-wider uppercase font-mono">
                          {evt.league}
                        </span>
                        {evt.isLive && (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 border border-rose-500/40 text-rose-300 text-[9px] font-mono font-bold animate-pulse">
                            ● EN DIRECTO ({evt.minute} • {evt.score})
                          </span>
                        )}
                        {!evt.isLive && (
                          <span className="text-[10px] text-slate-400 font-mono">({evt.time})</span>
                        )}
                      </div>
                      <h3 className="font-bold text-sm text-white">{evt.name}</h3>
                    </div>

                    {/* Odds 1X2 Buttons */}
                    <div className="grid grid-cols-3 gap-2 min-w-[280px]">
                      <button
                        onClick={() => handleAddPick(evt, '1', evt.odds1)}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-black transition-all border border-slate-700/60 active:scale-95 group"
                      >
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-black">1 (Local)</span>
                        <span className="font-mono font-black text-sm">{evt.odds1.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => handleAddPick(evt, 'X', evt.oddsX)}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-black transition-all border border-slate-700/60 active:scale-95 group"
                      >
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-black">X (Empate)</span>
                        <span className="font-mono font-black text-sm">{evt.oddsX.toFixed(2)}</span>
                      </button>
                      <button
                        onClick={() => handleAddPick(evt, '2', evt.odds2)}
                        className="flex flex-col items-center justify-center p-2.5 rounded-xl bg-slate-800 hover:bg-emerald-500 hover:text-black transition-all border border-slate-700/60 active:scale-95 group"
                      >
                        <span className="text-[10px] font-bold text-slate-400 group-hover:text-black">2 (Visita)</span>
                        <span className="font-mono font-black text-sm">{evt.odds2.toFixed(2)}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Cashier Bet Slip & Thermal Slip Generation */}
            <div className="lg:col-span-4 bg-[#0b171c] rounded-2xl border border-slate-800 p-5 shadow-2xl flex flex-col justify-between sticky top-24">
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                  <div className="flex items-center gap-2">
                    <Receipt className="w-4 h-4 text-emerald-400" />
                    <h3 className="font-black text-sm text-white uppercase tracking-wider">Boleto en Ventanilla</h3>
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
                  <div className="py-10 text-center text-slate-500 text-xs flex flex-col items-center gap-2">
                    <Barcode className="w-8 h-8 text-slate-600" />
                    <p>Haz clic en las cuotas de los partidos para generar un ticket físico térmico.</p>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {selections.map((sel) => (
                      <div
                        key={sel.eventId}
                        className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between text-xs"
                      >
                        <div className="flex flex-col">
                          <span className="text-slate-400 text-[10px]">{sel.eventName}</span>
                          <span className="font-bold text-white mt-0.5">{sel.selection}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-black text-emerald-400">{sel.odds.toFixed(2)}</span>
                          <button
                            onClick={() => setSelections(selections.filter((s) => s.eventId !== sel.eventId))}
                            className="text-slate-500 hover:text-rose-400 text-base font-bold"
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
                  <label className="text-[11px] font-bold text-slate-400 block mb-1.5 uppercase font-mono">
                    Importe en Efectivo Recibido ({currencySymbol})
                  </label>
                  <div className="grid grid-cols-4 gap-1.5 mb-2">
                    {[50, 100, 200, 500].map((val) => (
                      <button
                        key={val}
                        onClick={() => setStake(val)}
                        className={`py-1.5 rounded-lg font-mono font-bold text-xs transition-colors ${
                          stake === val
                            ? 'bg-emerald-500 text-black shadow-md'
                            : 'bg-slate-800 hover:bg-slate-700 text-slate-200'
                        }`}
                      >
                        {currencySign}{val}
                      </button>
                    ))}
                  </div>
                  <input
                    type="number"
                    value={stake}
                    onChange={(e) => setStake(Math.max(10, Number(e.target.value)))}
                    className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3 py-2 text-right font-mono font-bold text-base text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Calculations Summary */}
                <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-400">
                    <span>Partidos:</span>
                    <span className="font-bold text-white">{selections.length}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>Cuota Total:</span>
                    <span className="font-mono font-bold text-amber-400">{totalOdds.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 font-bold text-sm pt-2 border-t border-slate-800">
                    <span>Premio Potencial a Pagar:</span>
                    <span className="font-mono text-emerald-400 font-black">
                      {currencySign} {potentialPayout.toLocaleString()} {currencySymbol}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Button: Print */}
              <button
                disabled={selections.length === 0}
                onClick={handlePrintTicket}
                className="mt-5 w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 disabled:opacity-40 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25 transition-all active:scale-[0.98]"
              >
                <Printer className="w-5 h-5" />
                Emitir e Imprimir Ticket Físico (F8)
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: TICKET SCANNER & INSTANT REDEMPTION */}
        {activeTab === 'scanner' && (
          <div className="max-w-2xl mx-auto bg-[#0b171c] rounded-2xl border border-slate-800 p-6 shadow-2xl">
            <div className="flex items-center gap-3 pb-4 border-b border-slate-800 mb-6">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <Barcode className="w-6 h-6" />
              </div>
              <div>
                <h2 className="font-black text-lg text-white">Escaneo y Pago de Boletos Ganadores</h2>
                <p className="text-xs text-slate-400">
                  Usa el lector láser de código de barras o ingresa el número de serie
                </p>
              </div>
            </div>

            {/* Barcode Search Form */}
            <div className="flex gap-2 mb-6">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Escanear código de barras o ej: TK-2026..."
                  value={queryCode}
                  onChange={(e) => setQueryCode(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleScanTicket()}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <button
                onClick={handleScanTicket}
                className="px-6 py-3 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-black text-sm transition-colors uppercase tracking-wider"
              >
                Verificar
              </button>
            </div>

            {/* Payout Success Alert */}
            {payoutSuccess && (
              <div className="mb-6 p-4 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-sm flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="font-bold">{payoutSuccess}</span>
              </div>
            )}

            {/* Ticket Details Card */}
            {scannedTicket && (
              <div className="p-5 rounded-2xl bg-slate-900 border border-slate-700 space-y-4 shadow-xl">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[10px] text-slate-400 font-mono block">NÚMERO DE BOLETO OFICIAL</span>
                    <span className="font-mono font-black text-lg text-white">{scannedTicket.ticketNumber}</span>
                  </div>
                  <div>
                    {scannedTicket.status === 'WON' && (
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 animate-pulse">
                        ● BOLETO GANADOR (LISTO PARA COBRAR)
                      </span>
                    )}
                    {scannedTicket.status === 'PAID' && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-700 text-slate-300">
                        ✓ PREMIO YA PAGADO
                      </span>
                    )}
                  </div>
                </div>

                {/* Selections breakdown */}
                <div className="space-y-2">
                  <span className="text-[11px] font-bold text-slate-400 uppercase font-mono">
                    Detalle de Pronósticos Verificados
                  </span>
                  {scannedTicket.selections?.map((s: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex justify-between items-center text-xs p-2.5 rounded-lg bg-slate-800 border border-slate-700/50"
                    >
                      <div>
                        <span className="text-white font-medium">{s.eventName}</span>
                        <span className="text-emerald-400 font-bold ml-2">[{s.selection}]</span>
                      </div>
                      <span className="font-mono text-amber-400 font-bold">@{s.odds}</span>
                    </div>
                  ))}
                </div>

                {/* Financial Summary */}
                <div className="p-4 rounded-xl bg-slate-800 grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-xs text-slate-400 block font-mono">Importe Jugado:</span>
                    <span className="font-mono font-bold text-white text-base">
                      {currencySign} {scannedTicket.stake} {scannedTicket.currency}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-slate-400 block font-mono">Premio a Entregar en Efectivo:</span>
                    <span className="font-mono font-black text-xl text-emerald-400">
                      {currencySign} {scannedTicket.potentialPayout?.toLocaleString()} {scannedTicket.currency}
                    </span>
                  </div>
                </div>

                {scannedTicket.canRedeem && (
                  <button
                    onClick={handleRedeemCash}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:brightness-110 text-black font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-emerald-500/25"
                  >
                    <Coins className="w-5 h-5" />
                    Pagar Premio en Efectivo ({currencySign} {scannedTicket.potentialPayout?.toLocaleString()}{' '}
                    {scannedTicket.currency})
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: CASHBOX RECONCILIATION & DAILY Z-REPORT */}
        {activeTab === 'cashbox' && (
          <div className="max-w-2xl mx-auto bg-[#0b171c] rounded-2xl border border-slate-800 p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <DollarSign className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="font-black text-lg text-white">Arqueo y Cierre de Turno (Reporte Z)</h2>
                  <p className="text-xs text-slate-400">
                    Conciliación oficial de gaveta de efectivo y entrega a administración
                  </p>
                </div>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-slate-800 text-emerald-400 border border-emerald-500/30 font-bold">
                Turno #{Date.now().toString(36).toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-mono">Fondo Inicial de Gaveta:</span>
                <p className="text-xl font-mono font-bold text-white mt-1">
                  {currencySign} {shift.openingBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  {currencySymbol}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-mono">
                  Ventas de Boletos ({shift.ticketsSold} tickets):
                </span>
                <p className="text-xl font-mono font-bold text-emerald-400 mt-1">
                  +{currencySign} {shift.totalSales.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  {currencySymbol}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800">
                <span className="text-xs text-slate-400 font-mono">
                  Premios Pagados ({shift.ticketsRedeemed} premios):
                </span>
                <p className="text-xl font-mono font-bold text-rose-400 mt-1">
                  -{currencySign} {shift.totalPaid.toLocaleString('en-US', { minimumFractionDigits: 2 })}{' '}
                  {currencySymbol}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30">
                <span className="text-xs text-slate-400 font-mono">Total Efectivo Físico en Gaveta:</span>
                <p className="text-2xl font-mono font-black text-emerald-400 mt-1">
                  {currencySign} {cashBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Agencia Responsable:</span>
                <span className="font-bold text-white">{currentAgency.name}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Identificador de Terminal:</span>
                <span className="font-mono font-bold text-emerald-400">{currentAgency.terminal}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Apertura de Turno:</span>
                <span className="font-mono text-slate-300">{shift.openedAt}</span>
              </div>
              <div className="flex justify-between text-slate-400">
                <span>Dependiente / Cajero:</span>
                <span className="text-white font-medium">{cashierName}</span>
              </div>
            </div>

            <button
              onClick={() => {
                window.print();
                alert(`Reporte Z emitido para ${currentAgency.name}. Arqueo contable cerrado con éxito.`);
              }}
              className="w-full py-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 border border-slate-700 transition-all shadow-lg"
            >
              <Printer className="w-5 h-5 text-emerald-400" />
              Imprimir Arqueo de Caja (Reporte Z)
            </button>
          </div>
        )}
      </main>

      {/* 4. Thermal Ticket Modal / Print Preview (80mm / 58mm format) */}
      {issuedTicket && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            id="thermal-receipt"
            className="w-full max-w-sm bg-white text-black p-6 rounded-lg font-mono text-xs shadow-2xl flex flex-col items-center border border-gray-300"
          >
            {/* Ticket Header */}
            <div className="text-center border-b-2 border-dashed border-black pb-3 w-full">
              <h2 className="font-black text-lg tracking-widest uppercase">NEW BRAND</h2>
              <p className="text-[10px] uppercase font-bold tracking-wider">PUNTO DE VENTA Y BANCA AUTORIZADA</p>
              <p className="text-[10px] text-gray-800 font-semibold">{issuedTicket.agencyName}</p>
              <p className="text-[10px] text-gray-700">
                {issuedTicket.agencyCity} • {issuedTicket.terminalCode}
              </p>
              <p className="text-[10px] mt-1 text-gray-500 font-mono">{issuedTicket.createdAt}</p>
            </div>

            {/* Ticket Body */}
            <div className="py-3 border-b-2 border-dashed border-black w-full space-y-2">
              <div className="flex justify-between font-bold text-xs">
                <span>BOLETO:</span>
                <span className="font-black">{issuedTicket.ticketNumber}</span>
              </div>
              <div className="flex justify-between text-[11px]">
                <span>MODALIDAD:</span>
                <span className="font-bold">{issuedTicket.betType}</span>
              </div>

              {/* Selections */}
              <div className="pt-2 space-y-2 border-t border-gray-200">
                <span className="font-bold block text-[10px] uppercase">PRONÓSTICOS REGISTRADOS:</span>
                {issuedTicket.selections.map((s, idx) => (
                  <div key={idx} className="text-[10px] leading-tight border-b border-gray-200 pb-1">
                    <p className="font-bold text-gray-900">{s.eventName}</p>
                    <div className="flex justify-between text-gray-700 font-mono">
                      <span>Pick: {s.selection}</span>
                      <span className="font-black">@{s.odds.toFixed(2)}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Financial Totals */}
              <div className="pt-2 text-xs font-bold space-y-1">
                <div className="flex justify-between">
                  <span>CUOTA TOTAL:</span>
                  <span>{issuedTicket.totalOdds.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>IMPORTE RECIBIDO:</span>
                  <span>
                    {currencySign} {issuedTicket.stake.toLocaleString()} {issuedTicket.currency}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-black font-black bg-gray-100 p-1.5 rounded">
                  <span>PREMIO POTENCIAL:</span>
                  <span>
                    {currencySign} {issuedTicket.potentialPayout.toLocaleString()} {issuedTicket.currency}
                  </span>
                </div>
              </div>
            </div>

            {/* Barcode & Security Hash */}
            <div className="py-3 text-center w-full flex flex-col items-center">
              {/* Simulated Thermal Barcode */}
              <div className="w-52 h-10 bg-black flex items-center justify-around px-2 my-1">
                {Array.from({ length: 36 }).map((_, i) => (
                  <span
                    key={i}
                    className="h-8 bg-white inline-block"
                    style={{ width: i % 4 === 0 ? '3px' : '1px' }}
                  ></span>
                ))}
              </div>
              <span className="text-[10px] tracking-widest font-black font-mono">{issuedTicket.barcode}</span>
              <span className="text-[9px] text-gray-600 mt-1 font-mono">HASH SEGURIDAD: {issuedTicket.securityHash}</span>
              <p className="text-[8px] text-gray-600 mt-2 text-center leading-tight">
                {issuedTicket.termsNotice}
              </p>
            </div>

            {/* Print & Close Actions */}
            <div className="w-full pt-3 border-t border-gray-300 flex gap-2">
              <button
                onClick={() => window.print()}
                className="flex-1 py-2.5 rounded bg-black text-white font-black text-xs flex items-center justify-center gap-1.5 hover:bg-gray-800"
              >
                <Printer className="w-4 h-4" />
                Imprimir Boleto
              </button>
              <button
                onClick={() => {
                  setIssuedTicket(null);
                  setSelections([]);
                }}
                className="px-4 py-2.5 rounded bg-gray-200 text-black font-bold text-xs hover:bg-gray-300"
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
