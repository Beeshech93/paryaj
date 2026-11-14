'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/lib/i18n/context';
import { ChevronLeft, ChevronRight, Trophy, Zap, ShieldCheck } from 'lucide-react';

export const HeroBanner: React.FC = () => {
  const { openAuth } = useApp();
  const [currentSlide, setCurrentSlide] = useState(3);
  const totalSlides = 8;

  // Auto-advance carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
    }, 6000);
    return () => clearInterval(timer);
  }, [totalSlides]);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev <= 1 ? totalSlides : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev >= totalSlides ? 1 : prev + 1));
  };

  return (
    <section className="relative w-full overflow-hidden bg-gradient-to-r from-[#04241d] via-[#08382f] to-[#041b16] py-8 sm:py-12 lg:py-16 border-b border-[#0f3b32]">
      {/* Stadium spotlight glow in background */}
      <div className="absolute top-0 left-1/3 w-[600px] h-[350px] bg-[#10b981]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[300px] bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Pagination Indicator (< > 3/8) */}
        <div className="flex items-center gap-2 mb-4 text-xs font-mono text-slate-300">
          <button
            onClick={handlePrev}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 border border-emerald-500/20 text-slate-200 transition-colors"
            title="Slide Anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleNext}
            className="p-1.5 rounded-lg bg-black/40 hover:bg-black/70 border border-emerald-500/20 text-slate-200 transition-colors"
            title="Slide Siguiente"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <span className="ml-1 tracking-widest font-bold text-slate-200">
            {currentSlide}/{totalSlides}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[380px]">
          {/* Left Column: Huge Headline & Orange APUESTA CTA */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <div className="space-y-1 sm:space-y-2">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
                GANA CON TU
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-none uppercase">
                DEPORTE
              </h1>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-[#facc15] tracking-tight leading-none uppercase drop-shadow-md">
                FAVORITO
              </h1>
            </div>

            <p className="text-sm sm:text-base text-slate-300 max-w-lg leading-relaxed">
              Las mejores cuotas en vivo para NBA, Champions League, Liga MX, NFL y Tenis con pagos inmediatos.
            </p>

            {/* Bright Orange APUESTA Button */}
            <div>
              <a
                href="#sportsbook"
                className="inline-block bg-gradient-to-r from-[#ff6a00] via-[#f97316] to-[#ea580c] hover:from-[#ea580c] hover:to-[#c2410c] text-white font-black text-base sm:text-lg uppercase tracking-wider px-10 py-3.5 rounded-xl shadow-xl shadow-orange-500/30 transform hover:-translate-y-0.5 active:translate-y-0 transition-all text-center"
              >
                APUESTA
              </a>
            </div>
          </div>

          {/* Right Column: Circular Grass Podium with 4 Sports Champions */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-full max-w-[520px] h-[340px] flex items-center justify-center">
              {/* Circular Turf Grass Base (3D Perspective) */}
              <div className="absolute bottom-2 w-72 sm:w-96 h-28 sm:h-36 rounded-[50%] bg-gradient-to-b from-[#22c55e] via-[#15803d] to-[#14532d] border-4 border-[#4ade80]/40 shadow-2xl shadow-emerald-950/80 transform rotate-x-12 scale-y-75 flex items-center justify-center overflow-hidden">
                <div className="w-full h-full opacity-40 bg-[radial-gradient(#16a34a_2px,transparent_2px)] [background-size:12px_12px]" />
                {/* Grass border texture */}
                <div className="absolute inset-0 rounded-[50%] border-2 border-white/20" />
              </div>

              {/* Athletes Composition */}
              <div className="relative z-10 w-full h-full flex items-end justify-center gap-1 sm:gap-2 pb-6">
                {/* 1. American Football Player */}
                <div className="flex flex-col items-center transform -translate-x-2 group">
                  <div className="w-20 sm:w-24 h-48 sm:h-56 bg-gradient-to-t from-slate-900 to-slate-800 rounded-t-3xl border border-slate-700/60 shadow-xl flex flex-col items-center justify-between p-2 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center shadow-md">
                      <span className="text-[9px] font-black text-slate-800">🏈</span>
                    </div>
                    <div className="w-14 h-24 bg-gradient-to-b from-blue-700 to-indigo-900 rounded-t-lg flex flex-col items-center justify-center text-white">
                      <span className="text-[10px] font-mono font-bold text-blue-200">NFL</span>
                      <span className="text-sm font-black">99</span>
                    </div>
                    <div className="w-12 h-16 bg-white rounded-b-md flex items-center justify-center">
                      <span className="text-[10px] font-black text-slate-600">PRO</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">NFL</span>
                </div>

                {/* 2. Football / Soccer Player (Center-Left) */}
                <div className="flex flex-col items-center transform -translate-y-2 z-20">
                  <div className="w-22 sm:w-28 h-56 sm:h-64 bg-gradient-to-t from-blue-900 to-sky-700 rounded-t-3xl border-2 border-sky-400/50 shadow-2xl flex flex-col items-center justify-between p-2.5 relative overflow-hidden">
                    {/* Head */}
                    <div className="w-9 h-9 rounded-full bg-[#fcd34d] border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-black text-slate-800">👤</span>
                    </div>
                    {/* Jersey */}
                    <div className="w-16 h-28 bg-gradient-to-b from-blue-600 to-blue-800 rounded-t-xl flex flex-col items-center justify-center text-white shadow-inner">
                      <span className="text-[9px] font-bold tracking-widest text-sky-200 uppercase">FÚTBOL</span>
                      <span className="text-xl font-black text-yellow-300">10</span>
                      <span className="text-[8px] font-mono text-white/80">CHAMPIONS</span>
                    </div>
                    {/* Soccer Ball at feet */}
                    <div className="w-9 h-9 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-lg transform -translate-y-1">
                      <span className="text-sm">⚽</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-emerald-400 mt-1 uppercase tracking-wider">Fútbol</span>
                </div>

                {/* 3. Basketball Player (#5) (Center-Right) */}
                <div className="flex flex-col items-center transform -translate-y-4 z-20">
                  <div className="w-22 sm:w-28 h-60 sm:h-68 bg-gradient-to-t from-slate-100 to-white rounded-t-3xl border-2 border-amber-400/50 shadow-2xl flex flex-col items-center justify-between p-2.5 relative overflow-hidden text-black">
                    {/* Head */}
                    <div className="w-9 h-9 rounded-full bg-[#f59e0b] border-2 border-white flex items-center justify-center shadow-md">
                      <span className="text-[10px] font-black text-slate-800">👤</span>
                    </div>
                    {/* White Jersey #5 */}
                    <div className="w-16 h-32 bg-white rounded-t-xl border border-slate-300 flex flex-col items-center justify-center shadow-sm">
                      <span className="text-[9px] font-bold tracking-widest text-blue-900 uppercase">NBA</span>
                      <span className="text-2xl font-black text-blue-800">5</span>
                      <span className="text-[8px] font-mono text-slate-500">ALL-STAR</span>
                    </div>
                    {/* Basketball */}
                    <div className="w-9 h-9 rounded-full bg-[#ea580c] border-2 border-black flex items-center justify-center shadow-lg transform -translate-y-1">
                      <span className="text-sm">🏀</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-black text-amber-400 mt-1 uppercase tracking-wider">NBA</span>
                </div>

                {/* 4. Tennis Player */}
                <div className="flex flex-col items-center transform translate-x-2">
                  <div className="w-20 sm:w-24 h-48 sm:h-56 bg-gradient-to-t from-slate-800 to-slate-700 rounded-t-3xl border border-slate-600/60 shadow-xl flex flex-col items-center justify-between p-2 relative overflow-hidden">
                    <div className="w-8 h-8 rounded-full bg-white border-2 border-slate-400 flex items-center justify-center shadow-md">
                      <span className="text-[9px] font-black text-slate-800">🎾</span>
                    </div>
                    <div className="w-14 h-24 bg-gradient-to-b from-white to-slate-200 rounded-t-lg flex flex-col items-center justify-center text-slate-900">
                      <span className="text-[9px] font-bold text-slate-600">ATP</span>
                      <span className="text-sm font-black">1</span>
                    </div>
                    <div className="w-12 h-16 bg-blue-950 rounded-b-md flex items-center justify-center text-white">
                      <span className="text-[10px] font-black">SLAM</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 mt-1 uppercase tracking-wider">Tenis</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
