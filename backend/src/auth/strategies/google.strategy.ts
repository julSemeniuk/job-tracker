import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { authConfig } from '../../config/auth.config';
import { GoogleIdentity } from '../auth.types';

interface GoogleProfileJson {
  email_verified?: unknown;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(
    @Inject(authConfig.KEY)
    config: ConfigType<typeof authConfig>,
  ) {
    super({
      clientID: config.google.clientId,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackUrl,
      scope: ['email', 'profile'],
    });
  }

  validate(
    _accessToken: string,
    _refreshToken: string,
    profile: Profile,
  ): GoogleIdentity {
    const email = profile.emails?.[0]?.value?.trim().toLowerCase();
    const profileJson = profile._json as GoogleProfileJson | undefined;

    if (
      profile.provider !== 'google' ||
      !profile.id ||
      !email ||
      profileJson?.email_verified !== true
    ) {
      throw new UnauthorizedException('Google profile is not verified');
    }

    return {
      googleId: profile.id,
      email,
      name: profile.displayName?.trim() || null,
      avatarUrl: profile.photos?.[0]?.value || null,
    };
  }
}
