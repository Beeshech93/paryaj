'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { ShieldCheck, Sparkles, Trophy, Dices, ArrowRight, Zap, Play } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { t, market, openAuth } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      tag: t.hero.tag,
      title: t.hero.title,
      highlight: t.hero.titleHighlight,
      desc: t.hero.description,
      cta1Text: t.hero.ctaPrimary,
      cta1Link: '#casino',
      cta2Text: t.hero.ctaSecondary,
      cta2Link: '#sportsbook',
      badge: market === 'MX' ? 'Regulado para México · SEGOB Ready' : 'Conformité Haïtienne · LEH Ready',
      color: 'from-amber-400 to-yellow-600',
    },
    {
      tag: 'SPORTSBOOK PREMIUM · LIGA MX & INTERNATIONAL',
      title: 'Las Mejores Cuotas y',
      highlight: 'Mercados en Vivo',
      desc: 'Sigue a tus equipos favoritos con datos actualizados en tiempo real y cupones de apuesta simulados sin riesgo.',
      cta1Text: 'Ver Partidos Destacados',
      cta1Link: '#sportsbook',
      cta2Text: 'Probar Cupón Demo',
      cta2Link: '#featured-events',
      badge: 'Fútbol, NBA, Béisbol y más',
      color: 'from-emerald-400 to-green-600',
    },
    {
      tag: 'JUEGOS RÁPIDOS · CRASH & SLOTS',
      title: 'Multiplicadores Instantáneos',
      highlight: 'Hasta 10,000x Demo',
      desc: 'Títulos de alta volatilidad con algoritmos demostrablemente justos (Provably Fair) y saldo de cortesía.',
      cta1Text: 'Jugar Aviator Demo',
      cta1Link: '#fast-games',
      cta2Text: 'Ver Promociones',
      cta2Link: '#promotions',
      badge: 'Certificación RNG Simulada',
      color: 'from-yellow-300 to-amber-500',
    },
  ];

  const current = slides[activeSlide];

  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-brand-navy via-brand-dark to-brand-dark pt-8 pb-14 border-b border-brand-navyLight">
      {/* Background glow effects */}
      <div className="absolute top-0 left-1/4 -z-10 w-96 h-96 bg-brand-gold/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 -z-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Main Copy */}
          <div className="lg:col-span-8 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-navyLight border border-brand-gold/40 text-brand-gold text-xs font-bold tracking-wider uppercase">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                {current.tag}
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-brand-positive text-xs font-semibold">
                <ShieldCheck className="w-3.5 h-3.5" />
                {current.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
              {current.title} <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-brand-gold via-yellow-300 to-amber-400 bg-clip-text text-transparent">
                {current.highlight}
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              {current.desc}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <a
                href={current.cta1Link}
                className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-400 text-black font-extrabold text-sm sm:text-base hover:brightness-110 shadow-xl shadow-brand-gold/20 flex items-center gap-2 transition-all group"
              >
                <span>{current.cta1Text}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>

              <a
                href={current.cta2Link}
                className="px-6 py-3.5 rounded-xl bg-brand-navyLight/80 hover:bg-brand-navyLight border border-slate-700 hover:border-brand-gold/50 text-white font-bold text-sm sm:text-base transition-colors flex items-center gap-2"
              >
                <span>{current.cta2Text}</span>
              </a>
            </div>

            {/* Regulatory Notice */}
            <p className="text-xs text-slate-400 pt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-positive"></span>
              {t.hero.disclaimer}
            </p>
          </div>

          {/* Right Visual Card / Quick Widget */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl bg-gradient-to-b from-brand-card to-brand-navy p-6 border border-brand-gold/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-positive animate-ping" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {t.common.live} · ACCIÓN DEMO
                  </span>
                </div>
                <span className="text-[11px] text-brand-gold font-mono">24/7 ACTIVO</span>
              </div>

              {/* Mini Interactive Preview: Hot game */}
              <div className="p-4 rounded-xl bg-brand-dark/80 border border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-lg bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center text-2xl shadow-inner">
                  🎰
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-brand-positive font-bold">
                    <Zap className="w-3.5 h-3.5 fill-brand-positive" />
                    <span>Juego Destacado</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Gates of Aztec Deluxe</h4>
                  <p className="text-[11px] text-slate-400 font-mono">RTP: 96.5% · Volatilidad Alta</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Modo de juego:</span>
                  <span className="text-brand-positive font-semibold">Simulado / Créditos Demo</span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Jurisdicción activa:</span>
                  <span className="text-slate-200 font-medium">
                    {market === 'MX' ? 'México (MX)' : 'Haití (HT)'}
                  </span>
                </div>
              </div>

              <button
                onClick={() => openAuth('register')}
                className="w-full py-3 rounded-xl bg-brand-navyLight hover:bg-brand-gold hover:text-black border border-brand-gold/40 text-brand-gold font-bold text-sm transition-all flex items-center justify-center gap-2"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>Crear Cuenta Demo Gratuita</span>
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Slide Switcher */}
        <div className="flex items-center justify-center gap-2 pt-10">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveSlide(idx)}
              className={`h-2 rounded-full transition-all ${
                activeSlide === idx ? 'w-8 bg-brand-gold' : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

