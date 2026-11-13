import { ApiProperty } from '@nestjs/swagger';

export class UserSummaryDto {
  @ApiProperty({ example: '3fa85f64-5717-4562-b3fc-2c963f66afa6' })
  id: string;

  @ApiProperty({ example: 'jugador@ejemplo.com' })
  email: string;

  @ApiProperty({ example: 'Juan Pérez' })
  name: string;

  @ApiProperty({ example: 'PLAYER' })
  role: string;

  @ApiProperty({ example: 'MX' })
  country: string;

  @ApiProperty({ example: 10000.0 })
  demoBalance: number;

  @ApiProperty({ example: true })
  isActive: boolean;
}

export class AuthResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...', description: 'Token de acceso JWT Bearer' })
  accessToken: string;

  @ApiProperty({ example: 'bearer', description: 'Tipo de token de autenticación' })
  tokenType: string;

  @ApiProperty({ example: 86400, description: 'Tiempo de expiración en segundos' })
  expiresIn: number;

  @ApiProperty({ type: UserSummaryDto, description: 'Perfil y estado de la cuenta de usuario' })
  user: UserSummaryDto;
}

