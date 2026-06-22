import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { getRequiredConfig } from '../auth-config';
import { GoogleIdentity } from '../auth.types';

interface GoogleProfileJson {
  email_verified?: unknown;
}

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(configService: ConfigService) {
    super({
      clientID: getRequiredConfig(configService, 'GOOGLE_CLIENT_ID'),
      clientSecret: getRequiredConfig(configService, 'GOOGLE_CLIENT_SECRET'),
      callbackURL: getRequiredConfig(configService, 'GOOGLE_CALLBACK_URL'),
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
