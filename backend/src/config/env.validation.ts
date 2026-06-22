import { plainToInstance, Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsNotEmpty,
  IsString,
  IsUrl,
  Matches,
  Max,
  Min,
  MinLength,
  validateSync,
} from 'class-validator';

const HTTP_URL_OPTIONS = {
  protocols: ['http', 'https'],
  require_protocol: true,
  require_tld: false,
};

const LOCAL_HOSTNAMES = new Set(['localhost', '127.0.0.1', '::1']);

class EnvironmentVariables {
  @IsIn(['development', 'test', 'production'])
  NODE_ENV = 'development';

  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3001;

  @IsString()
  @IsNotEmpty()
  FRONTEND_URL!: string;

  @IsUrl(HTTP_URL_OPTIONS)
  FRONTEND_AUTH_CALLBACK_URL!: string;

  @IsString()
  @Matches(/^postgres(?:ql)?:\/\//, {
    message: 'DATABASE_URL must be a PostgreSQL connection URL',
  })
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_ID!: string;

  @IsString()
  @IsNotEmpty()
  GOOGLE_CLIENT_SECRET!: string;

  @IsUrl(HTTP_URL_OPTIONS)
  GOOGLE_CALLBACK_URL!: string;

  @IsString()
  @MinLength(32)
  JWT_ACCESS_SECRET!: string;

  @IsString()
  @MinLength(32)
  JWT_REFRESH_SECRET!: string;

  @Matches(/^\d+[smhd]$/)
  JWT_ACCESS_EXPIRES_IN = '15m';

  @Matches(/^\d+[smhd]$/)
  JWT_REFRESH_EXPIRES_IN = '7d';

  @Matches(/^[A-Za-z0-9_-]+$/)
  REFRESH_TOKEN_COOKIE_NAME = 'refreshToken';
}

export function validateEnvironment(
  rawConfig: Record<string, unknown>,
): EnvironmentVariables {
  const config = plainToInstance(EnvironmentVariables, rawConfig, {
    enableImplicitConversion: true,
  });
  const validationErrors = validateSync(config, {
    skipMissingProperties: false,
  });
  const messages = validationErrors.flatMap((error) =>
    error.constraints ? Object.values(error.constraints) : [],
  );

  for (const origin of config.FRONTEND_URL?.split(',') ?? []) {
    const normalizedOrigin = origin.trim();

    if (!isHttpUrl(normalizedOrigin)) {
      messages.push(`FRONTEND_URL contains an invalid origin: ${origin}`);
    }
  }

  if (config.JWT_ACCESS_SECRET === config.JWT_REFRESH_SECRET) {
    messages.push('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
  }

  if (config.NODE_ENV === 'production') {
    assertProductionUrl(config.FRONTEND_URL, 'FRONTEND_URL', messages);
    assertProductionUrl(
      config.FRONTEND_AUTH_CALLBACK_URL,
      'FRONTEND_AUTH_CALLBACK_URL',
      messages,
    );
    assertProductionUrl(
      config.GOOGLE_CALLBACK_URL,
      'GOOGLE_CALLBACK_URL',
      messages,
    );
  }

  if (messages.length > 0) {
    throw new Error(
      `Environment validation failed:\n- ${[...new Set(messages)].join('\n- ')}`,
    );
  }

  return config;
}

function isHttpUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol);
  } catch {
    return false;
  }
}

function assertProductionUrl(
  value: string,
  key: string,
  messages: string[],
): void {
  if (!value) {
    return;
  }

  for (const candidate of value.split(',')) {
    try {
      const url = new URL(candidate.trim());

      if (LOCAL_HOSTNAMES.has(url.hostname)) {
        messages.push(`${key} cannot use localhost in production`);
      }

      if (url.protocol !== 'https:') {
        messages.push(`${key} must use HTTPS in production`);
      }
    } catch {
      // General URL validation reports the malformed value.
    }
  }
}
