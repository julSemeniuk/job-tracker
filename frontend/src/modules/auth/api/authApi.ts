import { baseApi } from '@services/api/baseApi'
import type {
  AuthResponse,
  AuthUser,
} from '@modules/auth/types/auth.types'

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    refreshAuth: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: '/auth/refresh',
        method: 'POST',
        credentials: 'include',
      }),
    }),
    getCurrentUser: builder.query<AuthUser, void>({
      query: () => '/auth/me',
    }),
    logout: builder.mutation<{ success: true }, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'POST',
        credentials: 'include',
      }),
    }),
  }),
})

export const {
  useRefreshAuthMutation,
  useGetCurrentUserQuery,
  useLogoutMutation,
} = authApi
