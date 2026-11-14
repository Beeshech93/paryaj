'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, Zap, Trophy, AlertCircle, RotateCcw } from 'lucide-react';

interface DiverGameEngineProps {
  onClose?: () => void;
}

export const DiverGameEngine: React.FC<DiverGameEngineProps> = () => {
  const { isRealMode, realBalance, demoBalance, updateRealBalance, updateDemoBalance, market } = useApp();
  const [gameState, setGameState] = useState<'idle' | 'flying' | 'crashed' | 'cashed_out'>('idle');
  const [multiplier, setMultiplier] = useState<number>(1.0);
  const [stake, setStake] = useState<number>(50);
  const [cashedMultiplier, setCashedMultiplier] = useState<number | null>(null);
  const [winAmount, setWinAmount] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const crashPointRef = useRef<number>(2.5);
  const animationRef = useRef<NodeJS.Timeout | null>(null);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';
  const currentBalance = isRealMode ? realBalance : demoBalance;

  const startFlight = () => {
    if (gameState === 'flying') return;
    setErrorMessage(null);
    setCashedMultiplier(null);
    setWinAmount(null);

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
      setErrorMessage('No se pudo procesar la apuesta');
      return;
    }

    // Random crash point (skewed towards 1.5x - 8x, with occasional 20x+)
    const rand = Math.random();
    let point = 1.2;
    if (rand < 0.4) {
      point = 1.1 + Math.random() * 1.5; // 1.1x - 2.6x
    } else if (rand < 0.75) {
      point = 2.0 + Math.random() * 4.0; // 2.0x - 6.0x
    } else if (rand < 0.95) {
      point = 5.0 + Math.random() * 10.0; // 5.0x - 15.0x
    } else {
      point = 15.0 + Math.random() * 30.0; // Mega fly
    }
    crashPointRef.current = Number(point.toFixed(2));

    setMultiplier(1.0);
    setGameState('flying');

    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsedSec = (Date.now() - startTime) / 1000;
      // Exponential curve: e^(0.18 * t)
      const currentMult = Math.pow(Math.E, 0.16 * elapsedSec);
      const formatted = Number(currentMult.toFixed(2));

      if (formatted >= crashPointRef.current) {
        clearInterval(interval);
        setMultiplier(crashPointRef.current);
        setGameState((prev) => (prev === 'cashed_out' ? 'cashed_out' : 'crashed'));
      } else {
        setMultiplier(formatted);
      }
    }, 50);

    animationRef.current = interval;
  };

  const cashOut = () => {
    if (gameState !== 'flying') return;
    if (animationRef.current) clearInterval(animationRef.current);

    const won = Number((stake * multiplier).toFixed(2));
    if (isRealMode) {
      updateRealBalance(won);
    } else {
      updateDemoBalance(won);
    }

    setCashedMultiplier(multiplier);
    setWinAmount(won);
    setGameState('cashed_out');
  };

  useEffect(() => {
    return () => {
      if (animationRef.current) clearInterval(animationRef.current);
    };
  }, []);

  return (
    <div className="w-full h-full bg-[#0b0f15] text-white p-4 sm:p-6 flex flex-col justify-between font-sans">
      {/* Flight Canvas / Radar Screen */}
      <div className="relative flex-1 bg-gradient-to-br from-[#17202a] via-[#0f171f] to-[#080d12] rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
        {/* Radar grid lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none" />

        {/* Flight path curve (SVG) */}
        {gameState === 'flying' && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40">
            <path
              d="M 50 400 Q 300 350 700 150"
              fill="none"
              stroke="#facc15"
              strokeWidth="4"
              strokeDasharray="6 6"
            />
          </svg>
        )}

        {/* Central Multiplier Indicator */}
        <div className="relative z-20 text-center select-none">
          <div
            className={`text-6xl sm:text-8xl font-black font-mono tracking-tighter ${
              gameState === 'crashed'
                ? 'text-rose-500 animate-pulse'
                : gameState === 'cashed_out'
                ? 'text-emerald-400'
                : 'text-amber-400'
            }`}
          >
            {multiplier.toFixed(2)}x
          </div>
          <span className="text-xs uppercase tracking-widest text-slate-400 font-mono mt-1 block">
            {gameState === 'idle'
              ? 'ESPERANDO DESPEGUE'
              : gameState === 'flying'
              ? 'AVIÓN EN VUELO ASCENDENTE...'
              : gameState === 'cashed_out'
              ? '¡RETIRO EXITOSO!'
              : 'EL AVIÓN VOLÓ LEJOS (CRASHED)'}
          </span>
        </div>

        {/* Flying Jet Graphic with animation */}
        <div
          className={`absolute text-7xl select-none transition-all duration-100 ${
            gameState === 'flying'
              ? 'bottom-28 right-24 animate-pulse transform -rotate-12 scale-125'
              : gameState === 'crashed'
              ? 'bottom-40 right-10 opacity-20 transform rotate-45'
              : 'bottom-16 left-20 opacity-60'
          }`}
        >
          🛩️
        </div>

        {/* Victory Celebration */}
        {gameState === 'cashed_out' && winAmount && (
          <div className="absolute top-6 inset-x-6 mx-auto max-w-md bg-emerald-500/20 border border-emerald-500/50 p-3 rounded-xl text-center z-30 animate-bounce">
            <span className="text-xs font-bold text-emerald-300 block">¡RETIRO A TIEMPO!</span>
            <span className="text-xl font-black font-mono text-yellow-300">
              +{currencySign}
              {winAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })} (a {cashedMultiplier}x)
            </span>
          </div>
        )}
      </div>

      {/* Controls Bar */}
      <div className="mt-4 bg-[#121922] border border-slate-800 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Stake selection */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="bg-[#0b1017] px-4 py-2 rounded-xl border border-slate-800">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Saldo</span>
            <span className="text-sm font-black font-mono text-emerald-400">
              {currencySign}
              {currentBalance.toFixed(2)}
            </span>
          </div>
          <div className="flex-1 sm:w-44">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Apuesta</span>
            <input
              type="number"
              min="10"
              max="5000"
              value={stake}
              onChange={(e) => setStake(Number(e.target.value))}
              disabled={gameState === 'flying'}
              className="w-full bg-[#0b1017] border border-slate-700 rounded-lg px-2.5 py-1 text-sm font-mono font-bold text-white focus:outline-none"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className="w-full sm:w-64">
          {gameState === 'flying' ? (
            <button
              onClick={cashOut}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-500 via-green-400 to-emerald-500 text-black font-black text-base uppercase tracking-wider shadow-lg shadow-emerald-500/40 hover:scale-[1.02] active:scale-95 transition-all flex flex-col items-center justify-center leading-tight"
            >
              <span>RETIRAR (CASHOUT)</span>
              <span className="text-xs font-mono font-bold">
                +{currencySign}
                {(stake * multiplier).toFixed(2)}
              </span>
            </button>
          ) : (
            <button
              onClick={startFlight}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black font-black text-base uppercase tracking-wider shadow-lg shadow-yellow-500/40 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
            >
              <Play className="w-5 h-5 fill-black" />
              DESPEGAR ({currencySign}
              {stake})
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

