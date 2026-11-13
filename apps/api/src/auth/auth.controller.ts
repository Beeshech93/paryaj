import { Controller, Post, Get, Body, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { AuthResponseDto } from './dto/auth-response.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CurrentUser } from './decorators/current-user.decorator';

@ApiTags('Authentication & Sessions')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registro de nuevo usuario con billetera demo y doble partida contable',
    description:
      'Registra al usuario, crea su perfil, aprovisiona la cuenta de billetera demo con 10,000 créditos e inserta el asiento contable inmutable.',
  })
  @ApiResponse({ status: 201, description: 'Usuario registrado exitosamente', type: AuthResponseDto })
  @ApiResponse({ status: 400, description: 'Datos de validación inválidos o menor de edad' })
  @ApiResponse({ status: 409, description: 'El correo electrónico ya se encuentra registrado' })
  async register(@Body() dto: RegisterDto): Promise<AuthResponseDto> {
    return this.authService.register(dto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Inicio de sesión y obtención de token Bearer JWT',
    description: 'Valida credenciales, genera token JWT con roles RBAC y registra el acceso en AuditLog.',
  })
  @ApiResponse({ status: 200, description: 'Autenticación exitosa', type: AuthResponseDto })
  @ApiResponse({ status: 401, description: 'Credenciales inválidas o cuenta inactiva' })
  async login(@Body() dto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(dto);
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Perfil del usuario autenticado',
    description: 'Retorna datos del perfil, balance de la billetera demo, estado de verificación KYC y límites.',
  })
  @ApiResponse({ status: 200, description: 'Perfil recuperado con éxito' })
  @ApiResponse({ status: 401, description: 'No autorizado o token expirado' })
  async getProfile(@CurrentUser() user: any) {
    return this.authService.getProfile(user.userId);
  }
}

