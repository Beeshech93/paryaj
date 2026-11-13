import { Module } from '@nestjs/common';
import { CasinoService } from './casino.service';
import { CasinoController } from './casino.controller';
import { CasinoCallbackController } from './casino-callback.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProvidersModule } from '../providers/providers.module';
import { WalletModule } from '../wallet/wallet.module';

@Module({
  imports: [PrismaModule, ProvidersModule, WalletModule],
  controllers: [CasinoController, CasinoCallbackController],
  providers: [CasinoService],
  exports: [CasinoService],
})
export class CasinoModule {}

