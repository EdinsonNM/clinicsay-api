import { Body, Controller, Post } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { DummyAdminLoginUseCase } from '../../application/dummy-admin-login.use-case';
import { LoginRequestDto, LoginResponseDto } from './dto/login.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: DummyAdminLoginUseCase) {}

  @Post('login')
  @ApiOkResponse({ type: LoginResponseDto })
  @ApiBadRequestResponse({ description: 'Solicitud invalida' })
  @ApiUnauthorizedResponse({ description: 'Credenciales dummy invalidas' })
  login(@Body() body: LoginRequestDto): LoginResponseDto {
    return this.loginUseCase.execute(body.username, body.password);
  }
}
