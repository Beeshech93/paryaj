export interface GameSession {
  sessionId: string;
  gameId: string;
  userId: string;
  currency: string;
  mode: 'DEMO' | 'REAL_BLOCKED';
  launchUrl: string;
  createdAt: Date;
}

export interface GameRoundResult {
  roundId: string;
  betAmount: number;
  multiplier: number;
  payoutAmount: number;
  netWin: number;
  provablyFair: {
    serverSeed: string;
    clientSeed: string;
    nonce: number;
    hash: string;
  };
  details: Record<string, any>;
}

export interface ICasinoProviderAdapter {
  providerCode: string;
  providerName: string;
  isLive: boolean;

  createSession(userId: string, gameId: string, currency: string): Promise<GameSession>;
  playRound(sessionId: string, betAmount: number, params?: Record<string, any>): Promise<GameRoundResult>;
}

export interface ILiveCasinoProviderAdapter {
  providerCode: string;
  listLiveTables(): Promise<Array<{ id: string; name: string; gameType: string; minBet: number; maxBet: number; isOnline: boolean }>>;
  connectTableSession(userId: string, tableId: string): Promise<{ streamUrl: string; token: string }>;
}

export interface ISportsDataProviderAdapter {
  providerCode: string;
  fetchFixtures(sport: string, market: string): Promise<any[]>;
  fetchOdds(eventId: string): Promise<any>;
}

export interface IPaymentProviderAdapter {
  providerCode: string;
  processSimulatedDeposit(walletId: string, amount: number, currency: string): Promise<{ txId: string; status: string }>;
  processSimulatedWithdrawal(walletId: string, amount: number, destination: string): Promise<{ txId: string; status: string }>;
}

export interface IKYCProviderAdapter {
  providerCode: string;
  verifyDocument(userId: string, docType: string, docUrl: string): Promise<{ verified: boolean; confidence: number; riskLevel: string }>;
}

export interface IGeolocationProviderAdapter {
  providerCode: string;
  checkJurisdiction(ipAddress: string): Promise<{ countryCode: string; isAllowed: boolean; realMoneyAllowed: boolean }>;
}

