'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useApp } from '@/lib/i18n/context';
import {
  ShieldAlert,
  Coins,
  RefreshCw,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Dices,
  Trophy,
  Flame,
  Sparkles,
  Gift,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    t,
    locale,
    setLocale,
    market,
    setMarket,
    demoBalance,
    resetDemoBalance,
    isRealMode,
    setIsRealMode,
    realBalance,
    openWallet,
    user,
    openAuth,
    logoutUser,
    isBetSlipOpen,
    setIsBetSlipOpen,
    betSelections,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const [marketDropdownOpen, setMarketDropdownOpen] = useState(false);

  const currencySymbol = market === 'MX' ? 'MXN' : 'HTG';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-brand-navyLight bg-brand-navy/95 backdrop-blur-md">
      {/* Top Regulatory Warning Bar */}
      <div className="bg-brand-dark/90 border-b border-slate-800/80 px-4 py-1.5 text-xs text-slate-400">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            {isRealMode ? (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-bold text-emerald-400 border border-emerald-500/50 shadow-sm shadow-emerald-500/20">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                {t.common.prodBadge}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 rounded bg-yellow-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-brand-gold border border-brand-gold/30">
                <ShieldAlert className="w-3 h-3 text-brand-gold" />
                {t.common.demoBadge}
              </span>
            )}
            <span className="hidden sm:inline text-slate-300 font-medium text-[11px]">
              {isRealMode ? t.common.prodMessage : t.common.realMoneyDisabled}
            </span>

            {/* Mode Switcher Pill */}
            <button
              onClick={() => setIsRealMode(!isRealMode)}
              className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold transition-all border border-brand-navyLight hover:border-brand-gold bg-brand-navy/80 hover:bg-brand-navyLight text-slate-300 hover:text-white"
              title="Alternar entre Producción (Real) y Simulación Demo"
            >
              <span>{isRealMode ? '🎮 ' + t.common.switchToDemo : '⚡ ' + t.common.switchToProd}</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-[11px]">
            <span className="text-slate-400 hidden md:inline">{t.common.responsibleGaming18}</span>

            {/* Market Switcher */}
            <div className="relative">
              <button
                onClick={() => setMarketDropdownOpen(!marketDropdownOpen)}
                className="flex items-center gap-1 hover:text-brand-gold transition-colors text-slate-300 font-medium"
              >
                <span>{market === 'MX' ? '🇲🇽 México' : '🇭🇹 Haïti'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {marketDropdownOpen && (
                <div className="absolute right-0 mt-1 w-32 rounded-lg bg-brand-card border border-brand-navyLight shadow-xl py-1 z-50">
                  <button
                    onClick={() => {
                      setMarket('MX');
                      setMarketDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-brand-navyLight text-xs flex items-center justify-between ${
                      market === 'MX' ? 'text-brand-gold font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>🇲🇽 México</span>
                    {market === 'MX' && <span className="text-brand-gold text-[10px]">●</span>}
                  </button>
                  <button
                    onClick={() => {
                      setMarket('HT');
                      setMarketDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-brand-navyLight text-xs flex items-center justify-between ${
                      market === 'HT' ? 'text-brand-gold font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>🇭🇹 Haïti</span>
                    {market === 'HT' && <span className="text-brand-gold text-[10px]">●</span>}
                  </button>
                </div>
              )}
            </div>

            {/* Language Switcher */}
            <div className="relative">
              <button
                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                className="flex items-center gap-1 hover:text-brand-gold transition-colors text-slate-300 font-medium uppercase"
              >
                <span>{locale === 'es' ? 'ES' : 'FR'}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>
              {langDropdownOpen && (
                <div className="absolute right-0 mt-1 w-28 rounded-lg bg-brand-card border border-brand-navyLight shadow-xl py-1 z-50">
                  <button
                    onClick={() => {
                      setLocale('es');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-brand-navyLight text-xs flex items-center justify-between ${
                      locale === 'es' ? 'text-brand-gold font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>Español</span>
                    {locale === 'es' && <span className="text-brand-gold text-[10px]">●</span>}
                  </button>
                  <button
                    onClick={() => {
                      setLocale('fr');
                      setLangDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 hover:bg-brand-navyLight text-xs flex items-center justify-between ${
                      locale === 'fr' ? 'text-brand-gold font-bold' : 'text-slate-300'
                    }`}
                  >
                    <span>Français</span>
                    {locale === 'fr' && <span className="text-brand-gold text-[10px]">●</span>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-gold via-yellow-400 to-amber-200 flex items-center justify-center font-black text-black text-2xl shadow-lg shadow-brand-gold/25 group-hover:scale-105 transition-transform">
              N
              <span className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-brand-positive border-2 border-brand-dark"></span>
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black tracking-wider text-white flex items-center gap-1">
                NEW <span className="text-brand-gold">BRAND</span>
              </span>
              <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium">
                Regulated Gaming
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1">
            <Link
              href="#casino"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-gold hover:bg-brand-navyLight/60 transition-colors"
            >
              <Dices className="w-4 h-4 text-brand-gold" />
              {t.nav.casino}
            </Link>
            <Link
              href="#sportsbook"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-gold hover:bg-brand-navyLight/60 transition-colors"
            >
              <Trophy className="w-4 h-4 text-brand-gold" />
              {t.nav.sportsbook}
            </Link>
            <Link
              href="#live-casino"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-gold hover:bg-brand-navyLight/60 transition-colors"
            >
              <Flame className="w-4 h-4 text-brand-positive" />
              {t.nav.liveCasino}
            </Link>
            <Link
              href="#fast-games"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-gold hover:bg-brand-navyLight/60 transition-colors"
            >
              <Sparkles className="w-4 h-4 text-yellow-300" />
              {t.nav.fastGames}
            </Link>
            <Link
              href="#promotions"
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold text-slate-200 hover:text-brand-gold hover:bg-brand-navyLight/60 transition-colors"
            >
              <Gift className="w-4 h-4 text-brand-gold" />
              {t.nav.promotions}
            </Link>
          </nav>
        </div>

        {/* Right Actions: Demo Balance, Bet Slip & User Auth */}
        <div className="flex items-center gap-3">
          {/* Balance Display (Real or Demo) */}
          <div className="hidden sm:flex items-center gap-2 bg-brand-dark/90 border border-brand-navyLight px-3 py-1.5 rounded-lg">
            <Coins className={`w-4 h-4 ${isRealMode ? 'text-emerald-400' : 'text-brand-gold'}`} />
            <div className="flex flex-col text-right">
              <span className="text-[10px] text-slate-400 font-mono leading-none">
                {isRealMode ? t.common.realBalance : t.common.demoBalance}
              </span>
              <span className={`text-sm font-mono font-bold ${isRealMode ? 'text-emerald-400' : 'text-brand-positive'}`}>
                ${(isRealMode ? realBalance : demoBalance).toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
            </div>
            {isRealMode ? (
              <button
                onClick={() => openWallet('deposit')}
                title="Depositar fondos en cuenta de producción"
                className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500 hover:bg-emerald-400 text-black transition-colors"
              >
                + Recargar
              </button>
            ) : (
              <button
                onClick={resetDemoBalance}
                title="Recargar saldo demo a $10,000"
                className="p-1 rounded hover:bg-brand-navyLight text-slate-400 hover:text-white transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Bet Slip Trigger */}
          <button
            onClick={() => setIsBetSlipOpen(!isBetSlipOpen)}
            className="relative px-3 py-2 rounded-lg bg-brand-navyLight border border-brand-gold/30 hover:border-brand-gold text-slate-200 text-sm font-semibold flex items-center gap-2 transition-colors"
          >
            <Trophy className="w-4 h-4 text-brand-gold" />
            <span className="hidden md:inline">{t.betSlip.title}</span>
            {betSelections.length > 0 && (
              <span className="h-5 w-5 rounded-full bg-brand-gold text-black font-black text-xs flex items-center justify-center">
                {betSelections.length}
              </span>
            )}
          </button>

          {/* User Auth Buttons or Profile */}
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden md:flex flex-col text-right">
                <span className="text-xs font-semibold text-white">{user.name}</span>
                <span className="text-[10px] text-brand-positive">● Verificado</span>
              </div>
              <button
                onClick={logoutUser}
                title="Cerrar sesión"
                className="p-2 rounded-lg bg-brand-navyLight border border-slate-700 text-slate-300 hover:text-white hover:border-red-500 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => openAuth('login')}
                className="px-3.5 py-2 rounded-lg text-sm font-bold text-slate-200 hover:text-white hover:bg-brand-navyLight/70 transition-colors flex items-center gap-1.5"
              >
                <User className="w-4 h-4 text-slate-400" />
                <span className="hidden sm:inline">{t.common.login}</span>
              </button>
              <button
                onClick={() => openAuth('register')}
                className="px-4 py-2 rounded-lg text-sm font-black bg-gradient-to-r from-brand-gold via-yellow-400 to-amber-300 text-black hover:brightness-110 shadow-lg shadow-brand-gold/20 transition-all"
              >
                {t.common.register}
              </button>
            </div>
          )}

          {/* Mobile Menu Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 rounded-lg bg-brand-navyLight text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-brand-dark/95 border-b border-brand-navyLight px-4 py-6 space-y-4">
          <div className="sm:hidden flex items-center justify-between p-3 rounded-lg bg-brand-navy border border-brand-navyLight">
            <div className="flex items-center gap-2">
              <Coins className="w-4 h-4 text-brand-gold" />
              <span className="text-xs text-slate-300">{t.common.demoBalance}:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-mono font-bold text-brand-positive">
                ${demoBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })} {currencySymbol}
              </span>
              <button onClick={resetDemoBalance} className="p-1 rounded bg-brand-navyLight text-slate-300">
                <RefreshCw className="w-3 h-3" />
              </button>
            </div>
          </div>

          <nav className="flex flex-col space-y-2">
            <Link
              href="#casino"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-brand-navyLight font-semibold text-sm"
            >
              <Dices className="w-5 h-5 text-brand-gold" />
              {t.nav.casino}
            </Link>
            <Link
              href="#sportsbook"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-brand-navyLight font-semibold text-sm"
            >
              <Trophy className="w-5 h-5 text-brand-gold" />
              {t.nav.sportsbook}
            </Link>
            <Link
              href="#live-casino"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-brand-navyLight font-semibold text-sm"
            >
              <Flame className="w-5 h-5 text-brand-positive" />
              {t.nav.liveCasino}
            </Link>
            <Link
              href="#fast-games"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-brand-navyLight font-semibold text-sm"
            >
              <Sparkles className="w-5 h-5 text-yellow-300" />
              {t.nav.fastGames}
            </Link>
            <Link
              href="#promotions"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-slate-200 hover:bg-brand-navyLight font-semibold text-sm"
            >
              <Gift className="w-4 h-4 text-brand-gold" />
              {t.nav.promotions}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

