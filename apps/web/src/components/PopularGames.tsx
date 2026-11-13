'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, Heart, Star, Sparkles, X, Maximize2, ShieldCheck, Flame } from 'lucide-react';

interface GameItem {
  id: string;
  title: string;
  symbol: string;
  category: string;
  provider: string;
  rtp: string;
  isHot?: boolean;
  isNew?: boolean;
  gradient: string;
  emoji: string;
  isLiveCasino?: boolean;
}

const realGames: GameItem[] = [
  {
    id: 'prag-1',
    title: 'Gates of Olympus 1000',
    symbol: 'vs20olympgate',
    category: 'slots',
    provider: 'Pragmatic Play',
    rtp: '96.50%',
    isHot: true,
    gradient: 'from-amber-600 via-yellow-600 to-amber-900',
    emoji: '⚡',
  },
  {
    id: 'prag-2',
    title: 'Sweet Bonanza 1000',
    symbol: 'vs20sweetbonz',
    category: 'slots',
    provider: 'Pragmatic Play',
    rtp: '96.53%',
    isHot: true,
    gradient: 'from-pink-600 via-rose-500 to-purple-900',
    emoji: '🍬',
  },
  {
    id: 'prag-3',
    title: 'Sugar Rush 1000',
    symbol: 'vs20sugarrush',
    category: 'slots',
    provider: 'Pragmatic Play',
    rtp: '96.53%',
    isNew: true,
    gradient: 'from-fuchsia-600 via-pink-600 to-indigo-900',
    emoji: '🍭',
  },
  {
    id: 'prag-4',
    title: 'Big Bass Splash',
    symbol: 'vs10bbbonanza',
    category: 'slots',
    provider: 'Pragmatic Play',
    rtp: '96.71%',
    isHot: true,
    gradient: 'from-cyan-700 via-blue-800 to-slate-900',
    emoji: '🎣',
  },
  {
    id: 'prag-5',
    title: 'The Dog House Megaways',
    symbol: 'vswaysdoghouse',
    category: 'slots',
    provider: 'Pragmatic Play',
    rtp: '96.55%',
    gradient: 'from-blue-600 via-sky-700 to-indigo-950',
    emoji: '🐶',
  },
  {
    id: 'prag-6',
    title: 'Wolf Gold',
    symbol: 'vs25wolfgold',
    category: 'jackpots',
    provider: 'Pragmatic Play',
    rtp: '96.01%',
    gradient: 'from-amber-700 via-orange-800 to-stone-950',
    emoji: '🐺',
  },
  {
    id: 'evo-1',
    title: 'Ruleta en Vivo México',
    symbol: 'evo_roulette_mx',
    category: 'roulette',
    provider: 'Evolution Gaming',
    rtp: '97.30%',
    isHot: true,
    isLiveCasino: true,
    gradient: 'from-emerald-700 via-teal-800 to-slate-900',
    emoji: '🎡',
  },
  {
    id: 'evo-2',
    title: 'Speed Baccarat (Français)',
    symbol: 'evo_baccarat_fr',
    category: 'baccarat',
    provider: 'Evolution Gaming',
    rtp: '98.94%',
    isNew: true,
    isLiveCasino: true,
    gradient: 'from-red-800 via-rose-900 to-slate-950',
    emoji: '🎴',
  },
];

interface PopularGamesProps {
  selectedCategory: string;
}

