import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { IAuthState } from '@modules/auth/types'
import { API_BASE_URL } from '@services/api/apiConfig'

type ApiState = {
  auth: IAuthState
}

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as ApiState).auth.accessToken

      if (token) {
        headers.set('authorization', `Bearer ${token}`)
      }

      return headers
    },
  }),
  // Future endpoint modules should inject their endpoints into this shared API.
  endpoints: () => ({}),
})
