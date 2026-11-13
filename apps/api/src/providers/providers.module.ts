import { Module } from '@nestjs/common';
import { InternalRngAdapter } from './adapters/internal-rng.adapter';
import { PragmaticMockAdapter } from './adapters/pragmatic-mock.adapter';
import { EvolutionLiveMockAdapter } from './adapters/evolution-live-mock.adapter';
import { PragmaticPlayRealAdapter } from './adapters/pragmatic-real.adapter';
import { EvolutionGamingRealAdapter } from './adapters/evolution-real.adapter';
import { TheOddsApiAdapter } from './adapters/the-odds-api.adapter';
import { StpSpeiMexicoAdapter } from './adapters/stp-spei-mexico.adapter';
import { MonCashHaitiAdapter } from './adapters/moncash-haiti.adapter';
import { SportradarFeedAdapter } from './adapters/sportradar-feed.adapter';
import { SumsubKycAdapter } from './adapters/sumsub-kyc.adapter';
import { GeoComplyAdapter } from './adapters/geocomply.adapter';
import { ProviderRegistryService } from './provider-registry.service';

@Module({
  providers: [
    InternalRngAdapter,
    PragmaticMockAdapter,
    EvolutionLiveMockAdapter,
    PragmaticPlayRealAdapter,
    EvolutionGamingRealAdapter,
    TheOddsApiAdapter,
    StpSpeiMexicoAdapter,
    MonCashHaitiAdapter,
    SportradarFeedAdapter,
    SumsubKycAdapter,
    GeoComplyAdapter,
    ProviderRegistryService,
  ],
  exports: [
    ProviderRegistryService,
    PragmaticPlayRealAdapter,
    EvolutionGamingRealAdapter,
    TheOddsApiAdapter,
    StpSpeiMexicoAdapter,
    MonCashHaitiAdapter,
    SportradarFeedAdapter,
    SumsubKycAdapter,
    GeoComplyAdapter,
  ],
})
export class ProvidersModule {}

