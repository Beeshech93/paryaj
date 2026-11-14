export type Locale = 'es' | 'fr';
export type Market = 'MX' | 'HT';

export interface Translations {
  common: {
    demoBadge: string;
    realMoneyDisabled: string;
    prodBadge: string;
    prodMessage: string;
    login: string;
    register: string;
    demoBalance: string;
    realBalance: string;
    switchToProd: string;
    switchToDemo: string;
    playDemo: string;
    viewOdds: string;
    popular: string;
    live: string;
    odds: string;
    stake: string;
    payout: string;
    placeBet: string;
    responsibleGaming18: string;
    terms: string;
    privacy: string;
    help: string;
    allRightsReserved: string;
  };
  nav: {
    casino: string;
    sportsbook: string;
    liveCasino: string;
    fastGames: string;
    promotions: string;
    responsibleGaming: string;
  };
  hero: {
    tag: string;
    title: string;
    titleHighlight: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
    disclaimer: string;
  };
  casino: {
    title: string;
    subtitle: string;
    all: string;
    slots: string;
    roulette: string;
    blackjack: string;
    crash: string;
    jackpots: string;
    liveTables: string;
  };
  sports: {
    title: string;
    subtitle: string;
    football: string;
    basketball: string;
    baseball: string;
    tennis: string;
    esports: string;
    liveNow: string;
    upcoming: string;
  };
  events: {
    title: string;
    subtitle: string;
    match1: { comp: string; home: string; away: string; time: string };
    match2: { comp: string; home: string; away: string; time: string };
    match3: { comp: string; home: string; away: string; time: string };
    match4: { comp: string; home: string; away: string; time: string };
  };
  promotions: {
    title: string;
    subtitle: string;
    promo1Title: string;
    promo1Desc: string;
    promo2Title: string;
    promo2Desc: string;
    promo3Title: string;
    promo3Desc: string;
    claimBtn: string;
  };
  benefits: {
    title: string;
    subtitle: string;
    b1Title: string;
    b1Desc: string;
    b2Title: string;
    b2Desc: string;
    b3Title: string;
    b3Desc: string;
    b4Title: string;
    b4Desc: string;
  };
  footer: {
    disclaimer: string;
    legalMx: string;
    legalHt: string;
    navigation: string;
    legal: string;
    support: string;
    responsibleNotice: string;
  };
  betSlip: {
    title: string;
    empty: string;
    selection: string;
    single: string;
    potentialWin: string;
    clear: string;
    betSuccess: string;
  };
}