export const PopularGames: React.FC<PopularGamesProps> = ({ selectedCategory }) => {
  const { t, locale, market, isRealMode, realBalance, demoBalance } = useApp();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeGame, setActiveGame] = useState<GameItem | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredGames = realGames.filter((g) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return g.isHot;
    return g.category === selectedCategory;
  });

  const getGameUrl = (game: GameItem) => {
    if (game.isLiveCasino) {
      // Live streaming preview feed
      return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=${locale}&cur=${currencySymbol}`;
    }
    // Official Pragmatic Play HTML5 engine
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=${game.symbol}&lang=${locale}&cur=${currencySymbol}`;
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
          <div className="flex items-center gap-2 text-xs text-slate-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>API Real: Pragmatic Play & Evolution Live Conectados</span>
          </div>
        </div>

        {/* Games Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredGames.map((game) => (
            <div
              key={game.id}
              className="group relative rounded-2xl bg-brand-card border border-brand-navyLight hover:border-brand-gold/60 overflow-hidden shadow-lg hover:shadow-brand-gold/20 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Game Poster / Art Banner */}
              <div
                className={`relative h-44 sm:h-52 w-full bg-gradient-to-br ${game.gradient} p-4 flex flex-col justify-between overflow-hidden`}
              >
                {/* Badges */}
                <div className="flex items-center justify-between z-10">
                  <div className="flex items-center gap-1.5">
                    {game.isHot && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-rose-500 text-white flex items-center gap-1 shadow-md">
                        <Flame className="w-3 h-3 fill-white" />
                        HOT
                      </span>
                    )}
                    {game.isNew && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-500 text-black shadow-md">
                        NUEVO
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => toggleFavorite(game.id, e)}
                    className="p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                  >
                    <Heart
                      className={`w-3.5 h-3.5 ${
                        favorites[game.id] ? 'fill-rose-500 text-rose-500' : 'text-white'
                      }`}
                    />
                  </button>
                </div>

                {/* Big Center Graphic / Symbol */}
                <div className="flex flex-col items-center justify-center my-auto transform group-hover:scale-110 transition-transform duration-300 select-none">
                  <span className="text-6xl drop-shadow-2xl">{game.emoji}</span>
                  <span className="mt-2 text-xs font-black text-white/90 tracking-wider uppercase drop-shadow">
                    {game.provider}
                  </span>
                </div>

                {/* RTP & Provider Pill */}
                <div className="flex items-center justify-between text-[11px] font-mono font-bold text-white/80 z-10">
                  <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm">RTP {game.rtp}</span>
                  <span className="bg-black/40 px-2 py-0.5 rounded backdrop-blur-sm uppercase">{game.category}</span>
                </div>

                {/* Hover Overlay with Real Play Trigger */}
                <div className="absolute inset-0 bg-black/75 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-3 p-4 z-20 backdrop-blur-xs">
                  <button
                    onClick={() => setActiveGame(game)}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    <Play className="w-4 h-4 fill-black" />
                    Jugar Ahora
                  </button>
                  <span className="text-[10px] text-slate-300 font-mono text-center">
                    {game.isLiveCasino ? 'Mesa en Vivo con Crupier' : 'Motor Oficial HTML5'}
                  </span>
                </div>
              </div>

              {/* Game Metadata info footer */}
              <div className="p-3.5 bg-brand-card border-t border-brand-navyLight flex items-center justify-between">
                <div className="truncate pr-2">
                  <h3 className="font-bold text-xs sm:text-sm text-white truncate">{game.title}</h3>
                  <p className="text-[11px] text-slate-400">{game.provider}</p>
                </div>
                <div className="flex items-center text-yellow-400 text-xs">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 mr-1" />
                  <span className="text-xs font-mono font-bold text-slate-200">4.9</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Real Game Session Iframe Modal */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div
            className={`w-full ${
              isFullscreen ? 'h-full max-w-none' : 'max-w-5xl h-[85vh]'
            } rounded-2xl bg-brand-navy border border-brand-gold/40 shadow-2xl overflow-hidden flex flex-col text-white transition-all`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-brand-navyLight bg-brand-dark">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{activeGame.emoji}</span>
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    {activeGame.title}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      Conexión Real {activeGame.provider}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modo: {isRealMode ? 'Producción (Saldo Real)' : 'Simulación Demo'} • Divisa: {currencySymbol}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg hover:bg-brand-navyLight text-slate-400 hover:text-white transition-colors"
                  title="Pantalla Completa"
                >
                  <Maximize2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    setActiveGame(null);
                    setIsFullscreen(false);
                  }}
                  className="p-1.5 rounded-lg hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors"
                  title="Cerrar Juego"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Real Game Frame */}
            <div className="flex-1 w-full bg-black relative">
              <iframe
                src={getGameUrl(activeGame)}
                title={activeGame.title}
                className="w-full h-full border-0"
                allow="autoplay; fullscreen; encrypted-media"
                loading="eager"
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
