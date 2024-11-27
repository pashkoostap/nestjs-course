import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './auth.dto';
import { AuthService } from './auth.service';
import { USER_ALREADY_EXISTS_ERROR } from './auth.constants';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UsePipes(new ValidationPipe())
  @Post('register')
  async register(@Body() dto: AuthDto) {
    const existingUser = await this.authService.findUser(dto.login);

    if (existingUser) {
      throw new BadRequestException(USER_ALREADY_EXISTS_ERROR);
    }

    return this.authService.createUser(dto);
  }

  @HttpCode(200)
  @Post('login')
  async login(@Body() dto: AuthDto) {
    const user = await this.authService.validateUser(dto.login, dto.password);

    return this.authService.login(user.email);
  }
}
