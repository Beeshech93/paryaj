import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting NEW BRAND Database Seed (Demo Data)...');

  // 1. Seed Countries (Markets)
  const mx = await prisma.country.upsert({
    where: { code: 'MX' },
    update: {},
    create: {
      code: 'MX',
      name: 'México',
      currency: 'MXN',
      defaultLocale: 'es',
      realMoneyAllowed: false, // Strictly false by default
      regulatoryBody: 'Dirección General de Juegos y Sorteos (SEGOB)',
      isActive: true,
    },
  });

  const ht = await prisma.country.upsert({
    where: { code: 'HT' },
    update: {},
    create: {
      code: 'HT',
      name: 'Haïti',
      currency: 'HTG',
      defaultLocale: 'fr',
      realMoneyAllowed: false, // Strictly false by default
      regulatoryBody: "Loterie de l'État Haïtien (LEH)",
      isActive: true,
    },
  });

  console.log('✅ Countries seeded: México (MX) & Haïti (HT)');

  // 2. Seed Roles & Permissions
  const superAdminRole = await prisma.role.upsert({
    where: { name: 'SUPER_ADMIN' },
    update: {},
    create: {
      name: 'SUPER_ADMIN',
      description: 'Super Administrador de Plataforma con privilegios globales y MFA obligatorio',
    },
  });

  const complianceRole = await prisma.role.upsert({
    where: { name: 'COMPLIANCE_OFFICER' },
    update: {},
    create: {
      name: 'COMPLIANCE_OFFICER',
      description: 'Oficial de Cumplimiento Regulatorio, AML/KYC y auditoría de juego responsable',
    },
  });

  const playerRole = await prisma.role.upsert({
    where: { name: 'PLAYER' },
    update: {},
    create: {
      name: 'PLAYER',
      description: 'Usuario jugador estándar en modalidad demo simulada',
    },
  });

  console.log('✅ Roles seeded: SUPER_ADMIN, COMPLIANCE_OFFICER, PLAYER');

  // 3. Seed Game Providers (Adapters)
  const providerOriginals = await prisma.gameProvider.upsert({
    where: { code: 'NEW_BRAND_STUDIOS' },
    update: {},
    create: {
      name: 'NEW BRAND Studios',
      code: 'NEW_BRAND_STUDIOS',
      adapterType: 'INTERNAL_RNG',
      isActive: true,
    },
  });

  const providerPragmatic = await prisma.gameProvider.upsert({
    where: { code: 'PRAGMATIC_DEMO_ADAPTER' },
    update: {},
    create: {
      name: 'Pragmatic Demo Adapter',
      code: 'PRAGMATIC_DEMO_ADAPTER',
      adapterType: 'MOCK_REST_ADAPTER',
      isActive: true,
    },
  });

  const providerEvolution = await prisma.gameProvider.upsert({
    where: { code: 'EVOLUTION_LIVE_ADAPTER' },
    update: {},
    create: {
      name: 'Evolution Live Adapter',
      code: 'EVOLUTION_LIVE_ADAPTER',
      adapterType: 'MOCK_REST_ADAPTER',
      isActive: true,
    },
  });

  // 4. Seed Games
  const games = [
    {
      title: 'Aztec Sunburst 1000',
      slug: 'aztec-sunburst-1000',
      category: 'slots',
      providerId: providerOriginals.id,
      rtp: 96.8,
      volatility: 'HIGH',
      isPopular: true,
      isNew: false,
    },
    {
      title: 'Aviator Horizon Crash',
      slug: 'aviator-horizon-crash',
      category: 'crash',
      providerId: providerOriginals.id,
      rtp: 97.0,
      volatility: 'HIGH',
      isPopular: true,
      isNew: true,
    },
    {
      title: 'Crown Roulette VIP',
      slug: 'crown-roulette-vip',
      category: 'roulette',
      providerId: providerEvolution.id,
      rtp: 97.3,
      volatility: 'MEDIUM',
      isPopular: true,
      isNew: false,
    },
    {
      title: 'Royal Platinum Blackjack',
      slug: 'royal-platinum-blackjack',
      category: 'blackjack',
      providerId: providerEvolution.id,
      rtp: 99.2,
      volatility: 'LOW',
      isPopular: false,
      isNew: false,
    },
    {
      title: 'Sugar Bonanza Sweet',
      slug: 'sugar-bonanza-sweet',
      category: 'slots',
      providerId: providerPragmatic.id,
      rtp: 96.5,
      volatility: 'HIGH',
      isPopular: true,
      isNew: true,
    },
  ];

  for (const game of games) {
    await prisma.game.upsert({
      where: { slug: game.slug },
      update: {},
      create: game,
    });
  }
  console.log(`✅ Seeded ${games.length} casino & digital games.`);

  // 5. Seed Sports, Competitions & Events
  const soccer = await prisma.sport.upsert({
    where: { slug: 'futbol' },
    update: {},
    create: {
      name: 'Fútbol',
      slug: 'futbol',
      icon: '⚽',
      isActive: true,
    },
  });

  const ligaMx = await prisma.competition.upsert({
    where: { id: 'comp-liga-mx' },
    update: {},
    create: {
      id: 'comp-liga-mx',
      sportId: soccer.id,
      countryId: mx.id,
      name: 'Liga MX (Clausura)',
      slug: 'liga-mx',
      isActive: true,
    },
  });

  // Seed Event
  const event1 = await prisma.event.upsert({
    where: { id: 'evt-america-chivas' },
    update: {},
    create: {
      id: 'evt-america-chivas',
      competitionId: ligaMx.id,
      homeTeam: 'Club América',
      awayTeam: 'Guadalajara Chivas',
      status: 'LIVE',
      scheduledStart: new Date(),
      homeScore: 1,
      awayScore: 0,
      minute: "68'",
    },
  });

  // Seed 1X2 Market & Odds
  const market1 = await prisma.market.upsert({
    where: { id: 'mkt-1x2-evt-1' },
    update: {},
    create: {
      id: 'mkt-1x2-evt-1',
      eventId: event1.id,
      name: '1X2 (Resultado Final)',
      status: 'OPEN',
    },
  });

  await prisma.oddsSnapshot.createMany({
    data: [
      { marketId: market1.id, selection: '1', odds: 1.65, probability: 0.606 },
      { marketId: market1.id, selection: 'X', odds: 3.40, probability: 0.294 },
      { marketId: market1.id, selection: '2', odds: 4.80, probability: 0.208 },
    ],
    skipDuplicates: true,
  });

  console.log('✅ Seeded Sports, Competitions, Events and OddsSnapshots.');

  // 6. Seed Inmutable Financial Ledger Master Accounts
  const ledgerAccounts = [
    { code: 'HOUSE_REVENUE', accountType: 'REVENUE', currency: 'MXN' },
    { code: 'BONUS_EXPENSE', accountType: 'EXPENSE', currency: 'MXN' },
    { code: 'PLAYER_DEMO_LIABILITY', accountType: 'LIABILITY', currency: 'MXN' },
  ];

  for (const acc of ledgerAccounts) {
    await prisma.ledgerAccount.upsert({
      where: { code: acc.code },
      update: {},
      create: acc,
    });
  }
  console.log('✅ Seeded Ledger Accounts for Double-Entry Accounting.');

  // 7. Seed Promotions
  const promotions = [
    {
      title: 'Bono de Bienvenida Demo',
      slug: 'bono-bienvenida-demo',
      description: 'Recibe 10,000 créditos demo con tu registro inicial para probar el catálogo.',
      promoType: 'WELCOME_BONUS',
      bonusAmount: 10000.0,
      wageringRequirement: 1,
      startsAt: new Date(),
    },
    {
      title: 'Multiplicador Parlay +30%',
      slug: 'multiplicador-parlay-30',
      description: 'Combina 4 o más selecciones deportivas y potencia tu retorno simulado.',
      promoType: 'PARLAY_BOOST',
      bonusAmount: 2500.0,
      wageringRequirement: 1,
      startsAt: new Date(),
    },
  ];

  for (const promo of promotions) {
    await prisma.promotion.upsert({
      where: { slug: promo.slug },
      update: {},
      create: promo,
    });
  }

  console.log('✅ Seeded Promotions.');
  console.log('🎉 Database seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('Error during database seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

