'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/i18n/context';
import {
  Coins,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Gift,
  Tv,
  BarChart2,
  Radio,
  Flame,
  Store,
  Wallet,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    locale,
    setLocale,
    market,
    setMarket,
    isRealMode,
    realBalance,
    openWallet,
    user,
    openAuth,
    logoutUser,
    isBetSlipOpen,
    setIsBetSlipOpen,
    betSelections,
  } = useApp();

  const [currentTime, setCurrentTime] = useState<string>('16:33:55 GMT-5');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string>('deportes');

  // Real-time Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      setCurrentTime(`${hours}:${minutes}:${seconds} GMT-5`);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';
  const currencySign = market === 'MX' ? '$' : 'G';

  const menuItems = [
    { id: 'deportes', label: 'DEPORTES', href: '#sportsbook' },
    { id: 'en-vivo', label: 'EN VIVO', href: '#featured-events', isLive: true },
    { id: 'esports', label: 'E-SPORTS', href: '#esports' },
    { id: 'tragamonedas', label: 'TRAGAMONEDAS', href: '#casino' },
    { id: 'casino-en-vivo', label: 'CASINO EN VIVO', href: '#live-casino' },
    { id: 'juegos-tv', label: 'JUEGOS TV', href: '#fast-games' },
    { id: 'deportes-virtuales', label: 'DEPORTES VIRTUALES', href: '#virtuals' },
    { id: 'fast-games', label: 'FAST GAMES', href: '#fast-games' },
    { id: 'blackjack', label: 'BLACKJACK', href: '#casino', isNew: true },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#121920] border-b border-[#1f2933] shadow-xl font-sans">
      {/* 1. TOP HEADER BAR */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Left: Brand Logo + Clock + Promo Button + Utility Icons */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#10b981] to-[#047857] flex items-center justify-center text-black font-black shadow-md shadow-emerald-500/30 group-hover:scale-105 transition-transform">
              <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-black" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
              </svg>
            </div>
            <div className="flex items-center tracking-tight">
              <span className="text-xl sm:text-2xl font-black text-white italic tracking-wider">
                paryaj <span className="text-[#10b981]">milyon</span>
              </span>
            </div>
          </Link>

          {/* Clock & Timezone */}
          <div className="hidden md:flex items-center text-xs font-mono text-slate-400 bg-[#0e141a] px-2.5 py-1 rounded border border-slate-800">
            <span>{currentTime}</span>
          </div>

          {/* Promociones Pill */}
          <Link
            href="#promo-cards"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded bg-[#162925] border border-[#10b981]/40 text-[#10b981] text-xs font-bold uppercase hover:bg-[#10b981] hover:text-black transition-all"
          >
            <Gift className="w-3.5 h-3.5" />
            <span>PROMOCIONES</span>
          </Link>

          {/* Utility Icons */}
          <div className="hidden lg:flex items-center gap-2 text-slate-400">
            <a
              href="#featured-events"
              className="p-1.5 rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              title="Marcador en Vivo"
            >
              <Tv className="w-4 h-4" />
            </a>
            <a
              href="#sportsbook"
              className="p-1.5 rounded hover:bg-slate-800 hover:text-emerald-400 transition-colors"
              title="Estadísticas de Cuotas"
            >
              <BarChart2 className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Right: Auth, Wallet, Language & POS Terminal */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Market Switcher */}
          <div className="relative">
            <button
              onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
              className="flex items-center gap-1 bg-[#1a232c] hover:bg-[#222e3a] border border-slate-700/80 px-2.5 py-1.5 rounded-lg text-xs font-bold text-slate-200 transition-all"
            >
              <span>{market === 'MX' ? '🇲🇽 MXN' : '🇭🇹 HTG'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {marketDropdownOpen && (
              <div className="absolute right-0 mt-1 w-32 rounded-lg bg-[#161f28] border border-slate-700 shadow-2xl py-1 z-50">
                <button
                  onClick={() => {
                    setMarket('MX');
                    setMarketDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 text-xs flex items-center justify-between ${
                    market === 'MX' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>🇲🇽 México (MXN)</span>
                </button>
                <button
                  onClick={() => {
                    setMarket('HT');
                    setMarketDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 hover:bg-slate-800 text-xs flex items-center justify-between ${
                    market === 'HT' ? 'text-emerald-400 font-bold' : 'text-slate-300'
                  }`}
                >
                  <span>🇭🇹 Haïti (HTG)</span>
                </button>
              </div>
            )}
          </div>

          {/* User Auth Buttons or User Balance */}
          {user ? (
            <div className="flex items-center gap-2 bg-[#162029] border border-slate-700/80 px-3 py-1 rounded-lg">
              <button
                onClick={() => openWallet('deposit')}
                className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
              >
                <Coins className="w-4 h-4 text-emerald-400" />
                <span className="font-mono font-black text-xs text-white">
                  {currencySign} {realBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                </span>
              </button>
              <button
                onClick={logoutUser}
                className="ml-2 p-1 text-slate-400 hover:text-rose-400 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              {/* REGISTRAR BUTTON (Bright Green) */}
              <button
                onClick={() => openAuth('register')}
                className="bg-[#10b981] hover:bg-[#059669] text-black font-black uppercase text-xs tracking-wider px-4 sm:px-5 py-2 rounded-lg shadow-md shadow-emerald-500/25 transition-all active:scale-95"
              >
                REGISTRAR
              </button>

              {/* INICIO SESIÓN BUTTON (Dark Slate) */}
              <button
                onClick={() => openAuth('login')}
                className="bg-[#1e293b] hover:bg-[#334155] text-white font-bold uppercase text-xs tracking-wider px-3 sm:px-4 py-2 rounded-lg border border-slate-700 transition-all active:scale-95"
              >
                INICIO SESIÓN
              </button>
            </div>
          )}

          {/* Language Selector */}
          <div className="relative">
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1 bg-[#1a232c] hover:bg-[#222e3a] border border-slate-700/80 px-2 py-1.5 rounded-lg text-xs font-bold text-slate-300 uppercase transition-all"
            >
              <span>{locale === 'es' ? 'ES' : 'FR'}</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </button>
            {langDropdownOpen && (
              <div className="absolute right-0 mt-1 w-24 rounded-lg bg-[#161f28] border border-slate-700 shadow-2xl py-1 z-50">
                <button
                  onClick={() => {
                    setLocale('es');
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-xs text-slate-300 hover:text-emerald-400 font-bold"
                >
                  Español
                </button>
                <button
                  onClick={() => {
                    setLocale('fr');
                    setLangDropdownOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-slate-800 text-xs text-slate-300 hover:text-emerald-400 font-bold"
                >
                  Français
                </button>
              </div>
            )}
          </div>

          {/* POS Terminal Shortcut */}
          <Link
            href="/pos"
            className="hidden xl:flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11px] font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-black transition-all"
            title="Terminal Punto de Venta Retail"
          >
            <Store className="w-3.5 h-3.5" />
            <span>POS</span>
          </Link>

          {/* Bet Slip Trigger */}
          <button
            onClick={() => setIsBetSlipOpen(!isBetSlipOpen)}
            className="relative p-2 rounded-lg bg-[#1a232c] hover:bg-[#222e3a] border border-slate-700 text-slate-200"
            title="Boleto de Apuestas"
          >
            <Coins className="w-4 h-4 text-emerald-400" />
            {betSelections.length > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#10b981] text-black font-black text-[10px] flex items-center justify-center animate-bounce">
                {betSelections.length}
              </span>
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-[#1a232c] text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* 2. SUB-HEADER CATEGORY RIBBON (Clean, uppercase, matching Tinbet) */}
      <div className="bg-[#162029] border-t border-[#1f2b37] overflow-x-auto no-scrollbar">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-1 sm:gap-2 h-11 text-xs font-extrabold whitespace-nowrap">
          {menuItems.map((item) => {
            const isActive = activeMenu === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveMenu(item.id)}
                className={`relative px-3.5 py-2.5 tracking-wider uppercase transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'text-[#10b981] border-b-2 border-[#10b981]'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                {item.isLive && (
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-ping inline-block" />
                )}
                <span>{item.label}</span>
                {item.isNew && (
                  <span className="absolute -top-1 right-1 bg-[#10b981] text-black text-[8px] font-black px-1.5 py-0.2 rounded-full uppercase shadow-sm">
                    NEW
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#121920] border-t border-slate-800 px-4 py-4 space-y-2">
          {menuItems.map((item) => (
            <a
              key={item.id}
              href={item.href}
              onClick={() => {
                setActiveMenu(item.id);
                setMobileMenuOpen(false);
              }}
              className="flex items-center justify-between py-2 text-sm font-bold text-slate-200 hover:text-emerald-400 border-b border-slate-800/50"
            >
              <span>{item.label}</span>
              {item.isNew && (
                <span className="bg-[#10b981] text-black text-[9px] font-black px-2 py-0.5 rounded-full">
                  NEW
                </span>
              )}
            </a>
          ))}
          <Link
            href="/pos"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center gap-2 py-2.5 text-sm font-bold text-emerald-400"
          >
            <Store className="w-4 h-4" />
            <span>Terminal POS Retail (Cajero Físico)</span>
          </Link>
        </div>
      )}
    </header>
  );
};
