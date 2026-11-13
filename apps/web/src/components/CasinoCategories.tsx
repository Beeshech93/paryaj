'use client';

import React from 'react';
import { useApp } from '@/lib/i18n/context';
import { Dices, Flame, Sparkles, CircleDot, Layers, Crown, Zap } from 'lucide-react';

interface CasinoCategoriesProps {
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
}

export const CasinoCategories: React.FC<CasinoCategoriesProps> = ({
  selectedCategory,
  onSelectCategory,
}) => {
  const { t } = useApp();

  const categories = [
    { id: 'all', name: t.casino.all, icon: Layers, count: 48 },
    { id: 'popular', name: t.common.popular, icon: Flame, count: 12 },
    { id: 'slots', name: t.casino.slots, icon: Dices, count: 24 },
    { id: 'crash', name: t.casino.crash, icon: Zap, count: 6 },
    { id: 'roulette', name: t.casino.roulette, icon: CircleDot, count: 8 },
    { id: 'blackjack', name: t.casino.blackjack, icon: Crown, count: 6 },
    { id: 'jackpots', name: t.casino.jackpots, icon: Sparkles, count: 4 },
  ];

  return (
    <div className="w-full border-b border-brand-navyLight bg-brand-navy/30 py-4">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;

            return (
              <button
                key={cat.id}
                onClick={() => onSelectCategory(cat.id)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black shadow-lg shadow-brand-gold/20 scale-105'
                    : 'bg-brand-navyLight/70 hover:bg-brand-navyLight text-slate-300 hover:text-white border border-slate-800'
                }`}
              >
                <Icon className={`w-4 h-4 ${isSelected ? 'text-black' : 'text-brand-gold'}`} />
                <span>{cat.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-brand-card text-slate-400'
                  }`}
                >
                  {cat.count}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

