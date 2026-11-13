'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, Heart, Star, Sparkles, X, RotateCcw } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  category: string;
  provider: string;
  rtp: string;
  isHot?: boolean;
  isNew?: boolean;
  gradient: string;
  emoji: string;
}

const mockGames: GameItem[] = [
  {
    id: 'game-1',
    title: 'Aztec Sunburst 1000',
    category: 'slots',
    provider: 'NEW BRAND Studios',
    rtp: '96.8%',
    isHot: true,
    gradient: 'from-amber-600 via-yellow-600 to-amber-900',
    emoji: '☀️',
  },
  {
    id: 'game-2',
    title: 'Aviator Horizon Crash',
    category: 'crash',
    provider: 'Flight Crash Adapter',
    rtp: '97.0%',
    isHot: true,
    gradient: 'from-rose-600 via-red-600 to-amber-800',
    emoji: '✈️',
  },
  {
    id: 'game-3',
    title: 'Crown Roulette VIP',
    category: 'roulette',
    provider: 'Live Table Adapter',
    rtp: '97.3%',
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    emoji: '🎡',
  },
  {
    id: 'game-4',
    title: 'Royal Platinum Blackjack',
    category: 'blackjack',
    provider: 'Cards Adapter Demo',
    rtp: '99.2%',
    gradient: 'from-blue-700 via-indigo-900 to-slate-950',
    emoji: '♠️',
  },
  {
    id: 'game-5',
    title: 'Sugar Bonanza Sweet',
    category: 'slots',
    provider: 'Pragmatic Demo Adapter',
    rtp: '96.5%',
    isNew: true,
    gradient: 'from-pink-600 via-purple-600 to-indigo-900',
    emoji: '🍬',
  },
  {
    id: 'game-6',
    title: 'Mega Maya Jackpot',
    category: 'jackpots',
    provider: 'NEW BRAND Studios',
    rtp: '95.9%',
    isHot: true,
    gradient: 'from-yellow-600 via-amber-700 to-stone-900',
    emoji: '🪙',
  },
  {
    id: 'game-7',
    title: 'Speed Crash 500x',
    category: 'crash',
    provider: 'Instant Engine',
    rtp: '96.9%',
    gradient: 'from-cyan-600 via-blue-700 to-slate-900',
    emoji: '🚀',
  },
  {
    id: 'game-8',
    title: 'Lightning Vegas Roulette',
    category: 'roulette',
    provider: 'Evolution Demo Adapter',
    rtp: '97.1%',
    isNew: true,
    gradient: 'from-amber-500 via-orange-600 to-red-900',
    emoji: '⚡',
  },
];

interface PopularGamesProps {
  selectedCategory: string;
}

