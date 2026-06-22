import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { AuthResponse, GoogleIdentity, TokenPayload } from './auth.types';
import { GoogleAuthGuard } from './guards/google-auth.guard';
import { JwtAccessGuard } from './guards/jwt-access.guard';

type RequestWithCookies = Omit<Request, 'cookies'> & {
  cookies?: Record<string, string | undefined>;
};

interface GoogleCallbackRequest extends Request {
  user?: GoogleIdentity;
}

interface AuthenticatedRequest extends Request {
  user: TokenPayload;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('google')
  @UseGuards(GoogleAuthGuard)
  googleLogin(): void {}

  @Get('google/callback')
  @UseGuards(GoogleAuthGuard)
  async googleCallback(
    @Req() request: GoogleCallbackRequest,
    @Res() response: Response,
  ): Promise<void> {
    if (!request.user) {
      throw new UnauthorizedException('Google authentication failed');
    }

    const refreshToken = await this.authService.loginWithGoogle(request.user);

    response.cookie(
      this.authService.getRefreshCookieName(),
      refreshToken,
      this.authService.getRefreshCookieOptions(),
    );
    response.redirect(this.authService.getFrontendCallbackUrl());
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<AuthResponse> {
    const rawRefreshToken =
      request.cookies?.[this.authService.getRefreshCookieName()];

    if (!rawRefreshToken) {
      throw new UnauthorizedException('Refresh token cookie is missing');
    }

    try {
      const result = await this.authService.refresh(rawRefreshToken);

      response.cookie(
        this.authService.getRefreshCookieName(),
        result.refreshToken,
        this.authService.getRefreshCookieOptions(),
      );

      return result.auth;
    } catch (error) {
      response.clearCookie(
        this.authService.getRefreshCookieName(),
        this.authService.getRefreshCookieClearOptions(),
      );
      throw error;
    }
  }

  @Get('me')
  @UseGuards(JwtAccessGuard)
  getCurrentUser(@Req() request: AuthenticatedRequest) {
    return this.authService.getCurrentUser(request.user.sub);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() request: RequestWithCookies,
    @Res({ passthrough: true }) response: Response,
  ): Promise<{ success: true }> {
    const rawRefreshToken =
      request.cookies?.[this.authService.getRefreshCookieName()];

    await this.authService.logout(rawRefreshToken);
    response.clearCookie(
      this.authService.getRefreshCookieName(),
      this.authService.getRefreshCookieClearOptions(),
    );

    return { success: true };
  }
}
