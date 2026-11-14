'use client';

import React from 'react';
import { Play, Heart, Star } from 'lucide-react';

export interface GamePosterData {
  id: string;
  title: string;
  subLabel?: string;
  theme: string;
  category: string;
  gradient: string;
  section: 'paryajpam' | 'iogames' | 'featured' | 'classic';
  badge?: string;
  rtp?: string;
}

interface GamePosterCardProps {
  game: GamePosterData;
  onPlay: (game: GamePosterData) => void;
  isFavorite?: boolean;
  onToggleFavorite?: (id: string, e: React.MouseEvent) => void;
}

export const GamePosterCard: React.FC<GamePosterCardProps> = ({
  game,
  onPlay,
  isFavorite,
  onToggleFavorite,
}) => {
  // Render specific art matching the user's screenshot
  const renderArt = () => {
    switch (game.theme) {
      case 'keno':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#075985]">
            {/* Top hanging balls & atmosphere */}
            <div className="absolute top-2 left-0 right-0 flex justify-around opacity-40">
              <span className="w-5 h-5 rounded-full bg-blue-300 shadow-md inline-block animate-pulse" />
              <span className="w-4 h-4 rounded-full bg-blue-200 shadow-md inline-block" />
              <span className="w-6 h-6 rounded-full bg-cyan-200 shadow-md inline-block" />
            </div>

            {/* Main Central Floating Balls */}
            <div className="relative z-10 flex items-center justify-center pt-5 pb-2">
              {/* Ball 20 (blue) */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-400 via-blue-600 to-indigo-900 border-2 border-blue-300 flex items-center justify-center font-black text-white text-base shadow-xl -mr-3 transform -translate-y-2 select-none">
                20
              </div>
              {/* Big Golden Ball 5 (central) */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-300 via-yellow-500 to-amber-600 border-2 border-yellow-200 flex items-center justify-center font-black text-black text-3xl shadow-2xl z-20 ring-4 ring-yellow-400/40 select-none">
                5
              </div>
              {/* Ball 14 (blue) */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-400 via-blue-600 to-blue-950 border-2 border-cyan-300 flex items-center justify-center font-black text-white text-base shadow-xl -ml-3 transform -translate-y-2 select-none">
                14
              </div>
            </div>

            {/* Checkered pattern bottom floor */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            {/* Bottom Title banner */}
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2.5 text-center z-10">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                KENO
              </h4>
            </div>
          </div>
        );

      case 'roulette':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#059669] via-[#047857] to-[#064e3b]">
            {/* Roulette Wheel Graphics */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-4">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#064e3b] via-[#047857] to-black border-4 border-yellow-400/80 shadow-2xl flex items-center justify-center relative select-none">
                {/* Center wheel core */}
                <div className="w-12 h-12 rounded-full bg-emerald-800 border-2 border-amber-300 flex items-center justify-center font-black text-amber-300 text-lg">
                  0
                </div>
                {/* Numbers ring simulation */}
                <span className="absolute top-1 text-[8px] font-bold text-white">2</span>
                <span className="absolute bottom-1 text-[8px] font-bold text-white">11</span>
                <span className="absolute left-1.5 text-[8px] font-bold text-white">8</span>
                <span className="absolute right-1.5 text-[8px] font-bold text-white">14</span>
              </div>

              {/* Chips 50 and 100 */}
              <div className="flex items-center gap-2 -mt-3 z-20">
                <span className="w-8 h-8 rounded-full bg-emerald-600 border border-white flex items-center justify-center font-black text-[10px] text-white shadow-lg">
                  50
                </span>
                <span className="w-8 h-8 rounded-full bg-blue-600 border border-white flex items-center justify-center font-black text-[10px] text-white shadow-lg">
                  100
                </span>
              </div>
            </div>

            {/* Checkered pattern bottom */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2.5 text-center z-10">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                ROULETTE
              </h4>
            </div>
          </div>
        );

      case 'lucky6':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#be123c] via-[#9f1239] to-[#881337]">
            {/* Clover background watermark */}
            <div className="absolute -top-4 -right-4 text-7xl opacity-20 select-none">🍀</div>

            {/* Central Colorful Balls Cluster */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-3">
              <div className="flex items-center gap-1">
                <span className="w-7 h-7 rounded-full bg-amber-500 text-black border border-yellow-200 font-bold text-[10px] flex items-center justify-center shadow">
                  10
                </span>
                <span className="w-7 h-7 rounded-full bg-purple-600 text-white border border-purple-300 font-bold text-[10px] flex items-center justify-center shadow">
                  27
                </span>
              </div>
              {/* Big Center Red Ball 6 */}
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 via-rose-600 to-red-900 border-4 border-white flex items-center justify-center font-black text-white text-4xl shadow-2xl my-0.5 select-none ring-4 ring-rose-500/40">
                6
              </div>
              <div className="flex items-center gap-1.5 -mt-2">
                <span className="w-6 h-6 rounded-full bg-green-500 text-black font-bold text-[9px] flex items-center justify-center shadow">
                  14
                </span>
                <span className="w-6 h-6 rounded-full bg-amber-400 text-black font-bold text-[9px] flex items-center justify-center shadow">
                  5
                </span>
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white font-bold text-[9px] flex items-center justify-center shadow">
                  1
                </span>
              </div>
            </div>

            {/* Checkered pattern bottom */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2.5 text-center z-10">
              <h4 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                LUCKY6
              </h4>
            </div>
          </div>
        );

      case 'horseracing':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#e11d48] via-[#be123c] to-[#991b1b]">
            {/* Turf / Jockeys Silhouette Art */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-6xl filter drop-shadow-xl transform -scale-x-100">
                🏇
              </div>
              <div className="flex items-center gap-1 -mt-2">
                <span className="text-4xl filter drop-shadow-lg transform -scale-x-100">🏇</span>
                <span className="text-3xl filter drop-shadow-md transform -scale-x-100">🐎</span>
              </div>
            </div>

            {/* Race track lines */}
            <div className="w-full h-12 border-t-2 border-white/20 bg-gradient-to-t from-black/60 to-transparent" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2 text-center z-10 leading-tight">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                HORSE
              </h4>
              <h4 className="text-base sm:text-lg font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] -mt-1">
                RACING
              </h4>
            </div>
          </div>
        );

      case 'american_roulette':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#7c3aed] via-[#6d28d9] to-[#4c1d95]">
            {/* Double Zero American Wheel */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-4 select-none">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-black border-4 border-yellow-400 flex items-center justify-center shadow-2xl relative">
                <div className="w-12 h-12 rounded-full bg-purple-900 border-2 border-amber-300 flex items-center justify-center font-black text-amber-300 text-xs">
                  00
                </div>
                {/* Spoke details */}
                <span className="absolute top-1 text-[8px] font-bold text-white">28</span>
                <span className="absolute bottom-1 text-[8px] font-bold text-white">9</span>
                <span className="absolute left-1 text-[8px] font-bold text-white">0</span>
                <span className="absolute right-1 text-[8px] font-bold text-white">2</span>
              </div>
              <div className="text-lg -mt-2">🃏 🎲</div>
            </div>

            {/* Checkered pattern bottom */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent pt-6 pb-2 text-center z-10 leading-tight">
              <h4 className="text-sm sm:text-base font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                AMERICAN
              </h4>
              <h4 className="text-sm sm:text-base font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] -mt-1">
                ROULETTE
              </h4>
            </div>
          </div>
        );

      case 'diver':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#facc15] via-[#eab308] to-[#ca8a04]">
            {/* Multiplier Tag */}
            <div className="absolute top-3 right-3 z-20">
              <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white font-mono font-black text-[10px] shadow-md border border-rose-400">
                x9.63
              </span>
            </div>

            {/* Sleek Private Jet Airplane Graphic */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-8 select-none">
              <div className="text-7xl filter drop-shadow-2xl transform -rotate-12 hover:scale-110 transition-transform">
                🛩️
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                DIVER
              </h4>
              <p className="text-[10px] font-bold text-amber-300 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'sugardaddy':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#ec4899] via-[#db2777] to-[#9d174d]">
            {/* Retro Sunset & Convertible */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-6 select-none">
              <div className="text-2xl mb-1">🌴 🌅 🌴</div>
              <div className="text-6xl filter drop-shadow-2xl">🚗</div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-lg sm:text-xl font-black text-pink-100 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                SUGAR DADDY
              </h4>
              <p className="text-[10px] font-bold text-pink-300 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'chickenroad':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#f97316] via-[#ea580c] to-[#c2410c]">
            {/* Crazy Chicken Crossing Road */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-7xl filter drop-shadow-2xl animate-bounce">
                🐔
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                CHICKEN ROAD 2
              </h4>
              <p className="text-[10px] font-bold text-orange-200 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'penalty':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#15803d] via-[#166534] to-[#14532d]">
            {/* Goalkeeper with Soccer Ball */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-6xl filter drop-shadow-2xl">⚽</div>
              <div className="text-4xl -mt-3 filter drop-shadow-lg">🧤</div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-sm sm:text-base font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                PENALTY
              </h4>
              <h4 className="text-xs sm:text-sm font-black text-emerald-300 tracking-wider uppercase drop-shadow -mt-1">
                UNLIMITED
              </h4>
              <p className="text-[10px] font-bold text-emerald-200 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'chickencoin':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#d97706] via-[#b45309] to-[#78350f]">
            {/* Chicken with 777 Slot Coins */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-5xl filter drop-shadow-xl">🐥</div>
              <div className="text-2xl filter drop-shadow-lg -mt-1 font-mono font-black text-yellow-300">
                🎰 777
              </div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-sm sm:text-base font-black text-yellow-300 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                CHICKEN COIN
              </h4>
              <span className="text-[9px] font-black bg-rose-600 px-1.5 py-0.2 rounded text-white inline-block">
                HOLD AND WIN
              </span>
            </div>
          </div>
        );

      case 'chickenroyal':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#0284c7] via-[#0369a1] to-[#0c4a6e]">
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-7xl filter drop-shadow-2xl">🐔</div>
              <div className="text-xs font-black text-yellow-300 -mt-1">👑 ROYAL</div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-base sm:text-lg font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                CHICKEN ROYAL
              </h4>
              <p className="text-[10px] font-bold text-cyan-200 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'triple':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#65a30d] via-[#4d7c0f] to-[#365314]">
            {/* Multiplier x80 */}
            <div className="absolute top-2 right-2 z-20">
              <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono font-black text-[10px] shadow border border-rose-400">
                x80
              </span>
            </div>

            {/* Fruit grid */}
            <div className="relative z-10 grid grid-cols-2 gap-2 pt-6 select-none">
              <span className="w-10 h-10 rounded-xl bg-green-500/80 border border-green-300 flex items-center justify-center text-xl shadow">
                🍊
              </span>
              <span className="w-10 h-10 rounded-xl bg-green-500/80 border border-green-300 flex items-center justify-center text-xl shadow">
                🍇
              </span>
              <span className="w-10 h-10 rounded-xl bg-green-500/80 border border-green-300 flex items-center justify-center text-xl shadow">
                🍒
              </span>
              <span className="w-10 h-10 rounded-xl bg-green-500/80 border border-green-300 flex items-center justify-center text-xl shadow">
                🍋
              </span>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-xl font-black text-white tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                TRIPLE
              </h4>
              <p className="text-[10px] font-bold text-lime-200 uppercase tracking-widest">INOUT</p>
            </div>
          </div>
        );

      case 'hotcherry':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#991b1b] via-[#7f1d1d] to-[#450a0a]">
            {/* Flames & Cherries */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-2xl animate-pulse">🔥</div>
              <div className="text-6xl filter drop-shadow-2xl">🍒</div>
            </div>

            {/* Checkered pattern bottom */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-xl font-black text-rose-200 tracking-wider uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] font-serif">
                Hot Cherry
              </h4>
            </div>
          </div>
        );

      case '7bet':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#831843] via-[#701a75] to-[#4c0519]">
            {/* TVBet badge */}
            <div className="absolute top-2 left-2 z-20">
              <span className="px-2 py-0.5 rounded bg-black/60 text-amber-300 font-mono font-black text-[9px] border border-amber-500/40">
                TVBET
              </span>
            </div>

            {/* Live Host Presenter icon */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="w-16 h-16 rounded-full bg-rose-600/30 border-2 border-rose-400 flex items-center justify-center text-4xl shadow-xl">
                👩‍💼
              </div>
              <div className="text-lg -mt-2">🎱 🎤</div>
            </div>

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-2xl font-black text-white tracking-widest uppercase drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                7BET
              </h4>
            </div>
          </div>
        );

      case 'justjewels':
        return (
          <div className="relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b from-[#831843] via-[#881337] to-[#4c0519]">
            {/* Royal Ruby Crown */}
            <div className="relative z-10 flex flex-col items-center justify-center pt-5 select-none">
              <div className="text-6xl filter drop-shadow-2xl">👑</div>
              <div className="text-xl -mt-1">💎 💎</div>
            </div>

            {/* Checkered pattern bottom */}
            <div className="w-full h-14 bg-[radial-gradient(#ffffff15_1px,transparent_1px)] [background-size:10px_10px] opacity-70" />

            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-sm font-black text-amber-300 tracking-wider uppercase drop-shadow">
                Just Jewels
              </h4>
              <p className="text-[10px] font-serif italic text-cyan-300">deluxe</p>
            </div>
          </div>
        );

      default:
        return (
          <div
            className={`relative w-full h-full flex flex-col items-center justify-between overflow-hidden bg-gradient-to-b ${game.gradient}`}
          >
            <div className="relative z-10 flex flex-col items-center justify-center pt-6 select-none">
              <span className="text-6xl drop-shadow-2xl">🎮</span>
            </div>
            <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent pt-6 pb-2 text-center z-10">
              <h4 className="text-base font-black text-white tracking-wider uppercase drop-shadow">
                {game.title}
              </h4>
            </div>
          </div>
        );
    }
  };

  return (
    <div
      onClick={() => onPlay(game)}
      className="group relative rounded-2xl overflow-hidden aspect-[3.8/5] sm:aspect-[4/5] bg-slate-900 border border-slate-800/80 hover:border-brand-gold shadow-lg hover:shadow-xl hover:shadow-brand-gold/20 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* Visual Art */}
      <div className="w-full h-full relative">
        {renderArt()}

        {/* Favorite Icon */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (onToggleFavorite) onToggleFavorite(game.id, e);
          }}
          className="absolute top-2.5 right-2.5 z-30 p-1.5 rounded-full bg-black/40 hover:bg-black/70 text-white transition-colors"
        >
          <Heart
            className={`w-3.5 h-3.5 ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-white/80'
            }`}
          />
        </button>

        {/* Hover Overlay */}
        <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center gap-2.5 p-3 z-30 backdrop-blur-xs">
          <button className="w-full py-2.5 rounded-xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black font-black text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 shadow-xl hover:scale-105 active:scale-95 transition-all">
            <Play className="w-4 h-4 fill-black" />
            Jugar
          </button>
          <span className="text-[10px] text-slate-300 font-mono text-center">
            {game.category.toUpperCase()} • RÁPIDO
          </span>
        </div>
      </div>
    </div>
  );
};
