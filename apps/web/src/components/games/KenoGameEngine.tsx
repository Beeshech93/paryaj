'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, RotateCcw, Sparkles, Trophy, Zap, AlertCircle, CheckCircle2 } from 'lucide-react';

interface KenoGameEngineProps {
  gameTitle: string;
  onClose?: () => void;
}

const PAYOUT_TABLE: Record<number, Record<number, number>> = {
  // picksCount: { matches: multiplier }
  1: { 1: 3.5 },
  2: { 1: 1, 2: 9 },
  3: { 2: 2.5, 3: 45 },
  4: { 2: 1.5, 3: 8, 4: 120 },
  5: { 2: 1, 3: 4, 4: 25, 5: 350 },
  6: { 3: 3, 4: 15, 5: 90, 6: 1500 },
  7: { 3: 2, 4: 7, 5: 35, 6: 300, 7: 5000 },
  8: { 4: 5, 5: 20, 6: 120, 7: 1200, 8: 10000 },
  9: { 4: 3, 5: 12, 6: 60, 7: 500, 8: 3000, 9: 15000 },
  10: { 5: 10, 6: 40, 7: 250, 8: 1500, 9: 6000, 10: 25000 },
};

export const KenoGameEngine: React.FC<KenoGameEngineProps> = ({ gameTitle }) => {
  const { isRealMode, realBalance, demoBalance, updateRealBalance, updateDemoBalance, market } = useApp();
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([]);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stake, setStake] = useState<number>(50);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const currentBalance = isRealMode ? realBalance : demoBalance;

  const toggleNumber = (num: number) => {
    if (isDrawing) return;
    setErrorMessage(null);
    setLastWin(null);

    if (selectedNumbers.includes(num)) {
      setSelectedNumbers((prev) => prev.filter((n) => n !== num));
    } else {
      if (selectedNumbers.length >= 10) {
        setErrorMessage('Máximo 10 números permitidos por jugada');
        return;
      }
      setSelectedNumbers((prev) => [...prev, num].sort((a, b) => a - b));
    }
  };

  const autoPick = (count: number) => {
    if (isDrawing) return;
    setErrorMessage(null);
    setLastWin(null);
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const picked: number[] = [];
    while (picked.length < count && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      picked.push(pool.splice(idx, 1)[0]);
    }
    setSelectedNumbers(picked.sort((a, b) => a - b));
  };

  const clearSelection = () => {
    if (isDrawing) return;
    setSelectedNumbers([]);
    setDrawnNumbers([]);
    setLastWin(null);
    setErrorMessage(null);
  };

  const handleStartDraw = () => {
    if (isDrawing) return;
    setErrorMessage(null);
    setLastWin(null);

    if (selectedNumbers.length === 0) {
      setErrorMessage('Selecciona al menos 1 número para jugar');
      return;
    }

    if (stake <= 0) {
      setErrorMessage('Ingresa un monto de apuesta válido');
      return;
    }

    if (currentBalance < stake) {
      setErrorMessage('Saldo insuficiente para esta apuesta');
      return;
    }

    // Deduct stake
    const deducted = isRealMode ? updateRealBalance(-stake) : updateDemoBalance(-stake);
    if (!deducted) {
      setErrorMessage('No se pudo debitar el saldo de apuesta');
      return;
    }

    setIsDrawing(true);
    setDrawnNumbers([]);

    // Generate 20 unique random numbers from 1 to 80
    const pool = Array.from({ length: 80 }, (_, i) => i + 1);
    const finalDraw: number[] = [];
    while (finalDraw.length < 20 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      finalDraw.push(pool.splice(idx, 1)[0]);
    }

    // Animate the drawing step-by-step
    let currentCount = 0;
    const interval = setInterval(() => {
      currentCount++;
      setDrawnNumbers(finalDraw.slice(0, currentCount));

      if (currentCount >= 20) {
        clearInterval(interval);
        setIsDrawing(false);

        // Compute results
        const matches = selectedNumbers.filter((n) => finalDraw.includes(n)).length;
        const multiplierTable = PAYOUT_TABLE[selectedNumbers.length] || {};
        const multiplier = multiplierTable[matches] || 0;
        const winAmount = stake * multiplier;

        if (winAmount > 0) {
          if (isRealMode) {
            updateRealBalance(winAmount);
          } else {
            updateDemoBalance(winAmount);
          }
          setLastWin(winAmount);
        } else {
          setLastWin(0);
        }
      }
    }, 110);
  };

  const matchesCount = selectedNumbers.filter((n) => drawnNumbers.includes(n)).length;
  const currentMultiplier = (PAYOUT_TABLE[selectedNumbers.length] || {})[matchesCount] || 0;

  return (
    <div className="w-full h-full bg-[#0a0e14] text-slate-100 p-4 sm:p-6 overflow-y-auto font-sans flex flex-col justify-between">
      {/* Top Banner Stats */}
      <div className="bg-[#121922] border border-slate-800 rounded-xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-emerald-500/20">
            🎱
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              {gameTitle}
              <span className="text-[10px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 px-2 py-0.5 rounded-full font-mono">
                RNG Certificado
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Elige de 1 a 10 números • Sorteo oficial de 20 esferas
            </p>
          </div>
        </div>

        {/* Live Draw summary */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">SELECCIONADOS</span>
            <span className="text-emerald-400 font-bold text-sm">{selectedNumbers.length} / 10</span>
          </div>
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">ACIERTOS</span>
            <span className="text-yellow-400 font-bold text-sm">{matchesCount}</span>
          </div>
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400 block text-[10px]">MULTIPLICADOR</span>
            <span className="text-white font-bold text-sm">{currentMultiplier}x</span>
          </div>
        </div>
      </div>

      {/* Main Play Area */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* Left 3 cols: 80 Numbers Grid */}
        <div className="lg:col-span-3 bg-[#101720] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3 text-xs text-slate-400">
              <span>TABLERO DE ESFERAS (1 - 80)</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => autoPick(5)}
                  disabled={isDrawing}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  Auto 5
                </button>
                <button
                  onClick={() => autoPick(10)}
                  disabled={isDrawing}
                  className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-[11px] font-bold transition-all disabled:opacity-50"
                >
                  Auto 10
                </button>
                <button
                  onClick={clearSelection}
                  disabled={isDrawing}
                  className="px-2.5 py-1 rounded bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 text-[11px] font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                >
                  <RotateCcw className="w-3 h-3" />
                  Limpiar
                </button>
              </div>
            </div>

            {/* Grid 10 cols x 8 rows */}
            <div className="grid grid-cols-10 gap-1.5 sm:gap-2">
              {Array.from({ length: 80 }, (_, i) => i + 1).map((num) => {
                const isSelected = selectedNumbers.includes(num);
                const isDrawn = drawnNumbers.includes(num);
                const isMatch = isSelected && isDrawn;

                let btnClass = 'bg-[#182330] text-slate-300 border-slate-800 hover:border-slate-600';
                if (isMatch) {
                  btnClass =
                    'bg-gradient-to-br from-emerald-500 to-green-600 text-black font-black border-emerald-400 shadow-lg shadow-emerald-500/50 scale-105 animate-pulse';
                } else if (isSelected) {
                  btnClass =
                    'bg-gradient-to-br from-yellow-500 to-amber-600 text-black font-black border-yellow-300 shadow-md shadow-yellow-500/30 scale-105';
                } else if (isDrawn) {
                  btnClass = 'bg-slate-700/80 text-white border-cyan-400/60 font-bold';
                }

                return (
                  <button
                    key={num}
                    onClick={() => toggleNumber(num)}
                    disabled={isDrawing}
                    className={`h-8 sm:h-10 rounded-lg sm:rounded-xl text-xs sm:text-sm font-bold border transition-all flex items-center justify-center relative ${btnClass}`}
                  >
                    {num}
                    {isMatch && (
                      <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-yellow-400 rounded-full border border-black" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sorteo en Vivo Visual Bar */}
          <div className="mt-4 pt-3 border-t border-slate-800">
            <span className="text-[11px] text-slate-400 font-mono block mb-2">
              BOLAS SORTEADAS EN VIVO ({drawnNumbers.length} / 20):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none min-h-[38px]">
              {drawnNumbers.length === 0 ? (
                <span className="text-xs text-slate-500 italic">Presiona &apos;Iniciar Sorteo&apos; para lanzar las 20 bolas</span>
              ) : (
                drawnNumbers.map((n, idx) => {
                  const wasPicked = selectedNumbers.includes(n);
                  return (
                    <span
                      key={idx}
                      className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shadow-md shrink-0 animate-bounce ${
                        wasPicked
                          ? 'bg-emerald-500 text-black ring-2 ring-emerald-300'
                          : 'bg-slate-800 text-slate-200 border border-slate-700'
                      }`}
                    >
                      {n}
                    </span>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Right col: Bet Controls & Payout Table */}
        <div className="bg-[#101720] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Balance Card */}
            <div className="bg-[#0b1017] p-3 rounded-xl border border-slate-800">
              <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">
                Tu Saldo ({isRealMode ? 'Real' : 'Demo'})
              </span>
              <span className="text-lg font-black text-white font-mono">
                {currencySign}
                {currentBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}{' '}
                {currencySymbol}
              </span>
            </div>

            {/* Stake Quick Buttons */}
            <div>
              <label className="text-xs font-bold text-slate-300 block mb-1.5">
                Monto de Apuesta ({currencySymbol})
              </label>
              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[10, 25, 50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setStake(amt)}
                    disabled={isDrawing}
                    className={`py-1.5 rounded-lg text-xs font-bold font-mono transition-all border ${
                      stake === amt
                        ? 'bg-emerald-500 text-black border-emerald-400 font-black'
                        : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                    }`}
                  >
                    {currencySign}
                    {amt}
                  </button>
                ))}
              </div>
              <input
                type="number"
                min="5"
                max="5000"
                value={stake}
                onChange={(e) => setStake(Number(e.target.value))}
                disabled={isDrawing}
                className="w-full bg-[#0b1017] border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            {/* Payout Multiplier Preview for Selected Numbers */}
            <div className="bg-[#0b1017] p-3 rounded-xl border border-slate-800 text-xs space-y-1.5">
              <div className="flex items-center justify-between text-slate-400 font-bold text-[11px] pb-1 border-b border-slate-800">
                <span>Aciertos</span>
                <span>Premio Estimado</span>
              </div>
              {selectedNumbers.length === 0 ? (
                <p className="text-[11px] text-slate-500 italic py-2 text-center">
                  Selecciona números para ver la tabla de pagos
                </p>
              ) : (
                Object.entries(PAYOUT_TABLE[selectedNumbers.length] || {}).map(([hits, mult]) => (
                  <div key={hits} className="flex items-center justify-between font-mono text-[11px]">
                    <span className="text-slate-300">{hits} aciertos</span>
                    <span className="text-yellow-400 font-bold">
                      {mult}x ({currencySign}
                      {(stake * mult).toLocaleString('en-US')})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Action Area */}
          <div className="space-y-3 pt-2">
            {errorMessage && (
              <div className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {lastWin !== null && lastWin > 0 && (
              <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/50 text-emerald-300 text-xs flex items-center justify-between animate-pulse">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-400" />
                  <span className="font-bold">¡FELICIDADES, GANASTE!</span>
                </div>
                <span className="font-black text-sm font-mono text-yellow-300">
                  +{currencySign}
                  {lastWin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {lastWin === 0 && !isDrawing && (
              <div className="p-2 rounded-xl bg-slate-800 text-slate-400 text-xs text-center font-medium">
                Sin premio en esta tirada. ¡Inténtalo de nuevo!
              </div>
            )}

            <button
              onClick={handleStartDraw}
              disabled={isDrawing || selectedNumbers.length === 0}
              className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                isDrawing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : selectedNumbers.length === 0
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 text-black hover:scale-[1.02] shadow-emerald-500/30'
              }`}
            >
              {isDrawing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-yellow-400" />
                  Sorteando Bolas ({drawnNumbers.length}/20)...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  Iniciar Sorteo ({currencySign}
                  {stake} {currencySymbol})
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
