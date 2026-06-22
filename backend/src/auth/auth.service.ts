import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHmac, randomUUID, timingSafeEqual } from 'node:crypto';
import type { CookieOptions } from 'express';
import { appConfig } from '../config/app.config';
import { authConfig } from '../config/auth.config';
import { PrismaService } from '../prisma/prisma.service';
import {
  AuthResponse,
  GoogleIdentity,
  SafeUser,
  safeUserSelect,
  TokenPayload,
} from './auth.types';
import { tokenDurationToSeconds } from './token-duration';

@Injectable()
export class AuthService {
  private readonly accessSecret: string;
  private readonly refreshSecret: string;
  private readonly accessExpiresInSeconds: number;
  private readonly refreshExpiresInSeconds: number;
  private readonly refreshCookieName: string;
  private readonly frontendCallbackUrl: string;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject(authConfig.KEY)
    private readonly authConfiguration: ConfigType<typeof authConfig>,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>,
  ) {
    this.accessSecret = authConfiguration.jwt.accessSecret;
    this.refreshSecret = authConfiguration.jwt.refreshSecret;
    this.accessExpiresInSeconds = tokenDurationToSeconds(
      authConfiguration.jwt.accessExpiresIn,
    );
    this.refreshExpiresInSeconds = tokenDurationToSeconds(
      authConfiguration.jwt.refreshExpiresIn,
    );
    this.refreshCookieName = authConfiguration.refreshCookieName;
    this.frontendCallbackUrl = authConfiguration.frontendCallbackUrl;
  }

  async loginWithGoogle(identity: GoogleIdentity): Promise<string> {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: identity.email },
    });

    if (existingUser?.googleId && existingUser.googleId !== identity.googleId) {
      throw new UnauthorizedException('Google account does not match user');
    }

    const user = existingUser
      ? await this.prisma.user.update({
          where: { id: existingUser.id },
          data: {
            googleId: identity.googleId,
            name: existingUser.name ?? identity.name,
            avatarUrl: identity.avatarUrl,
          },
          select: { id: true },
        })
      : await this.prisma.user.create({
          data: identity,
          select: { id: true },
        });

    const refreshToken = await this.signRefreshToken(user.id);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { refreshTokenHash: this.hashRefreshToken(refreshToken) },
    });

    return refreshToken;
  }

  async refresh(rawRefreshToken: string): Promise<{
    auth: AuthResponse;
    refreshToken: string;
  }> {
    const payload = await this.verifyRefreshToken(rawRefreshToken);
    const user = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: {
        ...safeUserSelect,
        refreshTokenHash: true,
      },
    });

    const currentHash = this.hashRefreshToken(rawRefreshToken);

    if (
      !user?.refreshTokenHash ||
      !this.hashesMatch(currentHash, user.refreshTokenHash)
    ) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const nextRefreshToken = await this.signRefreshToken(user.id);
    const nextHash = this.hashRefreshToken(nextRefreshToken);
    const rotation = await this.prisma.user.updateMany({
      where: {
        id: user.id,
        refreshTokenHash: currentHash,
      },
      data: { refreshTokenHash: nextHash },
    });

    if (rotation.count !== 1) {
      throw new UnauthorizedException('Refresh token was already used');
    }

    const safeUser: SafeUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      avatarUrl: user.avatarUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    return {
      auth: {
        accessToken: await this.signAccessToken(user.id),
        user: safeUser,
      },
      refreshToken: nextRefreshToken,
    };
  }

  async getCurrentUser(userId: string): Promise<SafeUser> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: safeUserSelect,
    });

    if (!user) {
      throw new UnauthorizedException('User no longer exists');
    }

    return user;
  }

  async logout(rawRefreshToken: string | undefined): Promise<void> {
    if (!rawRefreshToken) {
      return;
    }

    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(
        rawRefreshToken,
        {
          secret: this.refreshSecret,
          ignoreExpiration: true,
        },
      );

      if (payload.tokenType !== 'refresh' || !payload.sub || !payload.jti) {
        return;
      }

      await this.prisma.user.updateMany({
        where: {
          id: payload.sub,
          refreshTokenHash: this.hashRefreshToken(rawRefreshToken),
        },
        data: { refreshTokenHash: null },
      });
    } catch {
      // The cookie is still cleared for invalid or tampered tokens.
    }
  }

  getRefreshCookieName(): string {
    return this.refreshCookieName;
  }

  getFrontendCallbackUrl(): string {
    return this.frontendCallbackUrl;
  }

  getRefreshCookieOptions(): CookieOptions {
    return {
      httpOnly: true,
      secure: this.appConfiguration.isProduction,
      sameSite: 'lax',
      path: '/auth',
      maxAge: this.refreshExpiresInSeconds * 1000,
    };
  }

  getRefreshCookieClearOptions(): CookieOptions {
    const options = this.getRefreshCookieOptions();
    delete options.maxAge;
    return options;
  }

  private async signAccessToken(userId: string): Promise<string> {
    const payload: TokenPayload = {
      sub: userId,
      tokenType: 'access',
      jti: randomUUID(),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.accessSecret,
      expiresIn: this.accessExpiresInSeconds,
    });
  }

  private async signRefreshToken(userId: string): Promise<string> {
    const payload: TokenPayload = {
      sub: userId,
      tokenType: 'refresh',
      jti: randomUUID(),
    };

    return this.jwtService.signAsync(payload, {
      secret: this.refreshSecret,
      expiresIn: this.refreshExpiresInSeconds,
    });
  }

  private async verifyRefreshToken(token: string): Promise<TokenPayload> {
    try {
      const payload = await this.jwtService.verifyAsync<TokenPayload>(token, {
        secret: this.refreshSecret,
      });

      if (payload.tokenType !== 'refresh' || !payload.sub || !payload.jti) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return payload;
    } catch {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private hashRefreshToken(token: string): string {
    return createHmac('sha256', this.refreshSecret).update(token).digest('hex');
  }

  private hashesMatch(left: string, right: string): boolean {
    const leftBuffer = Buffer.from(left, 'hex');
    const rightBuffer = Buffer.from(right, 'hex');

    return (
      leftBuffer.length === rightBuffer.length &&
      timingSafeEqual(leftBuffer, rightBuffer)
    );
  }
}
