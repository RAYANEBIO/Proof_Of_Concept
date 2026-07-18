import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register-auth.dto';
import { loginDto } from './dto/login-auth.dto';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto);
  }
  @Post('login')
  @HttpCode(HttpStatus.OK) // Renvoie un code 200 au lieu de 201 (création)
  login(@Body() dto: loginDto) {
    return this.authService.login(dto);
  }
}
