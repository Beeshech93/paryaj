'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Trophy, Activity, Calendar, Zap, Shield } from 'lucide-react';

interface SportsSectionProps {
  selectedSport: string;
  onSelectSport: (sport: string) => void;
  activeTab: 'live' | 'upcoming';
  onSelectTab: (tab: 'live' | 'upcoming') => void;
}

export const SportsSection: React.FC<SportsSectionProps> = ({
  selectedSport,
  onSelectSport,
  activeTab,
  onSelectTab,
}) => {
  const { t } = useApp();

  const sportsList = [
    { id: 'football', name: t.sports.football, emoji: '⚽', matches: 34 },
    { id: 'basketball', name: t.sports.basketball, emoji: '🏀', matches: 18 },
    { id: 'baseball', name: t.sports.baseball, emoji: '⚾', matches: 12 },
    { id: 'tennis', name: t.sports.tennis, emoji: '🎾', matches: 15 },
    { id: 'esports', name: t.sports.esports, emoji: '🎮', matches: 8 },
  ];

  return (
    <div id="sportsbook" className="bg-brand-navy/60 border-y border-brand-navyLight py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Header with Title and Mode Switcher */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-brand-gold text-black shadow-lg shadow-brand-gold/20">
              <Trophy className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">{t.sports.title}</h2>
              <p className="text-xs text-slate-400">{t.sports.subtitle}</p>
            </div>
          </div>

          {/* Live vs Upcoming Switcher */}
          <div className="flex items-center bg-brand-dark p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => onSelectTab('live')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'live'
                  ? 'bg-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              <span>{t.sports.liveNow}</span>
              <span className="px-1.5 py-0.2 rounded bg-black/30 text-[10px]">12</span>
            </button>
            <button
              onClick={() => onSelectTab('upcoming')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'upcoming'
                  ? 'bg-brand-navyLight text-brand-gold border border-brand-gold/30 shadow-md'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{t.sports.upcoming}</span>
            </button>
          </div>
        </div>

        {/* Sports Categories Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {sportsList.map((sport) => {
            const isSelected = selectedSport === sport.id;
            return (
              <button
                key={sport.id}
                onClick={() => onSelectSport(sport.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all ${
                  isSelected
                    ? 'bg-brand-gold text-black shadow-md shadow-brand-gold/20'
                    : 'bg-brand-card hover:bg-brand-navyLight text-slate-300 border border-slate-800'
                }`}
              >
                <span>{sport.emoji}</span>
                <span>{sport.name}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                    isSelected ? 'bg-black/20 text-black' : 'bg-brand-dark text-slate-400'
                  }`}
                >
                  {sport.matches}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

