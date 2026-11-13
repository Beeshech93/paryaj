import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class DepositDemoDto {
  @ApiProperty({ example: 5000.0, description: 'Monto de la recarga demo' })
  @IsNumber()
  @Min(100.0, { message: 'El monto mínimo de recarga es de $100.00 créditos demo' })
  @Max(100000.0, { message: 'El monto máximo por recarga es de $100,000.00 créditos demo' })
  amount: number;

  @ApiProperty({
    example: 'IDEMP-DEP-1731512345-ABC',
    description: 'Clave de idempotencia única para garantizar que no se dupliquen transacciones financieras',
  })
  @IsString()
  @IsNotEmpty({ message: 'La clave de idempotencia es requerida' })
  idempotencyKey: string;

  @ApiProperty({
    example: 'SIMULATED_SPEI_MX',
    description: 'Método de pago simulado (SPEI para México, MonCash para Haití, Tarjeta Demo)',
    required: false,
  })
  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @ApiProperty({
    example: 'MXN',
    description: 'Código ISO de la divisa (MXN o HTG)',
    required: false,
  })
  @IsOptional()
  @IsString()
  currency?: string;
}

