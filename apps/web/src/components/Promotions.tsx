'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { Gift, Zap, TrendingUp, ShieldCheck, CheckCircle2 } from 'lucide-react';

export const Promotions: React.FC<PromotionsProps> = () => {
  const { t, updateDemoBalance } = useApp();
  const [claimed, setClaimed] = useState<Record<string, boolean>>({});

  const handleClaim = (promoId: string, amount: number) => {
    if (claimed[promoId]) return;
    updateDemoBalance(amount);
    setClaimed((prev) => ({ ...prev, [promoId]: true }));
  };

  const promos = [
    {
      id: 'promo-welcome',
      title: t.promotions.promo1Title,
      desc: t.promotions.promo1Desc,
      tag: 'NUEVOS USUARIOS',
      reward: 10000,
      badge: '100% DEMO MATCH',
      gradient: 'from-amber-500/20 via-yellow-600/10 to-transparent',
      borderColor: 'border-brand-gold/40',
      icon: Gift,
    },
    {
      id: 'promo-parlay',
      title: t.promotions.promo2Title,
      desc: t.promotions.promo2Desc,
      tag: 'SPORTSBOOK',
      reward: 2500,
      badge: 'CUOTAS POTENCIADAS',
      gradient: 'from-blue-500/20 via-indigo-600/10 to-transparent',
      borderColor: 'border-blue-500/40',
      icon: TrendingUp,
    },
    {
      id: 'promo-cashback',
      title: t.promotions.promo3Title,
      desc: t.promotions.promo3Desc,
      tag: 'SLOTS & CRASH',
      reward: 1500,
      badge: 'SEMANAL SIMULADO',
      gradient: 'from-emerald-500/20 via-teal-600/10 to-transparent',
      borderColor: 'border-emerald-500/40',
      icon: Zap,
    },
  ];

  return (
    <section id="promotions" className="py-12 bg-brand-navy/40 border-y border-brand-navyLight">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-navyLight border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <Gift className="w-3.5 h-3.5" />
            <span>{t.promotions.title}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">{t.promotions.subtitle}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {promos.map((promo) => {
            const Icon = promo.icon;
            const isClaimed = claimed[promo.id];

            return (
              <div
                key={promo.id}
                className={`relative rounded-2xl bg-gradient-to-b ${promo.gradient} bg-brand-card border ${promo.borderColor} p-6 flex flex-col justify-between shadow-xl space-y-6 hover:translate-y-[-2px] transition-transform`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="px-2.5 py-1 rounded-md bg-brand-dark/80 text-[10px] font-bold text-brand-gold border border-brand-gold/30">
                      {promo.tag}
                    </span>
                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      {promo.badge}
                    </span>
                  </div>

                  <div className="w-12 h-12 rounded-xl bg-brand-navyLight border border-slate-800 flex items-center justify-center text-brand-gold">
                    <Icon className="w-6 h-6" />
                  </div>

                  <h3 className="text-lg font-black text-white">{promo.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{promo.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                    <span>Premio demo:</span>
                    <span className="text-brand-positive font-bold">
                      +${promo.reward.toLocaleString('en-US')}.00
                    </span>
                  </div>

                  <button
                    onClick={() => handleClaim(promo.id, promo.reward)}
                    disabled={isClaimed}
                    className={`w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                      isClaimed
                        ? 'bg-emerald-950 text-brand-positive border border-emerald-500/40 cursor-default'
                        : 'bg-gradient-to-r from-brand-gold to-yellow-400 text-black hover:brightness-110 shadow-lg shadow-brand-gold/20'
                    }`}
                  >
                    {isClaimed ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-brand-positive" />
                        <span>Bono Activado</span>
                      </>
                    ) : (
                      <span>{t.promotions.claimBtn}</span>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

interface PromotionsProps {}

