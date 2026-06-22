import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';
import { GoogleStrategy } from './strategies/google.strategy';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';

@Module({
  imports: [PassportModule, JwtModule.register({})],
  controllers: [AuthController],
  providers: [
    AuthService,
    GoogleStrategy,
    JwtAccessStrategy,
    GoogleAuthGuard,
    JwtAccessGuard,
  ],
})
export class AuthModule {}
