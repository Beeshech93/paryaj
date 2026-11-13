import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, IsIn, IsBoolean } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'jugador@ejemplo.com', description: 'Correo electrónico del usuario' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  email: string;

  @ApiProperty({ example: 'ContrasenaSegura123!', description: 'Contraseña del usuario (mínimo 6 caracteres)' })
  @IsString()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @ApiProperty({ example: 'Juan Pérez', description: 'Nombre completo del usuario', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ example: 'MX', description: 'Código de país/jurisdicción (MX o HT)', enum: ['MX', 'HT'] })
  @IsString()
  @IsIn(['MX', 'HT'], { message: 'Jurisdicción no soportada. Debe ser MX o HT.' })
  countryCode: string;

  @ApiProperty({ example: true, description: 'Confirmación de mayoría de edad legal (+18)' })
  @IsBoolean()
  ageConfirmed: boolean;

  @ApiProperty({ example: true, description: 'Aceptación de Términos y Condiciones y Juego Responsable' })
  @IsBoolean()
  termsAccepted: boolean;
}

