import { Module } from '@nestjs/common';
import { DummyAdminLoginUseCase } from './application/dummy-admin-login.use-case';
import { AuthController } from './interfaces/http/auth.controller';

@Module({
  controllers: [AuthController],
  providers: [DummyAdminLoginUseCase],
})
export class AuthModule {}