export const PopularGames: React.FC<PopularGamesProps> = ({ selectedCategory }) => {
  const { t, demoBalance, updateDemoBalance } = useApp();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeDemoGame, setActiveDemoGame] = useState<GameItem | null>(null);
  const [spinMultiplier, setSpinMultiplier] = useState<number | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredGames = mockGames.filter((g) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return g.isHot;
    return g.category === selectedCategory;
  });

  const handleSimulatedPlay = (game: GameItem) => {
    setActiveDemoGame(game);
    setSpinMultiplier(null);
  };

  const executeDemoSpin = () => {
    if (isSpinning) return;
    const betCost = 50.0;
    if (demoBalance < betCost) {
      alert('Saldo demo insuficiente. Haz clic en el icono de recarga en la barra superior.');
      return;
    }

    setIsSpinning(true);
    updateDemoBalance(-betCost);

    setTimeout(() => {
      // Simulate provably fair outcome
      const outcomes = [0, 0.5, 1.2, 2.5, 5.0, 10.0, 25.0];
      const selected = outcomes[Math.floor(Math.random() * outcomes.length)];
      setSpinMultiplier(selected);

      if (selected > 0) {
        const win = betCost * selected;
        updateDemoBalance(win);
      }
      setIsSpinning(false);
    }, 1000);
  };

  return (
    <section id="casino" className="py-12 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold uppercase tracking-wider mb-2">
              <Sparkles className="w-4 h-4" />
              <span>{t.casino.subtitle}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{t.casino.title}</h2>
          </div>
          <div className="text-xs text-slate-400 font-mono">
            {filteredGames.length} juegos en modo demo activo
          </div>
        </div>

        {/* Games Grid (Responsive: 2 cols on mobile, 3 on tablet, 4 on desktop) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-2xl bg-brand-card border border-brand-navyLight hover:border-brand-gold/50 overflow-hidden shadow-lg hover:shadow-brand-gold/10 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Game Poster / Art Banner */}
              <div
                className={`relative h-40 sm:h-48 w-full bg-gradient-to-br ${game.gradient} p-4 flex flex-col justify-between overflow-hidden`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    {game.isHot && (
                      <span className="px-2 py-0.5 rounded-md bg-red-600/90 text-white text-[10px] font-black uppercase tracking-wider shadow">
                        HOT
                      </span>
                    )}
                    {game.isNew && (
                      <span className="px-2 py-0.5 rounded-md bg-brand-positive/90 text-black text-[10px] font-black uppercase tracking-wider shadow">
                        NEW
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white backdrop-blur-sm transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        favorites[game.id] ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Big Center Emoji Icon */}
                <div className="text-5xl sm:text-6xl text-center my-auto transform group-hover:scale-110 transition-transform duration-300">
                  {game.emoji}
                </div>

                {/* Provider tag at bottom */}
                <div className="z-10 flex items-center justify-between text-[11px] text-white/80 font-medium">
                  <span className="truncate">{game.provider}</span>
                  <span className="font-mono text-[10px] bg-black/40 px-1.5 py-0.5 rounded text-brand-gold">
                    RTP {game.rtp}
                  </span>
                </div>

                {/* Hover Play Button Overlay */}
                <div className="absolute inset-0 bg-black/60 backdrop-blur-xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-4">
                  <button
                    onClick={() => handleSimulatedPlay(game)}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-400 text-black font-extrabold text-xs sm:text-sm shadow-xl flex items-center gap-1.5 hover:scale-105 transition-transform"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    <span>{t.common.playDemo}</span>
                  </button>
                </div>
              </div>

              {/* Game Metadata info footer */}
              <div className="p-3 bg-brand-card border-t border-brand-navyLight flex items-center justify-between">
                <div className="truncate pr-2">
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate">{game.title}</h3>
                  <p className="text-[10px] text-slate-400 capitalize">{game.category}</p>
                </div>
                <div className="flex items-center text-yellow-400 text-xs">
                  <Star className="w-3 h-3 fill-yellow-400 mr-0.5" />
                  <span className="text-[11px] font-mono text-slate-300">4.9</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Simulated Game Modal Demo */}
      {activeDemoGame && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg rounded-2xl bg-brand-navy border border-brand-gold/40 shadow-2xl overflow-hidden text-white">
            <div className="flex items-center justify-between p-4 border-b border-brand-navyLight bg-brand-dark">
              <div className="flex items-center gap-2">
                <span className="text-xl">{activeDemoGame.emoji}</span>
                <div>
                  <h3 className="font-bold text-sm text-white">{activeDemoGame.title}</h3>
                  <span className="text-[10px] text-brand-positive">Adaptador Simulado Certificado</span>
                </div>
              </div>
              <button
                onClick={() => setActiveDemoGame(null)}
                className="p-1 rounded-lg hover:bg-brand-navyLight text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 text-center space-y-6">
              <div className="p-6 rounded-xl bg-brand-dark/90 border border-slate-800 space-y-4">
                <div className="text-6xl animate-bounce">{activeDemoGame.emoji}</div>
                <p className="text-xs text-slate-400">
                  Motor de juego de prueba con contabilidad inmutable y generación pseudo-aleatoria (RNG).
                </p>

                {spinMultiplier !== null && (
                  <div
                    className={`p-3 rounded-lg text-sm font-bold font-mono ${
                      spinMultiplier > 0
                        ? 'bg-emerald-950 text-brand-positive border border-emerald-500/50'
                        : 'bg-red-950 text-red-400 border border-red-500/50'
                    }`}
                  >
                    {spinMultiplier > 0
                      ? `¡Ganancia Demo! Multiplicador ${spinMultiplier}x (+$${(50 * spinMultiplier).toFixed(2)})`
                      : 'Tirada sin premio. Inténtalo de nuevo.'}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 px-2">
                <span>Costo por tirada demo: <strong>$50.00</strong></span>
                <span>Tu saldo demo: <strong className="text-brand-positive">${demoBalance.toFixed(2)}</strong></span>
              </div>

              <button
                onClick={executeDemoSpin}
                disabled={isSpinning}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-400 text-black font-black text-base shadow-xl hover:brightness-110 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
              >
                <RotateCcw className={`w-5 h-5 ${isSpinning ? 'animate-spin' : ''}`} />
                <span>{isSpinning ? 'Girando cilindros demo...' : 'Girar Tirada Demo ($50)'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

