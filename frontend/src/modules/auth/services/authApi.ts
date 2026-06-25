import { API_ENDPOINTS } from '@constants/endpoints'
import { baseApi } from '@services/api/baseApi'
import type { IAuthResponse, IAuthUser } from '@modules/auth/types'

const { REFRESH_AUTH, CURRENT_USER, LOGOUT } = API_ENDPOINTS

export const authApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    refreshAuth: builder.mutation<IAuthResponse, void>({
      query: () => ({
        url: REFRESH_AUTH,
        method: 'POST',
        credentials: 'include',
      }),
    }),
    getCurrentUser: builder.query<IAuthUser, void>({
      query: () => CURRENT_USER,
    }),
    logout: builder.mutation<{ success: true }, void>({
      query: () => ({
        url: LOGOUT,
        method: 'POST',
        credentials: 'include',
      }),
    }),
  }),
})

export const { useRefreshAuthMutation, useGetCurrentUserQuery, useLogoutMutation } = authApi
