import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export class SportsQueryDto {
  @ApiPropertyOptional({ example: 'futbol', description: 'Filtrar por slug de disciplina deportiva' })
  @IsOptional()
  @IsString()
  sport?: string;

  @ApiPropertyOptional({ example: 'comp-liga-mx', description: 'Filtrar por ID de competición' })
  @IsOptional()
  @IsString()
  competitionId?: string;

  @ApiPropertyOptional({ example: 'MX', description: 'Filtrar por código de país (MX o HT)' })
  @IsOptional()
  @IsString()
  countryCode?: string;

  @ApiPropertyOptional({ example: true, description: 'Filtrar eventos que se encuentran en vivo' })
  @IsOptional()
  @Transform(({ value }) => value === 'true' || value === true)
  @IsBoolean()
  isLive?: boolean;
}

