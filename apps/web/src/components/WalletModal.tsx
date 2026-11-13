'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import {
  X,
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  History,
  CheckCircle2,
  AlertTriangle,
  ShieldCheck,
  Coins,
} from 'lucide-react';

export const WalletModal: React.FC = () => {
  const {
    walletModalOpen,
    walletMode,
    closeWallet,
    openWallet,
    demoBalance,
    updateDemoBalance,
    market,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'deposit' | 'withdraw' | 'history'>(walletMode);
  const [amount, setAmount] = useState<number>(5000);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [txId, setTxId] = useState<string | null>(null);

  React.useEffect(() => {
    setActiveTab(walletMode);
    setSuccessMsg(null);
    setErrorMsg(null);
  }, [walletMode, walletModalOpen]);

  if (!walletModalOpen) return null;

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  const handleDeposit = () => {
    if (amount <= 0) {
      setErrorMsg('Ingresa un monto válido.');
      return;
    }
    updateDemoBalance(amount);
    const generatedId = `LEDGER-DEP-${Date.now().toString(36).toUpperCase()}`;
    setTxId(generatedId);
    setSuccessMsg(`¡Recarga demo de $${amount.toLocaleString()} ${currencySymbol} acreditada en tu Ledger inmutable!`);
    setErrorMsg(null);
  };

  const handleWithdraw = () => {
    if (amount <= 0) {
      setErrorMsg('Ingresa un monto válido.');
      return;
    }
    if (amount > demoBalance) {
      setErrorMsg('Saldo demo insuficiente para realizar este retiro.');
      return;
    }
    const ok = updateDemoBalance(-amount);
    if (ok) {
      const generatedId = `LEDGER-WTH-${Date.now().toString(36).toUpperCase()}`;
      setTxId(generatedId);
      setSuccessMsg(`¡Retiro simulado de $${amount.toLocaleString()} ${currencySymbol} procesado en el Ledger demo!`);
      setErrorMsg(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-brand-navy border border-brand-mint/40 shadow-2xl overflow-hidden text-white flex flex-col">
        {/* Header */}
        <div className="p-4 bg-brand-dark border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-mint text-black flex items-center justify-center font-black">
              <Wallet className="w-5 h-5 text-black" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white flex items-center gap-2">
                Billetera Demo Regulada
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-brand-mintDark text-brand-mint border border-brand-mint/40">
                  Doble Partida
                </span>
              </h3>
              <p className="text-[11px] text-slate-400">Jurisdicción: {market === 'MX' ? 'México (MXN)' : 'Haïti (HTG)'}</p>
            </div>
          </div>
          <button
            onClick={closeWallet}
            className="p-1 rounded-lg hover:bg-brand-navyLight text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="p-4 bg-brand-card border-b border-brand-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className="w-4 h-4 text-brand-gold" />
            <span className="text-xs text-slate-300">Saldo Disponible Demo:</span>
          </div>
          <span className="text-lg font-mono font-black text-brand-mint">
            ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
          </span>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-3 border-b border-brand-border text-xs font-bold text-center">
          <button
            onClick={() => {
              setActiveTab('deposit');
              setSuccessMsg(null);
              setErrorMsg(null);
            }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'deposit'
                ? 'border-brand-mint text-brand-mint bg-brand-navyLight/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ArrowDownLeft className="w-3.5 h-3.5" />
            <span>Recargas</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('withdraw');
              setSuccessMsg(null);
              setErrorMsg(null);
            }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'withdraw'
                ? 'border-brand-mint text-brand-mint bg-brand-navyLight/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>Retiros</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('history');
              setSuccessMsg(null);
              setErrorMsg(null);
            }}
            className={`py-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
              activeTab === 'history'
                ? 'border-brand-mint text-brand-mint bg-brand-navyLight/50'
                : 'border-transparent text-slate-400 hover:text-white'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Movimientos</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 space-y-5 text-xs">
          {successMsg ? (
            <div className="p-5 rounded-xl bg-emerald-950/80 border border-brand-mint/50 text-center space-y-3">
              <CheckCircle2 className="w-10 h-10 text-brand-mint mx-auto" />
              <h4 className="font-bold text-sm text-white">{successMsg}</h4>
              <p className="font-mono text-[11px] text-brand-mint">Asiento Contable: {txId}</p>
              <button
                onClick={() => setSuccessMsg(null)}
                className="px-4 py-2 rounded-lg bg-brand-mint text-black font-bold text-xs"
              >
                Continuar
              </button>
            </div>
          ) : (
            <>
              {errorMsg && (
                <div className="p-3 rounded-lg bg-rose-950 border border-rose-500/50 text-rose-300">
                  {errorMsg}
                </div>
              )}

              {activeTab === 'deposit' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-300 font-semibold">Seleccionar Monto de Recarga Demo</label>
                    <span className="text-[10px] text-slate-400">Sin dinero real</span>
                  </div>

                  {/* Preset Amount Chips */}
                  <div className="grid grid-cols-4 gap-2">
                    {[1000, 5000, 10000, 50000].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAmount(val)}
                        className={`py-2 rounded-xl font-mono font-bold text-xs border transition-all ${
                          amount === val
                            ? 'bg-brand-mint text-black border-brand-mint shadow-md'
                            : 'bg-brand-card hover:bg-brand-cardHover border-brand-border text-slate-300'
                        }`}
                      >
                        ${val.toLocaleString()}
                      </button>
                    ))}
                  </div>

                  <div>
                    <label className="block text-slate-400 text-[11px] mb-1">O ingresa un monto personalizado:</label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
                      <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                        className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-brand-dark border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-brand-mint"
                      />
                      <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-[11px]">
                        {currencySymbol}
                      </span>
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-brand-dark/80 border border-slate-800 text-[11px] text-slate-400 space-y-1">
                    <div className="flex items-center gap-1.5 text-brand-mint font-semibold">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Ledger Inmutable Garantizado</span>
                    </div>
                    <p>Las recargas demo se registran como un crédito directo en tu cuenta contable demostrativa.</p>
                  </div>

                  <button
                    onClick={handleDeposit}
                    className="w-full py-3.5 rounded-xl bg-brand-mint hover:bg-brand-mintHover text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-mint/20 transition-all"
                  >
                    Confirmar Recarga Demo (+${amount.toLocaleString()} {currencySymbol})
                  </button>
                </div>
              )}

              {activeTab === 'withdraw' && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-300 font-semibold">Monto de Retiro Simulado</label>
                    <span className="text-[10px] text-slate-400">Verificación inmediata</span>
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-slate-400 font-mono">$</span>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(Number(e.target.value))}
                      className="w-full pl-8 pr-16 py-2.5 rounded-xl bg-brand-dark border border-slate-700 text-white font-mono font-bold focus:outline-none focus:border-brand-mint"
                    />
                    <span className="absolute right-3 top-2.5 text-slate-400 font-mono text-[11px]">
                      {currencySymbol}
                    </span>
                  </div>

                  <div className="p-3 rounded-xl bg-yellow-500/10 border border-yellow-500/30 text-[11px] text-yellow-200/90 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 text-brand-gold flex-shrink-0 mt-0.5" />
                    <span>
                      Este retiro es 100% simulado en el ledger de demostración para verificar el flujo contable. No se efectúan transferencias bancarias reales.
                    </span>
                  </div>

                  <button
                    onClick={handleWithdraw}
                    className="w-full py-3.5 rounded-xl bg-brand-mint hover:bg-brand-mintHover text-black font-black text-sm uppercase tracking-wider shadow-lg shadow-brand-mint/20 transition-all"
                  >
                    Solicitar Retiro Demo (-${amount.toLocaleString()} {currencySymbol})
                  </button>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[
                    { type: 'RECARGA DEMO', amount: '+10,000.00', date: 'Hoy 10:15 am', status: 'CONFIRMADO' },
                    { type: 'APUESTA DEMO', amount: '-1,000.00', date: 'Ayer 08:30 pm', status: 'CONFIRMADO' },
                    { type: 'PREMIO PARLAY', amount: '+4,240.00', date: 'Ayer 10:00 pm', status: 'CONFIRMADO' },
                  ].map((row, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-brand-card border border-brand-border flex items-center justify-between text-xs"
                    >
                      <div>
                        <p className="font-bold text-white">{row.type}</p>
                        <span className="text-[10px] text-slate-400">{row.date}</span>
                      </div>
                      <div className="text-right">
                        <span
                          className={`font-mono font-bold ${
                            row.amount.startsWith('+') ? 'text-brand-mint' : 'text-slate-300'
                          }`}
                        >
                          {row.amount} {currencySymbol}
                        </span>
                        <span className="block text-[9px] text-slate-500 font-mono">{row.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

