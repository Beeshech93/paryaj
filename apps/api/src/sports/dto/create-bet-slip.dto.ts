import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  Min,
  ValidateNested,
  ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

export class BetSelectionDto {
  @ApiProperty({ example: 'evt-america-chivas', description: 'ID único del evento deportivo' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ example: 'mkt-1x2-evt-1', description: 'ID del mercado (1X2, Over/Under, etc.)' })
  @IsString()
  @IsNotEmpty()
  marketId: string;

  @ApiProperty({ example: '1', description: 'Selección del pronóstico (1, X, 2, OVER, etc.)' })
  @IsString()
  @IsNotEmpty()
  selection: string;

  @ApiProperty({ example: 1.65, description: 'Cuota decimal ofrecida al momento de armar el cupón' })
  @IsNumber()
  @Min(1.01, { message: 'La cuota mínima admisible es 1.01' })
  odds: number;
}

export class CreateBetSlipDto {
  @ApiProperty({
    example: 'PARLAY',
    enum: ['SINGLE', 'PARLAY'],
    description: 'Tipo de cupón: SINGLE (apuesta simple) o PARLAY (combinada acumulada)',
  })
  @IsEnum(['SINGLE', 'PARLAY'], { message: 'El tipo de cupón debe ser SINGLE o PARLAY' })
  slipType: 'SINGLE' | 'PARLAY';

  @ApiProperty({ example: 250.0, description: 'Importe de la apuesta en créditos demo' })
  @IsNumber()
  @Min(10.0, { message: 'El importe mínimo para una apuesta demo es de 10.0 créditos' })
  stake: number;

  @ApiProperty({ type: [BetSelectionDto], description: 'Lista de selecciones que componen el cupón' })
  @IsArray()
  @ArrayMinSize(1, { message: 'El cupón debe contener al menos 1 selección' })
  @ValidateNested({ each: true })
  @Type(() => BetSelectionDto)
  selections: BetSelectionDto[];
}

