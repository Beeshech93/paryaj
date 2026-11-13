import { ApiProperty } from '@nestjs/swagger';
import {
  IsNumber,
  IsString,
  IsNotEmpty,
  IsArray,
  ValidateNested,
  Min,
  Max,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';

export class PosTicketSelectionDto {
  @ApiProperty({ example: 'evt_123' })
  @IsString()
  @IsNotEmpty()
  eventId: string;

  @ApiProperty({ example: 'América vs Chivas' })
  @IsString()
  @IsNotEmpty()
  eventName: string;

  @ApiProperty({ example: '1X2' })
  @IsString()
  @IsNotEmpty()
  marketName: string;

  @ApiProperty({ example: 'Club América' })
  @IsString()
  @IsNotEmpty()
  selection: string;

  @ApiProperty({ example: 1.85 })
  @IsNumber()
  @Min(1.01)
  odds: number;
}

export class CreatePosTicketDto {
  @ApiProperty({ example: 'TERM-01', description: 'Código de la terminal física del cajero' })
  @IsString()
  @IsNotEmpty()
  terminalCode: string;

  @ApiProperty({ example: 200.0, description: 'Importe pagado en efectivo en ventanilla' })
  @IsNumber()
  @Min(10.0, { message: 'El importe mínimo en punto de venta es de $10' })
  @Max(50000.0, { message: 'El importe máximo en efectivo por boleto es de $50,000' })
  stake: number;

  @ApiProperty({ example: 'MXN', enum: ['MXN', 'HTG'] })
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ type: [PosTicketSelectionDto], description: 'Pronósticos deportivos seleccionados' })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PosTicketSelectionDto)
  selections: PosTicketSelectionDto[];
}
