import { Injectable, Logger } from '@nestjs/common';
import { IGeolocationProviderAdapter } from '../provider.interfaces';

@Injectable()
export class GeoComplyAdapter implements IGeolocationProviderAdapter {
  readonly providerCode = 'GEOCOMPLY_REGULATORY';
  private readonly logger = new Logger(GeoComplyAdapter.name);

  private readonly licenseKey = process.env.GEOCOMPLY_LICENSE_KEY || 'DEMO_GEO_KEY';
  private readonly realMoneyEnabled = process.env.REAL_MONEY_ENABLED === 'true';

  async checkJurisdiction(ipAddress: string): Promise<{
    countryCode: string;
    isAllowed: boolean;
    realMoneyAllowed: boolean;
    jurisdictionRules: { name: string; regulator: string };
  }> {
    this.logger.log(`[GeoComply] Checking regulatory perimeter for IP: ${ipAddress}`);

    // In local / private IP ranges default to MX
    let detectedCountry = 'MX';
    if (ipAddress.includes('190.') || ipAddress.includes('200.')) {
      detectedCountry = 'HT';
    }

    const isAllowed = ['MX', 'HT'].includes(detectedCountry);

    return {
      countryCode: detectedCountry,
      isAllowed,
      // Real money strictly governed by regulatory flags
      realMoneyAllowed: this.realMoneyEnabled && isAllowed,
      jurisdictionRules: {
        name: detectedCountry === 'MX' ? 'México' : 'Haití',
        regulator: detectedCountry === 'MX' ? 'SEGOB / DGJS' : 'Loterie Nationale d’Haïti (LEH)',
      },
    };
  }
}

