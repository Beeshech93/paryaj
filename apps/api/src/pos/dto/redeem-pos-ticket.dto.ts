import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class RedeemPosTicketDto {
  @ApiProperty({ example: 'TK-2026-98124', description: 'Número de boleto o código de barras escaneado' })
  @IsString()
  @IsNotEmpty()
  ticketNumber: string;

  @ApiProperty({ example: 'TERM-01', description: 'Terminal donde se paga el premio' })
  @IsString()
  @IsNotEmpty()
  terminalCode: string;

  @ApiProperty({ example: 'Juan Pérez (Cajero 1)' })
  @IsString()
  @IsNotEmpty()
  cashierName: string;
}
