import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { HealthModule } from './health/health.module';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { AdminModule } from './admin/admin.module';
import { ProvidersModule } from './providers/providers.module';
import { CasinoModule } from './casino/casino.module';
import { SportsModule } from './sports/sports.module';
import { WalletModule } from './wallet/wallet.module';
import { PromotionsModule } from './promotions/promotions.module';
import { AffiliatesModule } from './affiliates/affiliates.module';
import { ReportsModule } from './reports/reports.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env', '../../.env'],
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 120,
      },
    ]),
    HealthModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    AdminModule,
    ProvidersModule,
    CasinoModule,
    SportsModule,
    WalletModule,
    PromotionsModule,
    AffiliatesModule,
    ReportsModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}

