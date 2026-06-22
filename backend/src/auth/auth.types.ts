import { Prisma } from '@prisma/client';

export const safeUserSelect = {
  id: true,
  email: true,
  name: true,
  avatarUrl: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type SafeUser = Prisma.UserGetPayload<{
  select: typeof safeUserSelect;
}>;

export interface GoogleIdentity {
  googleId: string;
  email: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface TokenPayload {
  sub: string;
  tokenType: 'access' | 'refresh';
  jti: string;
}

export interface AuthResponse {
  accessToken: string;
  user: SafeUser;
}
