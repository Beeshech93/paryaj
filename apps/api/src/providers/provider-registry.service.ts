import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ICasinoProviderAdapter,
  IPaymentProviderAdapter,
  ISportsDataProviderAdapter,
  IKYCProviderAdapter,
  IGeolocationProviderAdapter,
} from './provider.interfaces';
import { InternalRngAdapter } from './adapters/internal-rng.adapter';
import { PragmaticMockAdapter } from './adapters/pragmatic-mock.adapter';
import { EvolutionLiveMockAdapter } from './adapters/evolution-live-mock.adapter';
import { StpSpeiMexicoAdapter } from './adapters/stp-spei-mexico.adapter';
import { MonCashHaitiAdapter } from './adapters/moncash-haiti.adapter';
import { SportradarFeedAdapter } from './adapters/sportradar-feed.adapter';
import { SumsubKycAdapter } from './adapters/sumsub-kyc.adapter';
import { GeoComplyAdapter } from './adapters/geocomply.adapter';

@Injectable()
export class ProviderRegistryService {
  private readonly adapters = new Map<string, ICasinoProviderAdapter>();
  private readonly paymentAdapters = new Map<string, IPaymentProviderAdapter>();

  constructor(
    private readonly internalRng: InternalRngAdapter,
    private readonly pragmaticMock: PragmaticMockAdapter,
    private readonly evolutionMock: EvolutionLiveMockAdapter,
    private readonly stpMexico: StpSpeiMexicoAdapter,
    private readonly moncashHaiti: MonCashHaitiAdapter,
    readonly sportsFeed: SportradarFeedAdapter,
    readonly kycProvider: SumsubKycAdapter,
    readonly geoProvider: GeoComplyAdapter,
  ) {
    this.register(this.internalRng);
    this.register(this.pragmaticMock);
    this.register(this.evolutionMock);

    this.paymentAdapters.set(this.stpMexico.providerCode, this.stpMexico);
    this.paymentAdapters.set(this.moncashHaiti.providerCode, this.moncashHaiti);
  }

  register(adapter: ICasinoProviderAdapter) {
    this.adapters.set(adapter.providerCode, adapter);
  }

  getAdapter(providerCode: string): ICasinoProviderAdapter {
    const adapter = this.adapters.get(providerCode);
    if (!adapter) {
      // Default to Internal RNG if provider adapter not directly found
      return this.internalRng;
    }
    return adapter;
  }

  getPaymentAdapter(providerCode: string): IPaymentProviderAdapter | undefined {
    return this.paymentAdapters.get(providerCode);
  }

  listProviders() {
    return [
      ...Array.from(this.adapters.values()).map((a) => ({
        type: 'CASINO_GAMING',
        code: a.providerCode,
        name: a.providerName,
        isLive: a.isLive,
        status: 'CERTIFIED_ACTIVE',
      })),
      ...Array.from(this.paymentAdapters.values()).map((p) => ({
        type: 'PAYMENT_GATEWAY',
        code: p.providerCode,
        name: p.providerCode === 'STP_SPEI_MEXICO' ? 'STP SPEI (México)' : 'MonCash Digicel (Haití)',
        isLive: false,
        status: 'PRODUCTION_INTEGRATION_READY',
      })),
      {
        type: 'SPORTS_ODDS_FEED',
        code: this.sportsFeed.providerCode,
        name: 'Sportradar Unified Odds Feed (UOF)',
        isLive: false,
        status: 'PRODUCTION_INTEGRATION_READY',
      },
      {
        type: 'KYC_AML_VERIFICATION',
        code: this.kycProvider.providerCode,
        name: 'Sumsub Identity & AML Verification',
        isLive: false,
        status: 'PRODUCTION_INTEGRATION_READY',
      },
      {
        type: 'GEOLOCATION_COMPLIANCE',
        code: this.geoProvider.providerCode,
        name: 'GeoComply Regulatory Geofencing',
        isLive: false,
        status: 'PRODUCTION_INTEGRATION_READY',
      },
    ];
  }
}

