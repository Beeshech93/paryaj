'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Trophy, Sparkles, Gamepad2, Dices } from 'lucide-react';

export const PromoCardsGrid: React.FC = () => {
  return (
    <section id="promo-cards" className="py-6 sm:py-8 bg-[#0b1015] border-b border-[#18232c] font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: JUEGOS VIRTUALES (Green / Motorcycle & Horses) */}
          <Link
            href="#virtuals"
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-[#059669] via-[#047857] to-[#064e3b] p-5 flex flex-col justify-between shadow-xl border border-emerald-400/30 hover:border-emerald-300 transition-all hover:scale-[1.02]"
          >
            {/* Background Texture & Graphics */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,#34d399,transparent_60%)] opacity-30 pointer-events-none" />
            <div className="absolute -right-4 -bottom-6 w-44 h-44 opacity-25 flex items-center justify-center text-7xl select-none group-hover:scale-110 transition-transform">
              🏍️
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-1">
              <span className="text-[10px] font-black tracking-widest text-emerald-100 uppercase bg-black/30 px-2 py-0.5 rounded-full inline-block">
                CARRERAS 24/7
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-white leading-none uppercase">
                JUEGOS
              </h3>
              <h3 className="text-2xl sm:text-3xl font-black text-[#a7f3d0] leading-none uppercase">
                VIRTUALES
              </h3>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-bold text-white">
              <span className="flex items-center gap-1.5">
                <span>Motos, Caballos y Galgos</span>
              </span>
              <span className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>

          {/* Card 2: E-SPORTS (Purple / Dota & LOL) */}
          <Link
            href="#esports"
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-[#4c1d95] via-[#3b0764] to-[#1e1b4b] p-5 flex flex-col justify-between shadow-xl border border-purple-500/30 hover:border-purple-300 transition-all hover:scale-[1.02]"
          >
            {/* Background Texture & Graphics */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,#c084fc,transparent_60%)] opacity-30 pointer-events-none" />
            <div className="absolute -right-4 -bottom-6 w-44 h-44 opacity-25 flex items-center justify-center text-7xl select-none group-hover:scale-110 transition-transform">
              🎮
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-1">
              <h3 className="text-2xl sm:text-3xl font-black text-[#facc15] leading-none uppercase tracking-wide">
                E-SPORTS
              </h3>
              <p className="text-xs text-purple-200 font-medium">
                Apuesta en Dota, Counter-Strike y LOL
              </p>
            </div>

            {/* Logos */}
            <div className="relative z-10 flex items-center justify-between pt-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black bg-yellow-500/20 text-yellow-300 px-2 py-0.5 rounded border border-yellow-500/40">
                  LEAGUE OF LEGENDS
                </span>
                <span className="text-[10px] font-black bg-rose-500/20 text-rose-300 px-2 py-0.5 rounded border border-rose-500/40">
                  DOTA 2
                </span>
              </div>
              <span className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-white group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4 text-white group-hover:text-black" />
              </span>
            </div>
          </Link>

          {/* Card 3: PRUEBA TU SUERTE (Dark Blue / Live Casino Roulette & Dice) */}
          <Link
            href="#live-casino"
            className="group relative h-48 sm:h-52 rounded-2xl overflow-hidden bg-gradient-to-br from-[#1e293b] via-[#0f172a] to-[#020617] p-5 flex flex-col justify-between shadow-xl border border-amber-500/30 hover:border-amber-300 transition-all hover:scale-[1.02]"
          >
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-44 h-44 bg-[radial-gradient(circle_at_top_right,#fbbf24,transparent_60%)] opacity-20 pointer-events-none" />
            <div className="absolute -right-4 -bottom-6 w-44 h-44 opacity-25 flex items-center justify-center text-7xl select-none group-hover:scale-110 transition-transform">
              🎡
            </div>

            {/* Content */}
            <div className="relative z-10 space-y-1">
              <div className="flex items-baseline gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white leading-none uppercase">
                  PRUEBA
                </h3>
                <span className="text-xl sm:text-2xl italic font-serif text-amber-300 font-bold">
                  Tu suerte
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium">
                y gana grandes premios en mesas en vivo
              </p>
            </div>

            <div className="relative z-10 flex items-center justify-between text-xs font-bold text-slate-200">
              <div className="flex items-center gap-1.5 text-amber-300">
                <span>🎲 Dados</span>
                <span>•</span>
                <span>🃏 Blackjack</span>
                <span>•</span>
                <span>🎡 Ruleta</span>
              </div>
              <span className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-black transition-colors">
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};

