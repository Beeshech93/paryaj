'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Play, Heart, Star, Sparkles, X, Maximize2, Flame, ChevronRight } from 'lucide-react';
import { GamePosterCard, GamePosterData } from '@/components/games/GamePosterCard';
import { KenoGameEngine } from '@/components/games/KenoGameEngine';
import { LuckyGameEngine } from '@/components/games/LuckyGameEngine';
import { DiverGameEngine } from '@/components/games/DiverGameEngine';

const ALL_GAMES: GamePosterData[] = [
  // --- ROW 1: JUEGOS POPULARES (Top Row in User Screenshot) ---
  {
    id: 'chicken-royal',
    title: 'CHICKEN ROYAL',
    subLabel: 'INOUT',
    theme: 'chickenroyal',
    category: 'slots',
    gradient: 'from-blue-600 via-sky-700 to-indigo-950',
    section: 'featured',
  },
  {
    id: 'triple-x80',
    title: 'TRIPLE',
    subLabel: 'INOUT',
    theme: 'triple',
    category: 'slots',
    gradient: 'from-lime-600 via-emerald-700 to-green-950',
    section: 'featured',
  },
  {
    id: 'hot-cherry',
    title: 'Hot Cherry',
    subLabel: '',
    theme: 'hotcherry',
    category: 'slots',
    gradient: 'from-red-700 via-rose-800 to-black',
    section: 'featured',
  },
  {
    id: '7bet',
    title: '7BET',
    subLabel: 'TVBET',
    theme: '7bet',
    category: 'lucky',
    gradient: 'from-pink-700 via-fuchsia-800 to-purple-950',
    section: 'featured',
  },
  {
    id: 'just-jewels',
    title: 'Just Jewels deluxe',
    subLabel: '',
    theme: 'justjewels',
    category: 'slots',
    gradient: 'from-rose-900 via-red-950 to-black',
    section: 'featured',
  },

  // --- ROW 2: PARYAJPAM (Middle Row in User Screenshot) ---
  {
    id: 'paryaj-keno',
    title: 'KENO',
    subLabel: 'Paryajpam',
    theme: 'keno',
    category: 'keno',
    gradient: 'from-[#0284c7] via-[#0369a1] to-[#075985]',
    section: 'paryajpam',
  },
  {
    id: 'paryaj-roulette',
    title: 'ROULETTE',
    subLabel: 'Paryajpam',
    theme: 'roulette',
    category: 'roulette',
    gradient: 'from-[#059669] via-[#047857] to-[#064e3b]',
    section: 'paryajpam',
  },
  {
    id: 'paryaj-lucky6',
    title: 'LUCKY6',
    subLabel: 'Paryajpam',
    theme: 'lucky6',
    category: 'lucky',
    gradient: 'from-[#be123c] via-[#9f1239] to-[#881337]',
    section: 'paryajpam',
  },
  {
    id: 'paryaj-horseracing',
    title: 'HORSE RACING',
    subLabel: 'Paryajpam',
    theme: 'horseracing',
    category: 'virtuals',
    gradient: 'from-[#e11d48] via-[#be123c] to-[#991b1b]',
    section: 'paryajpam',
  },
  {
    id: 'paryaj-american-roulette',
    title: 'AMERICAN ROULETTE',
    subLabel: 'Paryajpam',
    theme: 'american_roulette',
    category: 'roulette',
    gradient: 'from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]',
    section: 'paryajpam',
  },

  // --- ROW 3: IOGAMES / INOUT GAMES (Bottom Row in User Screenshot) ---
  {
    id: 'inout-diver',
    title: 'DIVER',
    subLabel: 'INOUT',
    theme: 'diver',
    category: 'crash',
    gradient: 'from-[#facc15] via-[#eab308] to-[#ca8a04]',
    section: 'iogames',
  },
  {
    id: 'inout-sugardaddy',
    title: 'SUGAR DADDY',
    subLabel: 'INOUT',
    theme: 'sugardaddy',
    category: 'slots',
    gradient: 'from-[#ec4899] via-[#db2777] to-[#9d174d]',
    section: 'iogames',
  },
  {
    id: 'inout-chickenroad',
    title: 'CHICKEN ROAD 2',
    subLabel: 'INOUT',
    theme: 'chickenroad',
    category: 'crash',
    gradient: 'from-[#f97316] via-[#ea580c] to-[#c2410c]',
    section: 'iogames',
  },
  {
    id: 'inout-penalty',
    title: 'PENALTY UNLIMITED',
    subLabel: 'INOUT',
    theme: 'penalty',
    category: 'sports',
    gradient: 'from-[#15803d] via-[#166534] to-[#14532d]',
    section: 'iogames',
  },
  {
    id: 'inout-chickencoin',
    title: 'CHICKEN COIN',
    subLabel: 'INOUT',
    theme: 'chickencoin',
    category: 'slots',
    gradient: 'from-[#d97706] via-[#b45309] to-[#78350f]',
    section: 'iogames',
  },
];

interface PopularGamesProps {
  selectedCategory: string;
}

