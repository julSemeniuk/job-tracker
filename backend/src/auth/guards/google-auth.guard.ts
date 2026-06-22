import {
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import type { ConfigType } from '@nestjs/config';
import { AuthGuard } from '@nestjs/passport';
import { randomBytes, timingSafeEqual } from 'node:crypto';
import type { Request, Response } from 'express';
import { appConfig } from '../../config/app.config';

const OAUTH_STATE_COOKIE_NAME = 'googleOAuthState';
const OAUTH_STATE_MAX_AGE_MS = 10 * 60 * 1000;

type OAuthRequest = Omit<Request, 'cookies'> & {
  cookies?: Record<string, string | undefined>;
  oauthState?: string;
};

@Injectable()
export class GoogleAuthGuard extends AuthGuard('google') {
  constructor(
    @Inject(appConfig.KEY)
    private readonly config: ConfigType<typeof appConfig>,
  ) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<OAuthRequest>();
    const response = context.switchToHttp().getResponse<Response>();

    if (request.path.endsWith('/callback')) {
      this.validateState(request);
      response.clearCookie(OAUTH_STATE_COOKIE_NAME, this.stateCookieOptions());
    } else {
      request.oauthState = randomBytes(32).toString('base64url');
      response.cookie(
        OAUTH_STATE_COOKIE_NAME,
        request.oauthState,
        this.stateCookieOptions(OAUTH_STATE_MAX_AGE_MS),
      );
    }

    return super.canActivate(context);
  }

  getAuthenticateOptions(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<OAuthRequest>();

    return {
      scope: ['email', 'profile'],
      state: request.oauthState,
    };
  }

  private validateState(request: OAuthRequest): void {
    const queryState =
      typeof request.query.state === 'string' ? request.query.state : undefined;
    const cookieState = request.cookies?.[OAUTH_STATE_COOKIE_NAME];

    if (!queryState || !cookieState) {
      throw new UnauthorizedException('Invalid OAuth state');
    }

    const queryBuffer = Buffer.from(queryState);
    const cookieBuffer = Buffer.from(cookieState);

    if (
      queryBuffer.length !== cookieBuffer.length ||
      !timingSafeEqual(queryBuffer, cookieBuffer)
    ) {
      throw new UnauthorizedException('Invalid OAuth state');
    }
  }

  private stateCookieOptions(maxAge?: number) {
    return {
      httpOnly: true,
      secure: this.config.isProduction,
      sameSite: 'lax' as const,
      path: '/auth/google/callback',
      ...(maxAge === undefined ? {} : { maxAge }),
    };
  }
}
