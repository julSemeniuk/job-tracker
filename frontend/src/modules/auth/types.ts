import type { AUTH_STATUS } from '@modules/auth/constants'

export interface IAuthUser {
  id: string
  email: string
  name: string | null
  avatarUrl: string | null
}

export interface IAuthResponse {
  accessToken: string
  user: IAuthUser
}

export type AuthStatus = (typeof AUTH_STATUS)[keyof typeof AUTH_STATUS]

export interface ILoginLocationState {
  authError?: string
}

export interface IAuthState {
  accessToken: string | null
  user: IAuthUser | null
  status: AuthStatus
  isAuthenticated: boolean
}
