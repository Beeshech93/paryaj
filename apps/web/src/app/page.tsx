'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/lib/i18n/context';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { CasinoCategories } from '@/components/CasinoCategories';
import { PopularGames } from '@/components/PopularGames';
import { SportsSection } from '@/components/SportsSection';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { Promotions } from '@/components/Promotions';
import { PlatformBenefits } from '@/components/PlatformBenefits';
import { Footer } from '@/components/Footer';
import { BetSlipDrawer } from '@/components/BetSlipDrawer';
import { AuthModal } from '@/components/AuthModal';
import { SportsbookArena } from '@/components/SportsbookArena';
import { WalletModal } from '@/components/WalletModal';

function MainPlatform() {
  const [selectedCasinoCategory, setSelectedCasinoCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('football');
  const [sportsTab, setSportsTab] = useState<'live' | 'upcoming'>('live');

  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 flex flex-col justify-between selection:bg-brand-mint selection:text-black">
      {/* 1. Header con logo, navegación y acceso a cuenta */}
      <Header />

      <main className="flex-1">
        {/* 2. Banner principal */}
        <HeroBanner />

        {/* 3. Categorías de casino */}
        <CasinoCategories
          selectedCategory={selectedCasinoCategory}
          onSelectCategory={setSelectedCasinoCategory}
        />

        {/* 4. Juegos populares */}
        <PopularGames selectedCategory={selectedCasinoCategory} />

        {/* 5 & 6. Sportsbook Arena con Calculadora de Ganancias y Comparador de Cuotas (Diseño Oficial de Referencia) */}
        <SportsbookArena />

        {/* Eventos adicionales por disciplina deportiva */}
        <SportsSection
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          activeTab={sportsTab}
          onSelectTab={setSportsTab}
        />
        <FeaturedEvents selectedSport={selectedSport} activeTab={sportsTab} />

        {/* 7. Promociones */}
        <Promotions />

        {/* 8. Beneficios de la plataforma */}
        <PlatformBenefits />
      </main>

      {/* 9. Footer con información legal y soporte */}
      <Footer />

      {/* Floating Interactive Drawers and Modals */}
      <BetSlipDrawer />
      <AuthModal />
      <WalletModal />
    </div>
  );
}

export default function Page() {
  return (
    <AppProvider>
      <MainPlatform />
    </AppProvider>
  );
}