export const PopularGames: React.FC<PopularGamesProps> = ({ selectedCategory }) => {
  const { t, locale, market, isRealMode } = useApp();
  const [favorites, setFavorites] = useState<Record<string, boolean>>({});
  const [activeGame, setActiveGame] = useState<GamePosterData | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  const toggleFavorite = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setFavorites((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const featuredGames = ALL_GAMES.filter((g) => g.section === 'featured');
  const paryajpamGames = ALL_GAMES.filter((g) => g.section === 'paryajpam');
  const iogames = ALL_GAMES.filter((g) => g.section === 'iogames');

  const filteredGames = ALL_GAMES.filter((g) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'popular') return g.section === 'featured' || g.section === 'paryajpam';
    if (selectedCategory === 'keno') return g.category === 'keno';
    if (selectedCategory === 'lucky') return g.category === 'lucky';
    if (selectedCategory === 'slots') return g.category === 'slots';
    if (selectedCategory === 'crash') return g.category === 'crash';
    if (selectedCategory === 'roulette') return g.category === 'roulette';
    return g.category === selectedCategory;
  });

  const getGameUrl = (game: GamePosterData) => {
    // Fallback official engine
    return `https://demogamesfree.pragmaticplay.net/gs2c/openGame.do?gameSymbol=vs20olympgate&lang=${locale}&cur=${currencySymbol}`;
  };

  return (
    <section id="casino" className="py-10 bg-[#0b1015] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        {/* If 'all' is selected, render the 3 rows with exact headers matching the user screenshot */}
        {selectedCategory === 'all' ? (
          <>
            {/* ROW 1: TOP POPULARES */}
            <div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {featuredGames.map((game) => (
                  <GamePosterCard
                    key={game.id}
                    game={game}
                    onPlay={(g) => setActiveGame(g)}
                    isFavorite={favorites[game.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>

            {/* ROW 2: PARYAJPAM SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Paryajpam</span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                    Lotería &amp; Virtuales
                  </span>
                </h3>
                <span className="text-xs font-bold text-slate-400 hover:text-emerald-400 cursor-pointer flex items-center gap-1 transition-colors">
                  Ver todos <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {paryajpamGames.map((game) => (
                  <GamePosterCard
                    key={game.id}
                    game={game}
                    onPlay={(g) => setActiveGame(g)}
                    isFavorite={favorites[game.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>

            {/* ROW 3: IOGAMES / INOUT SECTION */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide flex items-center gap-2">
                  <span>Iogames</span>
                  <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30 font-mono">
                    INOUT
                  </span>
                </h3>
                <span className="text-xs font-bold text-slate-400 hover:text-amber-400 cursor-pointer flex items-center gap-1 transition-colors">
                  Ver todos <ChevronRight className="w-4 h-4" />
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {iogames.map((game) => (
                  <GamePosterCard
                    key={game.id}
                    game={game}
                    onPlay={(g) => setActiveGame(g)}
                    isFavorite={favorites[game.id]}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          /* Filtered Category View */
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl sm:text-2xl font-black text-white tracking-wide uppercase">
                {selectedCategory}
              </h3>
              <span className="text-xs text-slate-400 font-mono">
                {filteredGames.length} juegos disponibles
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
              {filteredGames.map((game) => (
                <GamePosterCard
                  key={game.id}
                  game={game}
                  onPlay={(g) => setActiveGame(g)}
                  isFavorite={favorites[game.id]}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Real Game Session Modal */}
      {activeGame && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-2 sm:p-4">
          <div
            className={`w-full ${
              isFullscreen ? 'h-full max-w-none' : 'max-w-5xl h-[85vh]'
            } rounded-2xl bg-[#0f1720] border border-brand-gold/40 shadow-2xl overflow-hidden flex flex-col text-white transition-all`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-[#0b1016]">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-black">
                  {activeGame.theme === 'keno'
                    ? '🎱'
                    : activeGame.theme === 'lucky6' || activeGame.theme === '7bet'
                    ? '🍀'
                    : activeGame.theme === 'diver'
                    ? '🛩️'
                    : '🎮'}
                </span>
                <div>
                  <h3 className="font-black text-sm text-white flex items-center gap-2">
                    {activeGame.title}
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
                      {activeGame.subLabel ? `${activeGame.subLabel} Oficial` : 'Juego Verificado'}
                    </span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Modo: {isRealMode ? 'Producción (Saldo Real)' : 'Simulación'} • Divisa: {currencySymbol}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="p-1.5 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
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

            {/* Game Canvas / Engine */}
            <div className="flex-1 w-full bg-black relative">
              {activeGame.theme === 'keno' ? (
                <KenoGameEngine
                  gameTitle="Keno 80 Bolas"
                  onClose={() => {
                    setActiveGame(null);
                    setIsFullscreen(false);
                  }}
                />
              ) : activeGame.theme === 'lucky6' || activeGame.theme === '7bet' ? (
                <LuckyGameEngine
                  gameTitle="Lucky 6 Lotería en Vivo"
                  gameSymbol="lucky_6"
                  onClose={() => {
                    setActiveGame(null);
                    setIsFullscreen(false);
                  }}
                />
              ) : activeGame.theme === 'diver' ? (
                <DiverGameEngine
                  onClose={() => {
                    setActiveGame(null);
                    setIsFullscreen(false);
                  }}
                />
              ) : (
                <iframe
                  src={getGameUrl(activeGame)}
                  title={activeGame.title}
                  className="w-full h-full border-0"
                  allow="autoplay; fullscreen; encrypted-media"
                  loading="eager"
                />
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
