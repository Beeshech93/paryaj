import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, Min, Max, IsOptional, IsString } from 'class-validator';

export class PlayRoundDto {
  @ApiProperty({ example: 50.0, description: 'Importe de la apuesta en créditos demo' })
  @IsNumber()
  @Min(1.0, { message: 'La apuesta mínima es de 1 crédito demo' })
  @Max(10000.0, { message: 'La apuesta máxima por tirada es de 10,000 créditos demo' })
  betAmount: number;

  @ApiProperty({ example: 'custom-client-seed', required: false, description: 'Semilla del cliente para verificación Provably Fair' })
  @IsOptional()
  @IsString()
  clientSeed?: string;
}

