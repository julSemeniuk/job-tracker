import { API_ENDPOINTS } from '@constants/endpoints'
import { baseApi } from '@services/api/baseApi'

export interface IHealthResponse {
  status: string
  timestamp: string
}

export const healthApi = baseApi.injectEndpoints({
  endpoints: builder => ({
    getHealth: builder.query<IHealthResponse, void>({
      query: () => API_ENDPOINTS.HEALTH,
    }),
  }),
})

export const { useGetHealthQuery } = healthApi
