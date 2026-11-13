'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, Market, translations, Translations } from './translations';

export interface BetSelection {
  id: string;
  eventId: string;
  eventName: string;
  marketName: string;
  pickName: string;
  odds: number;
}

interface UserProfile {
  name: string;
  email: string;
  isVerified: boolean;
  country: Market;
}

interface AppContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  market: Market;
  setMarket: (market: Market) => void;
  t: Translations;
  demoBalance: number;
  updateDemoBalance: (delta: number) => boolean;
  resetDemoBalance: () => void;
  isRealMode: boolean;
  setIsRealMode: (real: boolean) => void;
  realBalance: number;
  updateRealBalance: (delta: number) => boolean;
  betSelections: BetSelection[];
  addBetSelection: (bet: BetSelection) => void;
  removeBetSelection: (id: string) => void;
  clearBetSelections: () => void;
  isBetSlipOpen: boolean;
  setIsBetSlipOpen: (open: boolean) => void;
  authModalOpen: boolean;
  authMode: 'login' | 'register';
  openAuth: (mode: 'login' | 'register') => void;
  closeAuth: () => void;
  walletModalOpen: boolean;
  walletMode: 'deposit' | 'withdraw' | 'history';
  openWallet: (mode?: 'deposit' | 'withdraw' | 'history') => void;
  closeWallet: () => void;
  user: UserProfile | null;
  loginUser: (email: string, name?: string) => void;
  logoutUser: () => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('es');
  const [market, setMarketState] = useState<Market>('MX');
  const [isRealMode, setIsRealModeState] = useState<boolean>(true);
  const [realBalance, setRealBalance] = useState<number>(2500.0);
  const [demoBalance, setDemoBalance] = useState<number>(10000.0);
  const [betSelections, setBetSelections] = useState<BetSelection[]>([]);
  const [isBetSlipOpen, setIsBetSlipOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [walletModalOpen, setWalletModalOpen] = useState<boolean>(false);
  const [walletMode, setWalletMode] = useState<'deposit' | 'withdraw' | 'history'>('deposit');
  const [user, setUser] = useState<UserProfile | null>(null);

  // Load preferences from localStorage if client-side
  useEffect(() => {
    try {
      const savedLocale = localStorage.getItem('nb_locale') as Locale;
      if (savedLocale === 'es' || savedLocale === 'fr') {
        setLocaleState(savedLocale);
      }
      const savedMarket = localStorage.getItem('nb_market') as Market;
      if (savedMarket === 'MX' || savedMarket === 'HT') {
        setMarketState(savedMarket);
      }
      const savedBalance = localStorage.getItem('nb_demo_balance');
      if (savedBalance) {
        setDemoBalance(parseFloat(savedBalance));
      }
      const savedRealBal = localStorage.getItem('nb_real_balance');
      if (savedRealBal) {
        setRealBalance(parseFloat(savedRealBal));
      }
      const savedMode = localStorage.getItem('nb_operating_mode');
      if (savedMode === 'demo') {
        setIsRealModeState(false);
      } else {
        setIsRealModeState(true);
      }
      const savedUser = localStorage.getItem('nb_user');
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch {
      // Ignore storage errors on SSR or private modes
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    try {
      localStorage.setItem('nb_locale', newLocale);
    } catch {}
  };

  const setMarket = (newMarket: Market) => {
    setMarketState(newMarket);
    // Suggest language switch if matching standard market
    if (newMarket === 'HT' && locale === 'es') {
      setLocale('fr');
    } else if (newMarket === 'MX' && locale === 'fr') {
      setLocale('es');
    }
    try {
      localStorage.setItem('nb_market', newMarket);
    } catch {}
  };

  const updateDemoBalance = (delta: number): boolean => {
    if (demoBalance + delta < 0) return false;
    const newBal = Math.round((demoBalance + delta) * 100) / 100;
    setDemoBalance(newBal);
    try {
      localStorage.setItem('nb_demo_balance', newBal.toString());
    } catch {}
    return true;
  };

  const resetDemoBalance = () => {
    setDemoBalance(10000.0);
    try {
      localStorage.setItem('nb_demo_balance', '10000');
    } catch {}
  };

  const setIsRealMode = (real: boolean) => {
    setIsRealModeState(real);
    try {
      localStorage.setItem('nb_operating_mode', real ? 'real' : 'demo');
    } catch {}
  };

  const updateRealBalance = (delta: number): boolean => {
    if (realBalance + delta < 0) return false;
    const newBal = Math.round((realBalance + delta) * 100) / 100;
    setRealBalance(newBal);
    try {
      localStorage.setItem('nb_real_balance', newBal.toString());
    } catch {}
    return true;
  };

  const addBetSelection = (bet: BetSelection) => {
    setBetSelections((prev) => {
      // Replace if same event or add new
      const filtered = prev.filter((b) => b.id !== bet.id && b.eventId !== bet.eventId);
      return [...filtered, bet];
    });
    setIsBetSlipOpen(true);
  };

  const removeBetSelection = (id: string) => {
    setBetSelections((prev) => prev.filter((b) => b.id !== id));
  };

  const clearBetSelections = () => {
    setBetSelections([]);
  };

  const openAuth = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const closeAuth = () => {
    setAuthModalOpen(false);
  };

  const openWallet = (mode: 'deposit' | 'withdraw' | 'history' = 'deposit') => {
    setWalletMode(mode);
    setWalletModalOpen(true);
  };

  const closeWallet = () => {
    setWalletModalOpen(false);
  };

  const loginUser = (email: string, name?: string) => {
    const profile: UserProfile = {
      email,
      name: name || email.split('@')[0],
      isVerified: true,
      country: market,
    };
    setUser(profile);
    try {
      localStorage.setItem('nb_user', JSON.stringify(profile));
    } catch {}
    closeAuth();
  };

  const logoutUser = () => {
    setUser(null);
    try {
      localStorage.removeItem('nb_user');
    } catch {}
  };

  const t = translations[locale];

  return (
    <AppContext.Provider
      value={{
        locale,
        setLocale,
        market,
        setMarket,
        t,
        demoBalance,
        updateDemoBalance,
        resetDemoBalance,
        isRealMode,
        setIsRealMode,
        realBalance,
        updateRealBalance,
        betSelections,
        addBetSelection,
        removeBetSelection,
        clearBetSelections,
        isBetSlipOpen,
        setIsBetSlipOpen,
        authModalOpen,
        authMode,
        openAuth,
        closeAuth,
        walletModalOpen,
        walletMode,
        openWallet,
        closeWallet,
        user,
        loginUser,
        logoutUser,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}

