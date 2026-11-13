import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsNotEmpty, Min, Max, IsOptional } from 'class-validator';

export class WithdrawDemoDto {
  @ApiProperty({ example: 2500.0, description: 'Monto del retiro simulado' })
  @IsNumber()
  @Min(100.0, { message: 'El monto mínimo de retiro es de $100.00 créditos demo' })
  @Max(100000.0, { message: 'El monto máximo por retiro es de $100,000.00 créditos demo' })
  amount: number;

  @ApiProperty({
    example: 'IDEMP-WTH-1731512345-XYZ',
    description: 'Clave de idempotencia única para garantizar que no se dupliquen retiros',
  })
  @IsString()
  @IsNotEmpty({ message: 'La clave de idempotencia es requerida' })
  idempotencyKey: string;

  @ApiProperty({
    example: 'CLABE: 012180001234567890 (Simulada)',
    description: 'Cuenta de destino simulada para la trazabilidad',
    required: false,
  })
  @IsOptional()
  @IsString()
  destinationAccount?: string;
}

