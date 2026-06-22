import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { createHmac } from 'node:crypto';
import { PrismaService } from '../prisma/prisma.service';
import { AuthService } from './auth.service';

const CONFIG = {
  JWT_ACCESS_SECRET: 'access-secret',
  JWT_REFRESH_SECRET: 'refresh-secret',
  JWT_ACCESS_EXPIRES_IN: '15m',
  JWT_REFRESH_EXPIRES_IN: '7d',
  REFRESH_TOKEN_COOKIE_NAME: 'refreshToken',
  FRONTEND_AUTH_CALLBACK_URL: 'http://localhost:5173/auth/callback',
  NODE_ENV: 'test',
} as const;

const hashRefreshToken = (token: string) =>
  createHmac('sha256', CONFIG.JWT_REFRESH_SECRET).update(token).digest('hex');

describe('AuthService', () => {
  const userRepository = {
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    updateMany: jest.fn(),
  };
  const jwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };
  const configService = {
    get: jest.fn((key: keyof typeof CONFIG) => CONFIG[key]),
  };
  const service = new AuthService(
    { user: userRepository } as unknown as PrismaService,
    jwtService as unknown as JwtService,
    configService as unknown as ConfigService,
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('stores only a hash after Google login', async () => {
    userRepository.findUnique.mockResolvedValue(null);
    userRepository.create.mockResolvedValue({ id: 'user-id' });
    userRepository.update.mockResolvedValue({ id: 'user-id' });
    jwtService.signAsync.mockResolvedValue('raw-refresh-token');

    const refreshToken = await service.loginWithGoogle({
      googleId: 'google-id',
      email: 'user@example.com',
      name: 'User',
      avatarUrl: null,
    });

    expect(refreshToken).toBe('raw-refresh-token');
    expect(userRepository.update).toHaveBeenCalledWith({
      where: { id: 'user-id' },
      data: {
        refreshTokenHash: hashRefreshToken('raw-refresh-token'),
      },
    });
  });

  it('rotates the refresh token and returns a separate access token', async () => {
    const now = new Date();
    const currentRefreshToken = 'current-refresh-token';
    const nextRefreshToken = 'next-refresh-token';

    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      tokenType: 'refresh',
      jti: 'refresh-id',
    });
    userRepository.findUnique.mockResolvedValue({
      id: 'user-id',
      email: 'user@example.com',
      name: 'User',
      avatarUrl: null,
      createdAt: now,
      updatedAt: now,
      refreshTokenHash: hashRefreshToken(currentRefreshToken),
    });
    jwtService.signAsync
      .mockResolvedValueOnce(nextRefreshToken)
      .mockResolvedValueOnce('access-token');
    userRepository.updateMany.mockResolvedValue({ count: 1 });

    const result = await service.refresh(currentRefreshToken);

    expect(userRepository.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'user-id',
        refreshTokenHash: hashRefreshToken(currentRefreshToken),
      },
      data: { refreshTokenHash: hashRefreshToken(nextRefreshToken) },
    });
    expect(result.refreshToken).toBe(nextRefreshToken);
    expect(result.auth.accessToken).toBe('access-token');
    expect(result.auth.user).not.toHaveProperty('refreshTokenHash');
  });

  it('removes the matching stored hash on logout', async () => {
    jwtService.verifyAsync.mockResolvedValue({
      sub: 'user-id',
      tokenType: 'refresh',
      jti: 'refresh-id',
    });
    userRepository.updateMany.mockResolvedValue({ count: 1 });

    await service.logout('raw-refresh-token');

    expect(userRepository.updateMany).toHaveBeenCalledWith({
      where: {
        id: 'user-id',
        refreshTokenHash: hashRefreshToken('raw-refresh-token'),
      },
      data: { refreshTokenHash: null },
    });
  });
});
