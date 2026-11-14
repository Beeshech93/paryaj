'use client';

import React from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/i18n/context';
import { ShieldCheck, Lock, HeartHandshake, Globe2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, market, locale, setLocale, setMarket } = useApp();

  return (
    <footer className="border-t border-brand-navyLight bg-brand-navy/90 text-slate-400 text-xs">
      {/* Upper Legal Badges & Regulators */}
      <div className="border-b border-brand-navyLight/80 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-yellow-500/10 border border-brand-gold/40 flex items-center justify-center text-brand-gold font-bold text-sm">
              18+
            </div>
            <div>
              <h4 className="text-white font-bold text-xs">Juego Responsable y Seguro</h4>
              <p className="text-[11px] text-slate-400 max-w-md">{t.footer.responsibleNotice}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1.5 rounded-lg bg-brand-card border border-slate-800 text-[11px] flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-gold" />
              <span>{t.footer.legalMx}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-brand-card border border-slate-800 text-[11px] flex items-center gap-1.5 text-slate-300">
              <ShieldCheck className="w-3.5 h-3.5 text-brand-positive" />
              <span>{t.footer.legalHt}</span>
            </span>
            <span className="px-3 py-1.5 rounded-lg bg-brand-card border border-slate-800 text-[11px] flex items-center gap-1.5 text-slate-300">
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span>SSL 256-bit Encriptado</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Navigation Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center font-black text-black text-base">
                N
              </div>
              <span className="text-lg font-black text-white tracking-wider">NEW BRAND</span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Plataforma de software para entretenimiento regulado de última generación. Diseñada para
              ofrecer máxima transparencia a través de registros criptográficos inmutables.
            </p>
            <div className="flex items-center gap-2 text-xs text-brand-gold">
              <HeartHandshake className="w-4 h-4" />
              <span>Compromiso estricto con la protección al jugador.</span>
            </div>
          </div>

          {/* Column: Juegos */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Casino</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#casino" className="hover:text-brand-gold transition-colors">
                  Tragamonedas
                </a>
              </li>
              <li>
                <a href="#casino" className="hover:text-brand-gold transition-colors">
                  Ruleta en Vivo
                </a>
              </li>
              <li>
                <a href="#casino" className="hover:text-brand-gold transition-colors">
                  Blackjack
                </a>
              </li>
              <li>
                <a href="#casino" className="hover:text-brand-gold transition-colors">
                  Crash Games
                </a>
              </li>
              <li>
                <a href="#casino" className="hover:text-brand-gold transition-colors">
                  Jackpots Progresivos
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Deportes */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Deportes</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="#sportsbook" className="hover:text-brand-gold transition-colors">
                  Liga MX (México)
                </a>
              </li>
              <li>
                <a href="#sportsbook" className="hover:text-brand-gold transition-colors">
                  Concacaf & Caribe
                </a>
              </li>
              <li>
                <a href="#sportsbook" className="hover:text-brand-gold transition-colors">
                  Champions League
                </a>
              </li>
              <li>
                <a href="#sportsbook" className="hover:text-brand-gold transition-colors">
                  NBA & Baloncesto
                </a>
              </li>
              <li>
                <a href="#sportsbook" className="hover:text-brand-gold transition-colors">
                  MLB & Béisbol
                </a>
              </li>
            </ul>
          </div>

          {/* Column: Legal & Juego Responsable */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs uppercase tracking-wider">Compliance</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <span className="hover:text-brand-gold cursor-pointer transition-colors">
                  {t.common.terms}
                </span>
              </li>
              <li>
                <span className="hover:text-brand-gold cursor-pointer transition-colors">
                  {t.common.privacy}
                </span>
              </li>
              <li>
                <span className="hover:text-brand-gold cursor-pointer transition-colors">
                  Política AML / KYC
                </span>
              </li>
              <li>
                <span className="text-brand-gold hover:underline cursor-pointer">
                  Autoexclusión y Límites
                </span>
              </li>
              <li>
                <span className="hover:text-brand-gold cursor-pointer transition-colors">
                  Auditoría de Algoritmos (RNG)
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <p>© 2026 NEW BRAND. {t.common.allRightsReserved}</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-400">Jurisdicción: {market === 'MX' ? 'México' : 'Haïti'}</span>
            <span>·</span>
            <span className="text-slate-400">Idioma: {locale.toUpperCase()}</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

