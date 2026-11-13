import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class WalletHistoryQueryDto {
  @ApiPropertyOptional({ example: 1 })
  @IsOptional()
  page?: number;

  @ApiPropertyOptional({ example: 20 })
  @IsOptional()
  limit?: number;

  @ApiPropertyOptional({
    example: 'DEMO_DEPOSIT',
    description: 'Filtrar por tipo de transacción (DEMO_DEPOSIT, DEMO_WITHDRAWAL, DEMO_BET_PLACED, DEMO_CASINO_ROUND)',
  })
  @IsOptional()
  @IsString()
  transactionType?: string;
}