export const translations: Record<Locale, Translations> = {
  es: {
    common: {
      demoBadge: 'MODO PRODUCCIÓN',
      realMoneyDisabled: 'Dinero real habilitado conforme a regulación SEGOB (MX) / LEH (HT)',
      prodBadge: '🟢 PRODUCCIÓN',
      prodMessage: 'Ambiente en Producción — Dinero Real y Boletos Oficiales Habilitados',
      login: 'Iniciar Sesión',
      register: 'Registrarse',
      demoBalance: 'Saldo',
      realBalance: 'Saldo Real',
      switchToProd: 'Modo Producción',
      switchToDemo: 'Modo Producción',
      playDemo: 'Jugar Real',
      viewOdds: 'Ver Cuotas',
      popular: 'Popular',
      live: 'EN VIVO',
      odds: 'Cuota',
      stake: 'Importe',
      payout: 'Ganancia Est.',
      placeBet: 'Emitir Apuesta',
      responsibleGaming18: '+18 Años | Juega con Responsabilidad',
      terms: 'Términos y Condiciones',
      privacy: 'Aviso de Privacidad',
      help: 'Centro de Ayuda',
      allRightsReserved: 'Todos los derechos reservados.',
    },
    nav: {
      casino: 'Casino',
      sportsbook: 'Deportes',
      liveCasino: 'Casino en Vivo',
      fastGames: 'Juegos Rápidos',
      promotions: 'Promociones',
      responsibleGaming: 'Juego Responsable',
    },
    hero: {
      tag: 'ENTRETENIMIENTO REGULADO MULTI-MERCADO',
      title: 'La Nueva Generación de',
      titleHighlight: 'Casino & Deportes Digitales',
      description:
        'Experimenta la emoción con saldo demostrativo inmutable, cuotas deportivas en tiempo real y el catálogo más moderno para México y Haití.',
      ctaPrimary: 'Explorar Casino Demo',
      ctaSecondary: 'Ver Apuestas Deportivas',
      disclaimer: 'Operación simulada con fines de prueba y demostración técnica regulatoria.',
    },
    casino: {
      title: 'Juegos de Casino Destacados',
      subtitle: 'Títulos certificados con adaptadores de proveedores en modo demo.',
      all: 'Todos los Juegos',
      slots: 'Tragamonedas / Slots',
      roulette: 'Ruletas',
      blackjack: 'Blackjack',
      crash: 'Crash Games',
      jackpots: 'Jackpots Progresivos',
      liveTables: 'Mesas en Vivo',
    },
    sports: {
      title: 'Sportsbook & Apuestas en Vivo',
      subtitle: 'Cuotas dinámicas y cobertura de las mejores ligas del mundo.',
      football: 'Fútbol',
      basketball: 'Baloncesto',
      baseball: 'Béisbol',
      tennis: 'Tenis',
      esports: 'eSports',
      liveNow: 'En Vivo Ahora',
      upcoming: 'Próximos Eventos',
    },
    events: {
      title: 'Eventos Destacados',
      subtitle: 'Selecciona tus pronósticos y prueba el cupón de apuestas simulado.',
      match1: { comp: 'Liga MX · México', home: 'América', away: 'Guadalajara', time: 'Hoy 20:00' },
      match2: { comp: 'UEFA Champions League', home: 'Real Madrid', away: 'Manchester City', time: 'Mañana 14:00' },
      match3: { comp: 'Concacaf Nations League', home: 'Haití', away: 'Jamaica', time: 'Vie 18:30' },
      match4: { comp: 'NBA · Regular Season', home: 'Lakers', away: 'Warriors', time: 'Hoy 21:30' },
    },
    promotions: {
      title: 'Promociones & Bonos Demo',
      subtitle: 'Multiplica tu experiencia con nuestros paquetes promocionales simulados.',
      promo1Title: 'Bono de Bienvenida Demo',
      promo1Desc: 'Recibe 10,000 fichas demo con tu registro inicial para probar el catálogo.',
      promo2Title: 'Multiplicador Parlay +30%',
      promo2Desc: 'Combina 4 o más selecciones deportivas y potencia tu retorno simulado.',
      promo3Title: 'Cashback Semanal 10%',
      promo3Desc: 'Reembolso automático demo sobre pérdidas netas de la semana en tragamonedas.',
      claimBtn: 'Activar Bono Demo',
    },
    benefits: {
      title: '¿Por qué elegir NEW BRAND?',
      subtitle: 'Construido con tecnología moderna, seguridad inmutable y juego responsable.',
      b1Title: 'Ledger Inmutable de Doble Partida',
      b1Desc: 'Registro contable criptográfico para cada tirada, apuesta y movimiento demo.',
      b2Title: 'Cumplimiento Regulatorio MX & HT',
      b2Desc: 'Configuraciones geográficas y regulatorias independientes para México y Haití.',
      b3Title: 'Velocidad de Carga Instantánea',
      b3Desc: 'Arquitectura Next.js y NestJS optimizada para latencias mínimas y alta concurrencia.',
      b4Title: 'Juego Responsable y Seguro',
      b4Desc: 'Herramientas de autoexclusión, límites de tiempo y saldo para proteger a los usuarios.',
    },
    footer: {
      disclaimer:
        'NEW BRAND es una plataforma de software de entretenimiento regulado en fase de desarrollo técnico. Las transacciones monetarias reales se encuentran estrictamente deshabilitadas hasta la acreditación de las licencias de la Dirección General de Juegos y Sorteos (SEGOB, México) y de la Loterie de l’État Haïtien (LEH, Haití).',
      legalMx: 'Cumplimiento Ley Federal de Juegos y Sorteos (México)',
      legalHt: 'Conformité Réglementaire Haïtienne (LEH)',
      navigation: 'Navegación',
      legal: 'Marco Legal',
      support: 'Atención al Cliente',
      responsibleNotice: 'El juego en exceso causa adicción. Queda prohibida la participación de menores de edad.',
    },
    betSlip: {
      title: 'Cupón de Apuestas Demo',
      empty: 'Selecciona una cuota para armar tu cupón',
      selection: 'Selección',
      single: 'Apuesta Simple',
      potentialWin: 'Ganancia Potencial Demo',
      clear: 'Limpiar Cupón',
      betSuccess: '¡Apuesta demo registrada en el Ledger!',
    },
  },
  fr: {
    common: {
      demoBadge: 'MODE PRODUCTION',
      realMoneyDisabled: 'Argent réel activé selon réglementation SEGOB (MX) / LEH (HT)',
      prodBadge: '🟢 EN PRODUCTION',
      prodMessage: 'Environnement de Production — Billetterie Officielle et Paris Réels Activés',
      login: 'Connexion',
      register: "S'inscrire",
      demoBalance: 'Solde',
      realBalance: 'Solde Réel',
      switchToProd: 'Mode Production',
      switchToDemo: 'Mode Production',
      playDemo: 'Jouer Réel',
      viewOdds: 'Voir les Cotes',
      popular: 'Populaire',
      live: 'EN DIRECT',
      odds: 'Cote',
      stake: 'Mise',
      payout: 'Gain Estimé',
      placeBet: 'Valider le Pari',
      responsibleGaming18: '+18 Ans | Jouez de Manière Responsable',
      terms: 'Termes et Conditions',
      privacy: 'Politique de Confidentialité',
      help: "Centre d'Aide",
      allRightsReserved: 'Tous droits réservés.',
    },
    nav: {
      casino: 'Casino',
      sportsbook: 'Paris Sportifs',
      liveCasino: 'Casino en Direct',
      fastGames: 'Jeux Rapides',
      promotions: 'Promotions',
      responsibleGaming: 'Jeu Responsable',
    },
    hero: {
      tag: 'DIVERTISSEMENT RÉGLEMENTÉ MULTI-MARCHÉ',
      title: 'La Nouvelle Génération de',
      titleHighlight: 'Casino & Paris Sportifs Digitaux',
      description:
        'Découvrez le frisson avec un solde de démonstration immuable, des cotes sportives en direct et le catalogue de jeux le plus moderne pour le Mexique et Haïti.',
      ctaPrimary: 'Explorer le Casino Démo',
      ctaSecondary: 'Voir les Paris Sportifs',
      disclaimer: 'Opération simulée à des fins de test technique et de démonstration réglementaire.',
    },
    casino: {
      title: 'Jeux de Casino en Vedette',
      subtitle: 'Titres certifiés avec adaptateurs de fournisseurs en mode démonstration.',
      all: 'Tous les Jeux',
      slots: 'Machines à Sous',
      roulette: 'Roulette',
      blackjack: 'Blackjack',
      crash: 'Jeux Crash',
      jackpots: 'Jackpots Progressifs',
      liveTables: 'Tables en Direct',
    },
    sports: {
      title: 'Paris Sportifs & Direct',
      subtitle: 'Cotes dynamiques et couverture des plus grands championnats mondiaux.',
      football: 'Football',
      basketball: 'Basketball',
      baseball: 'Baseball',
      tennis: 'Tennis',
      esports: 'eSports',
      liveNow: 'En Direct Maintenant',
      upcoming: 'Événements à Venir',
    },
    events: {
      title: 'Événements à la Une',
      subtitle: 'Choisissez vos pronostics et essayez notre coupon de pari simulé.',
      match1: { comp: 'Liga MX · Mexique', home: 'América', away: 'Guadalajara', time: "Aujourd'hui 20:00" },
      match2: { comp: 'UEFA Champions League', home: 'Real Madrid', away: 'Manchester City', time: 'Demain 14:00' },
      match3: { comp: 'Concacaf Nations League', home: 'Haïti', away: 'Jamaïque', time: 'Ven 18:30' },
      match4: { comp: 'NBA · Saison Régulière', home: 'Lakers', away: 'Warriors', time: "Aujourd'hui 21:30" },
    },
    promotions: {
      title: 'Promotions & Bonus Démo',
      subtitle: 'Multipliez votre expérience avec nos formules promotionnelles simulées.',
      promo1Title: 'Bonus de Bienvenue Démo',
      promo1Desc: 'Recevez 10 000 jetons démo lors de votre inscription pour tester le catalogue.',
      promo2Title: 'Multiplicateur Combiné +30%',
      promo2Desc: 'Combinez 4 sélections sportives ou plus et boostez votre gain simulé.',
      promo3Title: 'Cashback Hebdomadaire 10%',
      promo3Desc: 'Remboursement automatique démo sur les pertes nettes de la semaine.',
      claimBtn: 'Activer le Bonus Démo',
    },
    benefits: {
      title: 'Pourquoi Choisir NEW BRAND ?',
      subtitle: 'Construit avec des technologies de pointe, sécurité immuable et jeu responsable.',
      b1Title: 'Grand Livre Immuable en Partie Double',
      b1Desc: 'Enregistrement cryptographique pour chaque tour de jeu et pari démo.',
      b2Title: 'Conformité Réglementaire MX & HT',
      b2Desc: 'Configurations géographiques et juridictionnelles indépendantes pour le Mexique et Haïti.',
      b3Title: 'Vitesse de Chargement Éclair',
      b3Desc: 'Architecture Next.js et NestJS optimisée pour une latence minimale et haute concurrence.',
      b4Title: 'Jeu Responsable et Protégé',
      b4Desc: "Outils d'auto-exclusion, limites de temps et de solde pour la protection des joueurs.",
    },
    footer: {
      disclaimer:
        "NEW BRAND est une plateforme logicielle de divertissement réglementé en phase de développement technique. Les opérations d'argent réel sont strictement désactivées jusqu'à obtention des autorisations des autorités compétentes (SEGOB au Mexique, Loterie de l'État Haïtien LEH en Haïti).",
      legalMx: 'Conformité Réglementaire Mexicaine (SEGOB)',
      legalHt: "Conformité Loterie de l'État Haïtien (LEH)",
      navigation: 'Navigation',
      legal: 'Cadre Légal',
      support: 'Service Client',
      responsibleNotice: "Les jeux d'argent comportent des risques. Interdit aux moins de 18 ans.",
    },
    betSlip: {
      title: 'Coupon de Pari Démo',
      empty: 'Sélectionnez une cote pour composer votre coupon',
      selection: 'Sélection',
      single: 'Pari Simple',
      potentialWin: 'Gain Potentiel Démo',
      clear: 'Vider le Coupon',
      betSuccess: 'Pari démo enregistré avec succès dans le Grand Livre !',
    },
  },
};

