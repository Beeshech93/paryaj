'use client';

import React, { useState } from 'react';
import { useApp } from '@/lib/i18n/context';
import { ShieldCheck, Sparkles, Trophy, Dices, ArrowRight, Zap, Play, Wallet } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { t, market, locale, isRealMode, openAuth, openWallet } = useApp();
  const [activeSlide, setActiveSlide] = useState(0);

  const slides = [
    {
      tag: isRealMode ? 'PLATAFORMA REGULADA EN VIVO' : t.hero.tag,
      title: t.hero.title,
      highlight: t.hero.titleHighlight,
      desc: isRealMode
        ? market === 'MX'
          ? 'Bienvenido al operador de nueva generación en México. Cuotas oficiales de Liga MX en directo, slots de Pragmatic Play y mesas en vivo de Evolution Gaming con depósitos y retiros instantáneos vía SPEI STP.'
          : 'Byenveni nan platfòm nouvèl jenerasyon an Ayiti. Kòt ofisyèl Championnat D1 an dirèk, jwèt Pragmatic Play ak Evolution Gaming avèk depo ak retrè rapid pa MonCash.'
        : t.hero.description,
      cta1Text: isRealMode ? 'Jugar Casino Real' : t.hero.ctaPrimary,
      cta1Link: '#casino',
      cta2Text: isRealMode ? 'Ver Deportes en Vivo' : t.hero.ctaSecondary,
      cta2Link: '#sportsbook',
      badge:
        market === 'MX'
          ? isRealMode
            ? 'Licencia SEGOB / DGAJS Operando'
            : 'Regulado para México · SEGOB Ready'
          : isRealMode
          ? 'Otorizasyon Ofisyèl LEH / Loterie Nationale'
          : 'Conformité Haïtienne · LEH Ready',
      color: 'from-amber-400 to-yellow-600',
    },
    {
      tag: 'SPORTSBOOK OFICIAL · LIGA MX, D1 & CHAMPIONS',
      title: 'Las Mejores Cuotas y',
      highlight: 'Mercados en Directo',
      desc:
        market === 'MX'
          ? 'Apuesta en vivo con cuotas auditadas para Club América, Chivas, Cruz Azul y la UEFA Champions League con pago anticipado y margen garantizado.'
          : 'Parye an dirèk ak kòt verifye pou Violette AC, Racing Club, Real Madrid ak UEFA Champions League avèk peman rapid.',
      cta1Text: 'Ver Partidos en Vivo',
      cta1Link: '#sportsbook',
      cta2Text: 'Abrir Boleto',
      cta2Link: '#featured-events',
      badge: 'Feed Oficial The Odds API & Sportradar',
      color: 'from-emerald-400 to-green-600',
    },
    {
      tag: 'CASINO REAL · PRAGMATIC PLAY & EVOLUTION',
      title: 'Slots y Ruletas en Vivo',
      highlight: 'Multiplicadores hasta 1000x',
      desc: 'Disfruta de Gates of Olympus 1000, Sweet Bonanza 1000 y Ruleta en Vivo con crupieres en español con integración de billetera continua.',
      cta1Text: 'Entrar al Casino',
      cta1Link: '#casino',
      cta2Text: 'Ver Promociones',
      cta2Link: '#promotions',
      badge: 'Seamless Wallet Certificado',
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

              <a
                href="/pos"
                className="px-4 py-3.5 rounded-xl bg-emerald-950/70 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-300 font-bold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
              >
                <span>🏪 Punto de Venta Retail</span>
              </a>
            </div>

            {/* Regulatory Notice */}
            <p className="text-xs text-slate-400 pt-2 flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-positive"></span>
              {isRealMode
                ? market === 'MX'
                  ? 'Operación en Producción bajo lineamientos de la Dirección General de Juegos y Sorteos (SEGOB). +18 años.'
                  : 'Operasyon an Pwodiksyon anba règleman Loterie Nationale d’Haïti (LEH). +18 an.'
                : t.hero.disclaimer}
            </p>
          </div>

          {/* Right Visual Card / Quick Widget */}
          <div className="lg:col-span-4">
            <div className="relative rounded-2xl bg-gradient-to-b from-brand-card to-brand-navy p-6 border border-brand-gold/30 shadow-2xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-brand-positive animate-ping" />
                  <span className="text-xs font-mono font-bold text-white tracking-wider">
                    {isRealMode ? '🟢 PRODUCCIÓN EN VIVO' : `${t.common.live} · ACCIÓN DEMO`}
                  </span>
                </div>
                <span className="text-[11px] text-brand-gold font-mono">24/7 ACTIVO</span>
              </div>

              {/* Mini Interactive Preview: Hot game */}
              <div className="p-4 rounded-xl bg-brand-dark/80 border border-slate-800 flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-yellow-700 flex items-center justify-center text-3xl shadow-inner">
                  ⚡
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-1.5 text-xs text-brand-positive font-bold">
                    <Zap className="w-3.5 h-3.5 fill-brand-positive" />
                    <span>Pragmatic Play</span>
                  </div>
                  <h4 className="font-bold text-white text-sm">Gates of Olympus 1000</h4>
                  <p className="text-[11px] text-slate-400 font-mono">RTP: 96.50% · Volatilidad Extrema</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Modo operativo:</span>
                  <span className="text-brand-positive font-semibold">
                    {isRealMode ? 'Dinero Real (Oficial)' : 'Simulación Técnica'}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-400">
                  <span>Jurisdicción activa:</span>
                  <span className="text-slate-200 font-medium">
                    {market === 'MX' ? 'México (MXN - SPEI)' : 'Haití (HTG - MonCash)'}
                  </span>
                </div>
              </div>

              {isRealMode ? (
                <button
                  onClick={() => openWallet('deposit')}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-brand-gold to-yellow-400 text-black font-black text-sm transition-all flex items-center justify-center gap-2 hover:brightness-110 shadow-lg shadow-brand-gold/20"
                >
                  <Wallet className="w-4 h-4 fill-current" />
                  <span>Cargar Saldo a Billetera</span>
                </button>
              ) : (
                <button
                  onClick={() => openAuth('register')}
                  className="w-full py-3 rounded-xl bg-brand-navyLight hover:bg-brand-gold hover:text-black border border-brand-gold/40 text-brand-gold font-bold text-sm transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>Crear Cuenta Gratuita</span>
                </button>
              )}
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
