'use client';

import React from 'react';
import { AppProvider } from '@/lib/i18n/context';
import { Header } from '@/components/Header';
import { SportTreeArena } from '@/components/SportTreeArena';
import { Footer } from '@/components/Footer';
import { BetSlipDrawer } from '@/components/BetSlipDrawer';
import { AuthModal } from '@/components/AuthModal';
import { WalletModal } from '@/components/WalletModal';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';

export default function SportTreePage() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-[#070b0f] text-slate-100 flex flex-col justify-between selection:bg-[#10b981] selection:text-black">
        <Header />
        <main className="flex-1">
          <SportTreeArena />
        </main>
        <Footer />
        <BetSlipDrawer />
        <AuthModal />
        <WalletModal />
        <WhatsAppWidget />
      </div>
    </AppProvider>
  );
}
