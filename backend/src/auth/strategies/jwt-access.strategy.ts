import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { authConfig } from '../../config/auth.config';
import { TokenPayload } from '../auth.types';

function isAccessTokenPayload(payload: unknown): payload is TokenPayload {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const candidate = payload as Record<string, unknown>;

  return (
    typeof candidate.sub === 'string' &&
    typeof candidate.jti === 'string' &&
    candidate.tokenType === 'access'
  );
}

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access',
) {
  constructor(
    @Inject(authConfig.KEY)
    config: ConfigType<typeof authConfig>,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.accessSecret,
    });
  }

  validate(payload: unknown): TokenPayload {
    if (!isAccessTokenPayload(payload)) {
      throw new UnauthorizedException('Invalid access token');
    }

    return payload;
  }
}
