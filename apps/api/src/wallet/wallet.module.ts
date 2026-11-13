import { Module } from '@nestjs/common';
import { WalletService } from './wallet.service';
import { WalletController } from './wallet.controller';
import { WalletWebhookController } from './wallet-webhook.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { ProvidersModule } from '../providers/providers.module';

@Module({
  imports: [PrismaModule, ProvidersModule],
  controllers: [WalletController, WalletWebhookController],
  providers: [WalletService],
  exports: [WalletService],
})
export class WalletModule {}

