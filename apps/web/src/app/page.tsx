'use client';

import React, { useState } from 'react';
import { AppProvider } from '@/lib/i18n/context';
import { Header } from '@/components/Header';
import { HeroBanner } from '@/components/HeroBanner';
import { ProductCategoryBar } from '@/components/ProductCategoryBar';
import { PromoCardsGrid } from '@/components/PromoCardsGrid';
import { SportsbookArena } from '@/components/SportsbookArena';
import { CasinoCategories } from '@/components/CasinoCategories';
import { PopularGames } from '@/components/PopularGames';
import { SportsSection } from '@/components/SportsSection';
import { FeaturedEvents } from '@/components/FeaturedEvents';
import { Promotions } from '@/components/Promotions';
import { PlatformBenefits } from '@/components/PlatformBenefits';
import { Footer } from '@/components/Footer';
import { BetSlipDrawer } from '@/components/BetSlipDrawer';
import { AuthModal } from '@/components/AuthModal';
import { WalletModal } from '@/components/WalletModal';
import { WhatsAppWidget } from '@/components/WhatsAppWidget';

function MainPlatform() {
  const [selectedCasinoCategory, setSelectedCasinoCategory] = useState<string>('all');
  const [selectedSport, setSelectedSport] = useState<string>('football');
  const [sportsTab, setSportsTab] = useState<'live' | 'upcoming'>('live');

  return (
    <div className="min-h-screen bg-[#0b1015] text-slate-100 flex flex-col justify-between selection:bg-[#10b981] selection:text-black">
      {/* 1. Header con logo, navegación y acceso a cuenta */}
      <Header />

      <main className="flex-1">
        {/* 2. Banner principal estilo Tinbet (GANA CON TU DEPORTE FAVORITO) */}
        <HeroBanner />

        {/* 3. Barra horizontal de 8 categorías de producto (Deportes, En Vivo, Tragamonedas, etc.) */}
        <ProductCategoryBar />

        {/* 4. Parrilla de 3 banners promocionales (Juegos Virtuales, E-Sports, Prueba tu Suerte) */}
        <PromoCardsGrid />

        {/* 5. Sportsbook Arena con Cuotas Reales en Vivo y Calculadora */}
        <SportsbookArena />

        {/* 6. Casino: Categorías y Juegos Populares */}
        <CasinoCategories
          selectedCategory={selectedCasinoCategory}
          onSelectCategory={setSelectedCasinoCategory}
        />
        <PopularGames selectedCategory={selectedCasinoCategory} />

        {/* 7. Eventos destacados por disciplina deportiva */}
        <SportsSection
          selectedSport={selectedSport}
          onSelectSport={setSelectedSport}
          activeTab={sportsTab}
          onSelectTab={setSportsTab}
        />
        <FeaturedEvents selectedSport={selectedSport} activeTab={sportsTab} />

        {/* 8. Promociones y Beneficios */}
        <Promotions />
        <PlatformBenefits />
      </main>

      {/* 9. Footer Oficial */}
      <Footer />

      {/* Floating Interactive Drawers and Widgets */}
      <BetSlipDrawer />
      <AuthModal />
      <WalletModal />
      <WhatsAppWidget />
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
