'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Trophy, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';

export const BetSlipDrawer: React.FC = () => {
  const {
    t,
    market,
    demoBalance,
    updateDemoBalance,
    betSelections,
    removeBetSelection,
    clearBetSelections,
    isBetSlipOpen,
    setIsBetSlipOpen,
  } = useApp();

  const [stake, setStake] = useState<number>(100);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isBetSlipOpen) return null;

  const totalOdds = betSelections.reduce((acc, curr) => acc * curr.odds, 1);
  const potentialWin = Math.round(stake * totalOdds * 100) / 100;
  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  const handlePlaceBet = () => {
    if (betSelections.length === 0) {
      setErrorMessage('Agrega al menos una selección para apostar.');
      return;
    }
    if (stake <= 0) {
      setErrorMessage('Ingresa un importe válido.');
      return;
    }
    if (demoBalance < stake) {
      setErrorMessage('Saldo demo insuficiente. Recárgalo desde el encabezado.');
      return;
    }

    const ok = updateDemoBalance(-stake);
    if (!ok) {
      setErrorMessage('Error al debitar saldo demo.');
      return;
    }

    setErrorMessage(null);
    setSuccessMessage(t.betSlip.betSuccess);

    setTimeout(() => {
      clearBetSelections();
      setSuccessMessage(null);
      setIsBetSlipOpen(false);
    }, 2500);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm sm:max-w-md rounded-2xl bg-brand-navy border border-brand-gold/40 shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
      {/* Header */}
      <div className="p-4 bg-brand-dark border-b border-brand-navyLight flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trophy className="w-5 h-5 text-brand-gold" />
          <h4 className="font-bold text-sm text-white">{t.betSlip.title}</h4>
          <span className="px-2 py-0.5 rounded-full bg-brand-navyLight text-brand-gold font-mono text-xs">
            {betSelections.length}
          </span>
        </div>
        <div className="flex items-center gap-2">
          {betSelections.length > 0 && (
            <button
              onClick={clearBetSelections}
              title={t.betSlip.clear}
              className="p-1 rounded text-slate-400 hover:text-rose-400 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsBetSlipOpen(false)}
            className="p-1 rounded text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 overflow-y-auto flex-1 space-y-3">
        {successMessage ? (
          <div className="p-6 text-center rounded-xl bg-emerald-950/70 border border-emerald-500/50 space-y-2">
            <CheckCircle2 className="w-10 h-10 text-brand-positive mx-auto" />
            <h5 className="font-bold text-white text-sm">{successMessage}</h5>
            <p className="text-xs text-slate-300">
              ID de Transacción Demo: <code>{Math.random().toString(36).substring(2, 9).toUpperCase()}</code>
            </p>
          </div>
        ) : betSelections.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-xs">
            <p>{t.betSlip.empty}</p>
          </div>
        ) : (
          betSelections.map((bet) => (
            <div
              key={bet.id}
              className="p-3 rounded-xl bg-brand-card border border-slate-800 flex items-start justify-between gap-3 text-xs"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-slate-400">{bet.eventName}</span>
                <p className="font-bold text-white">{bet.pickName}</p>
                <span className="text-[10px] text-brand-gold">{bet.marketName}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-mono font-bold text-sm text-brand-positive">
                  {bet.odds.toFixed(2)}
                </span>
                <button
                  onClick={() => removeBetSelection(bet.id)}
                  className="text-slate-500 hover:text-rose-400"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer / Betting form */}
      {betSelections.length > 0 && !successMessage && (
        <div className="p-4 bg-brand-dark/95 border-t border-brand-navyLight space-y-3">
          {/* Quick Stake Buttons */}
          <div className="flex items-center gap-2">
            {[50, 100, 250, 500].map((amt) => (
              <button
                key={amt}
                onClick={() => setStake(amt)}
                className={`flex-1 py-1 rounded-lg text-xs font-mono font-semibold border ${
                  stake === amt
                    ? 'bg-brand-navyLight border-brand-gold text-brand-gold'
                    : 'bg-brand-card border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                ${amt}
              </button>
            ))}
          </div>

          {/* Stake Input */}
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-400">{t.common.stake}:</span>
            <div className="flex items-center gap-1">
              <span className="text-slate-400">$</span>
              <input
                type="number"
                value={stake}
                onChange={(e) => setStake(Math.max(0, Number(e.target.value)))}
                className="w-24 px-2 py-1 rounded bg-brand-card border border-slate-700 text-right font-mono font-bold text-white text-xs focus:outline-none focus:border-brand-gold"
              />
              <span className="text-slate-400 font-mono text-[10px]">{currencySymbol}</span>
            </div>
          </div>

          {/* Odds & Payout calculation */}
          <div className="pt-2 border-t border-slate-800 space-y-1 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Cuota combinada:</span>
              <span className="font-mono font-bold text-white">{totalOdds.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-white font-bold">
              <span>{t.betSlip.potentialWin}:</span>
              <span className="font-mono text-brand-positive text-sm">
                ${potentialWin.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
            </div>
          </div>

          {errorMessage && (
            <div className="p-2 rounded bg-rose-950 text-rose-300 text-xs flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <button
            onClick={handlePlaceBet}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black font-black text-sm uppercase tracking-wider hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
          >
            {t.common.placeBet}
          </button>
        </div>
      )}
    </div>
  );
};

