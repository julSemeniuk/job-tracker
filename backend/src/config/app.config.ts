import { registerAs } from '@nestjs/config';

export const appConfig = registerAs('app', () => {
  const environment = process.env.NODE_ENV ?? 'development';

  return {
    environment,
    isProduction: environment === 'production',
    port: Number(process.env.PORT ?? 3001),
    frontendOrigins: (process.env.FRONTEND_URL ?? '')
      .split(',')
      .map((origin) => origin.trim())
      .filter(Boolean),
  };
});
