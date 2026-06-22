import 'reflect-metadata';
import { validateEnvironment } from './env.validation';

const validEnvironment = {
  NODE_ENV: 'development',
  PORT: '3001',
  FRONTEND_URL: 'http://localhost:5173',
  FRONTEND_AUTH_CALLBACK_URL: 'http://localhost:5173/auth/callback',
  DATABASE_URL: 'postgresql://postgres:postgres@localhost:5432/job_tracker',
  GOOGLE_CLIENT_ID: 'google-client-id',
  GOOGLE_CLIENT_SECRET: 'google-client-secret',
  GOOGLE_CALLBACK_URL: 'http://localhost:3001/auth/google/callback',
  JWT_ACCESS_SECRET: 'access-secret-with-at-least-32-characters',
  JWT_REFRESH_SECRET: 'refresh-secret-with-at-least-32-characters',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
};

describe('validateEnvironment', () => {
  it('accepts local configuration and converts the port', () => {
    const config = validateEnvironment(validEnvironment);

    expect(config.PORT).toBe(3001);
  });

  it('accepts multiple comma-separated frontend origins', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        FRONTEND_URL: 'http://localhost:5173, http://127.0.0.1:4173',
      }),
    ).not.toThrow();
  });

  it('rejects localhost and HTTP URLs in production', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        NODE_ENV: 'production',
      }),
    ).toThrow('cannot use localhost in production');
  });

  it('rejects identical JWT secrets', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        JWT_REFRESH_SECRET: validEnvironment.JWT_ACCESS_SECRET,
      }),
    ).toThrow('JWT_ACCESS_SECRET and JWT_REFRESH_SECRET must be different');
  });

  it('accepts HTTPS production URLs', () => {
    expect(() =>
      validateEnvironment({
        ...validEnvironment,
        NODE_ENV: 'production',
        FRONTEND_URL: 'https://app.example.com',
        FRONTEND_AUTH_CALLBACK_URL: 'https://app.example.com/auth/callback',
        GOOGLE_CALLBACK_URL: 'https://api.example.com/auth/google/callback',
      }),
    ).not.toThrow();
  });
});
