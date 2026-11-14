'use client';

import React from 'react';
import Link from 'next/link';

export const ProductCategoryBar: React.FC = () => {
  const categories = [
    {
      id: 'deportes',
      label: 'DEPORTES',
      href: '#sportsbook',
      icon: (
        <span className="text-xl">⚽</span>
      ),
    },
    {
      id: 'en-vivo',
      label: 'EN VIVO',
      href: '#featured-events',
      icon: (
        <div className="flex flex-col items-center leading-none">
          <span className="text-[9px] font-black bg-rose-600 text-white px-1 py-0.2 rounded font-mono">
            LIVE
          </span>
          <span className="text-xs font-bold text-white mt-0.5">SPORT</span>
        </div>
      ),
      isLive: true,
    },
    {
      id: 'keno',
      label: 'KENO 80',
      href: '#casino',
      icon: (
        <span className="text-xl">🎱</span>
      ),
    },
    {
      id: 'lucky',
      label: 'LUCKY 7',
      href: '#casino',
      icon: (
        <span className="text-xl">🍀</span>
      ),
    },
    {
      id: 'casino-en-vivo',
      label: 'CASINO EN VIVO',
      href: '#live-casino',
      icon: (
        <span className="text-xl">👤</span>
      ),
    },
    {
      id: 'tragamonedas',
      label: 'TRAGAMONEDAS',
      href: '#casino',
      icon: (
        <span className="text-xl">🎰</span>
      ),
    },
    {
      id: 'juegos-tv',
      label: 'JUEGOS TV',
      href: '#fast-games',
      icon: (
        <span className="text-xl">🎲</span>
      ),
    },
    {
      id: 'fast-games',
      label: 'FAST GAMES',
      href: '#fast-games',
      icon: (
        <span className="text-xl">🎯</span>
      ),
    },
    {
      id: 'esport',
      label: 'ESPORT',
      href: '#esports',
      icon: (
        <span className="text-xl">🎮</span>
      ),
    },
    {
      id: 'deportes-virtuales',
      label: 'DEPORTES VIRTUALES',
      href: '#virtuals',
      icon: (
        <span className="text-xl">🏁</span>
      ),
    },
  ];

  return (
    <div className="w-full bg-[#10171d] border-b border-[#1b2631] py-3 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 sm:gap-2.5">
          {categories.map((cat) => (
            <a
              key={cat.id}
              href={cat.href}
              className="flex flex-col items-center justify-center p-3 rounded-xl bg-[#162029]/80 hover:bg-[#1f2c38] border border-slate-800/80 hover:border-[#10b981]/50 text-slate-300 hover:text-white transition-all group shadow-sm"
            >
              <div className="h-7 flex items-center justify-center group-hover:scale-110 transition-transform">
                {cat.icon}
              </div>
              <span className="text-[10px] sm:text-[11px] font-black tracking-wider uppercase text-center mt-1.5 text-slate-300 group-hover:text-[#10b981] transition-colors leading-tight">
                {cat.label}
              </span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

