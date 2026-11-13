'use client';

import React from 'react';
import { useApp } from '@/lib/i18n/context';
import { Database, ShieldCheck, Zap, HeartHandshake, CheckCircle } from 'lucide-react';

export const PlatformBenefits: React.FC = () => {
  const { t } = useApp();

  const benefits = [
    {
      icon: Database,
      title: t.benefits.b1Title,
      desc: t.benefits.b1Desc,
      metric: 'Doble Partida',
      metricLabel: 'Inmutabilidad Contable',
    },
    {
      icon: ShieldCheck,
      title: t.benefits.b2Title,
      desc: t.benefits.b2Desc,
      metric: 'SEGOB & LEH',
      metricLabel: 'Cumplimiento Legal',
    },
    {
      icon: Zap,
      title: t.benefits.b3Title,
      desc: t.benefits.b3Desc,
      metric: '< 50ms',
      metricLabel: 'Latencia Óptima',
    },
    {
      icon: HeartHandshake,
      title: t.benefits.b4Title,
      desc: t.benefits.b4Desc,
      metric: '100% Protegido',
      metricLabel: 'Juego Responsable',
    },
  ];

  return (
    <section className="py-16 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navyLight border border-brand-gold/40 text-brand-gold text-xs font-bold uppercase tracking-wider">
            <CheckCircle className="w-3.5 h-3.5" />
            <span>Infraestructura Empresarial</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black text-white">{t.benefits.title}</h2>
          <p className="text-sm sm:text-base text-slate-400">{t.benefits.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {benefits.map((b, idx) => {
            const Icon = b.icon;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-brand-navy/40 border border-brand-navyLight hover:border-brand-gold/40 p-6 flex flex-col justify-between space-y-6 transition-all"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-brand-navyLight border border-slate-800 flex items-center justify-center text-brand-gold">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-white">{b.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{b.desc}</p>
                </div>

                <div className="pt-4 border-t border-slate-800/80">
                  <span className="text-base font-mono font-black text-brand-positive block">
                    {b.metric}
                  </span>
                  <span className="text-[11px] text-slate-400">{b.metricLabel}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

