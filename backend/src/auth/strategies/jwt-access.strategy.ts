import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { getRequiredConfig } from '../auth-config';
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
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: getRequiredConfig(configService, 'JWT_ACCESS_SECRET'),
    });
  }

  validate(payload: unknown): TokenPayload {
    if (!isAccessTokenPayload(payload)) {
      throw new UnauthorizedException('Invalid access token');
    }

    return payload;
  }
}
