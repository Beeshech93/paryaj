'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, Sparkles, Trophy, Zap, AlertCircle, RefreshCw } from 'lucide-react';

interface LuckyGameEngineProps {
  gameTitle: string;
  gameSymbol: string;
  onClose?: () => void;
}

interface LuckyBall {
  number: number;
  color: 'yellow' | 'black';
}

interface BetOption {
  id: string;
  label: string;
  odds: number;
  category: string;
}

export const LuckyGameEngine: React.FC<LuckyGameEngineProps> = ({ gameTitle, gameSymbol }) => {
  const { isRealMode, realBalance, demoBalance, updateRealBalance, updateDemoBalance, market } = useApp();
  const [selectedBet, setSelectedBet] = useState<string>('yellow_more');
  const [selectedLuckyNumber, setSelectedLuckyNumber] = useState<number | null>(null);
  const [drawnBalls, setDrawnBalls] = useState<LuckyBall[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [stake, setStake] = useState<number>(50);
  const [lastWin, setLastWin] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const currentBalance = isRealMode ? realBalance : demoBalance;

  const betOptions: BetOption[] = [
    { id: 'yellow_more', label: '🟡 Más Bolas Amarillas', odds: 1.95, category: 'Colores' },
    { id: 'black_more', label: '⚫ Más Bolas Negras', odds: 1.95, category: 'Colores' },
    { id: 'sum_over', label: '📈 Suma Total > 150.5', odds: 1.90, category: 'Totales' },
    { id: 'sum_under', label: '📉 Suma Total < 150.5', odds: 1.90, category: 'Totales' },
    { id: 'first_even', label: '🔢 Primera Bola Par', odds: 1.90, category: 'Especial' },
    { id: 'first_odd', label: '🔢 Primera Bola Impar', odds: 1.90, category: 'Especial' },
    { id: 'exact_number', label: '🎯 Número de la Suerte (1-42)', odds: 5.75, category: 'Exacto' },
  ];

  const handleStartDraw = () => {
    if (isDrawing) return;
    setErrorMessage(null);
    setLastWin(null);

    if (selectedBet === 'exact_number' && !selectedLuckyNumber) {
      setErrorMessage('Selecciona tu número de la suerte (1 al 42)');
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
    setDrawnBalls([]);

    // 42 balls pool (21 Yellow, 21 Black)
    const pool: LuckyBall[] = [];
    for (let i = 1; i <= 42; i++) {
      pool.push({
        number: i,
        color: i % 2 === 1 ? 'yellow' : 'black',
      });
    }

    // Pick 7 unique balls
    const finalDraw: LuckyBall[] = [];
    while (finalDraw.length < 7 && pool.length > 0) {
      const idx = Math.floor(Math.random() * pool.length);
      finalDraw.push(pool.splice(idx, 1)[0]);
    }

    let current = 0;
    const interval = setInterval(() => {
      current++;
      setDrawnBalls(finalDraw.slice(0, current));

      if (current >= 7) {
        clearInterval(interval);
        setIsDrawing(false);

        // Evaluate victory
        const yellowCount = finalDraw.filter((b) => b.color === 'yellow').length;
        const blackCount = finalDraw.filter((b) => b.color === 'black').length;
        const totalSum = finalDraw.reduce((acc, b) => acc + b.number, 0);
        const firstBall = finalDraw[0].number;

        let won = false;
        let activeOdds = 1.0;

        const currentOpt = betOptions.find((b) => b.id === selectedBet);
        if (currentOpt) {
          activeOdds = currentOpt.odds;
        }

        switch (selectedBet) {
          case 'yellow_more':
            won = yellowCount > blackCount;
            break;
          case 'black_more':
            won = blackCount > yellowCount;
            break;
          case 'sum_over':
            won = totalSum > 150.5;
            break;
          case 'sum_under':
            won = totalSum < 150.5;
            break;
          case 'first_even':
            won = firstBall % 2 === 0;
            break;
          case 'first_odd':
            won = firstBall % 2 !== 0;
            break;
          case 'exact_number':
            won = selectedLuckyNumber !== null && finalDraw.some((b) => b.number === selectedLuckyNumber);
            break;
        }

        if (won) {
          const payout = stake * activeOdds;
          if (isRealMode) {
            updateRealBalance(payout);
          } else {
            updateDemoBalance(payout);
          }
          setLastWin(payout);
        } else {
          setLastWin(0);
        }
      }
    }, 280);
  };

  const totalSumDrawn = drawnBalls.reduce((acc, b) => acc + b.number, 0);
  const yellowDrawn = drawnBalls.filter((b) => b.color === 'yellow').length;
  const blackDrawn = drawnBalls.filter((b) => b.color === 'black').length;

  return (
    <div className="w-full h-full bg-[#0d1219] text-slate-100 p-4 sm:p-6 overflow-y-auto font-sans flex flex-col justify-between">
      {/* Top Bar */}
      <div className="bg-[#141c26] border border-slate-800 rounded-xl p-3 sm:p-4 mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500 to-amber-600 flex items-center justify-center font-black text-black text-xl shadow-lg shadow-rose-500/20">
            🍀
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-white flex items-center gap-2">
              {gameTitle}
              <span className="text-[10px] bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 rounded-full font-mono">
                Sorteo en Directo
              </span>
            </h2>
            <p className="text-xs text-slate-400">
              Sorteo de 7 bolas de 42 • Mercados de Colores, Sumas y Números de la Suerte
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs font-mono">
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 inline-block" />
            <span className="text-slate-400">Amarillas:</span>
            <span className="text-yellow-400 font-bold">{yellowDrawn}</span>
          </div>
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-400 inline-block" />
            <span className="text-slate-400">Negras:</span>
            <span className="text-white font-bold">{blackDrawn}</span>
          </div>
          <div className="bg-[#0b1017] px-3 py-1.5 rounded-lg border border-slate-800">
            <span className="text-slate-400">Suma:</span>
            <span className="text-emerald-400 font-bold ml-1">{totalSumDrawn}</span>
          </div>
        </div>
      </div>

      {/* Live Ball Machine Display */}
      <div className="bg-[#121924] border border-slate-800 rounded-2xl p-6 mb-6 flex flex-col items-center justify-center relative overflow-hidden shadow-2xl min-h-[180px]">
        <div className="absolute top-2 left-3 text-[10px] uppercase font-mono font-bold tracking-widest text-slate-500">
          CÁMARA DEL SORTEO EN VIVO (7 BOLAS)
        </div>

        {/* 7 Tube Slots */}
        <div className="flex items-center justify-center gap-2 sm:gap-4 my-4 flex-wrap">
          {Array.from({ length: 7 }).map((_, idx) => {
            const ball = drawnBalls[idx];
            return (
              <div
                key={idx}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full flex items-center justify-center font-black text-base sm:text-xl border-2 transition-all duration-300 shadow-xl ${
                    ball
                      ? ball.color === 'yellow'
                        ? 'bg-gradient-to-br from-yellow-300 via-amber-400 to-yellow-500 text-black border-yellow-200 ring-4 ring-yellow-400/30 scale-110'
                        : 'bg-gradient-to-br from-slate-900 via-zinc-800 to-black text-white border-zinc-600 ring-4 ring-slate-700/40 scale-110'
                      : 'bg-[#182330] border-slate-700 text-slate-600 border-dashed'
                  }`}
                >
                  {ball ? ball.number : idx + 1}
                </div>
                <span className="text-[10px] font-mono text-slate-500">Bola #{idx + 1}</span>
              </div>
            );
          })}
        </div>

        {isDrawing && (
          <div className="flex items-center gap-2 text-xs font-mono text-amber-400 animate-pulse mt-1">
            <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            Lanzando esferas con soplado de aire de alta precisión...
          </div>
        )}
      </div>

      {/* Betting Options & Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Market Choices */}
        <div className="lg:col-span-2 bg-[#121924] border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
            Selecciona tu Mercado de Apuesta
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {betOptions.map((opt) => {
              const isSelected = selectedBet === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    setSelectedBet(opt.id);
                    setErrorMessage(null);
                  }}
                  disabled={isDrawing}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-yellow-400 ring-1 ring-yellow-400 text-white shadow-lg'
                      : 'bg-[#182330] hover:bg-[#1f2d3d] border-slate-800 text-slate-300'
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase font-bold block">{opt.category}</span>
                    <span className="text-xs font-bold text-white">{opt.label}</span>
                  </div>
                  <span className="text-sm font-mono font-black text-amber-400 bg-black/40 px-2 py-1 rounded-lg border border-slate-700">
                    {opt.odds.toFixed(2)}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Exact Number Selector if active */}
          {selectedBet === 'exact_number' && (
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs text-yellow-400 font-bold block mb-2">
                Elige tu número de la suerte (1 - 42):
              </span>
              <div className="grid grid-cols-7 sm:grid-cols-14 gap-1.5">
                {Array.from({ length: 42 }, (_, i) => i + 1).map((n) => {
                  const isPicked = selectedLuckyNumber === n;
                  const isYellow = n % 2 === 1;
                  return (
                    <button
                      key={n}
                      onClick={() => setSelectedLuckyNumber(n)}
                      disabled={isDrawing}
                      className={`h-7 rounded-lg text-xs font-bold transition-all border ${
                        isPicked
                          ? 'bg-emerald-500 text-black border-emerald-300 font-black scale-110 shadow-lg'
                          : isYellow
                          ? 'bg-yellow-500/10 text-yellow-300 border-yellow-500/30 hover:bg-yellow-500/20'
                          : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
                      }`}
                    >
                      {n}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Bet Placement & Stake */}
        <div className="bg-[#121924] border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-col justify-between space-y-4">
          <div className="space-y-4">
            {/* Balance */}
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

            {/* Stake Controls */}
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
                        ? 'bg-amber-500 text-black border-yellow-300 font-black'
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
                className="w-full bg-[#0b1017] border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Payout Preview */}
            <div className="bg-[#0b1017] p-3 rounded-xl border border-slate-800 text-xs flex items-center justify-between">
              <span className="text-slate-400">Ganancia Potencial:</span>
              <span className="text-emerald-400 font-black font-mono text-sm">
                {currencySign}
                {(stake * (betOptions.find((b) => b.id === selectedBet)?.odds || 1)).toLocaleString('en-US', {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
          </div>

          {/* Action button */}
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
                  <span className="font-bold">¡ACIERTO GANADOR!</span>
                </div>
                <span className="font-black text-sm font-mono text-yellow-300">
                  +{currencySign}
                  {lastWin.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </div>
            )}

            {lastWin === 0 && !isDrawing && (
              <div className="p-2 rounded-xl bg-slate-800 text-slate-400 text-xs text-center font-medium">
                No hubo acierto esta vez. ¡Prueba otra combinación!
              </div>
            )}

            <button
              onClick={handleStartDraw}
              disabled={isDrawing}
              className={`w-full py-3.5 rounded-xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-xl ${
                isDrawing
                  ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black hover:scale-[1.02] shadow-yellow-500/30'
              }`}
            >
              {isDrawing ? (
                <>
                  <Zap className="w-4 h-4 animate-spin text-black" />
                  Extrayendo Bolas ({drawnBalls.length}/7)...
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 fill-black" />
                  Apostar y Sortear ({currencySign}
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

