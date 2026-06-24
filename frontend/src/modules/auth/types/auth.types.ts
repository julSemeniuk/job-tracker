export interface AuthUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

export interface AuthResponse {
  accessToken: string
  user: AuthUser
}

export type AuthStatus =
  | 'idle'
  | 'loading'
  | 'authenticated'
  | 'unauthenticated'
