import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'jugador@ejemplo.com', description: 'Correo electrónico registrado' })
  @IsEmail({}, { message: 'Formato de correo electrónico inválido' })
  email: string;

  @ApiProperty({ example: 'ContrasenaSegura123!', description: 'Contraseña de la cuenta' })
  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  password: string;
}

