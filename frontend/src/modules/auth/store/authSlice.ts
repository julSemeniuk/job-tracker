import { createSlice } from '@reduxjs/toolkit'
import { authApi } from '@src/modules/auth/services/authApi'
import type { IAuthState } from '@modules/auth/types'

const initialState: IAuthState = {
  accessToken: null,
  user: null,
  status: 'idle',
  isAuthenticated: false,
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearAuth: state => {
      state.accessToken = null
      state.user = null
      state.status = 'unauthenticated'
      state.isAuthenticated = false
    },
  },
  selectors: {
    selectAccessToken: state => state.accessToken,
    selectAuthUser: state => state.user,
    selectAuthStatus: state => state.status,
    selectIsAuthenticated: state => state.isAuthenticated,
  },
  extraReducers: builder => {
    builder
      .addMatcher(authApi.endpoints.refreshAuth.matchPending, state => {
        state.status = 'loading'
      })
      .addMatcher(authApi.endpoints.refreshAuth.matchFulfilled, (state, action) => {
        state.accessToken = action.payload.accessToken
        state.user = action.payload.user
        state.status = 'authenticated'
        state.isAuthenticated = true
      })
      .addMatcher(authApi.endpoints.refreshAuth.matchRejected, state => {
        state.accessToken = null
        state.user = null
        state.status = 'unauthenticated'
        state.isAuthenticated = false
      })
      .addMatcher(authApi.endpoints.getCurrentUser.matchFulfilled, (state, action) => {
        state.user = action.payload
      })
      .addMatcher(authApi.endpoints.logout.matchFulfilled, state => {
        state.accessToken = null
        state.user = null
        state.status = 'unauthenticated'
        state.isAuthenticated = false
      })
  },
})

export const { clearAuth } = authSlice.actions
export const { selectAccessToken, selectAuthStatus, selectAuthUser, selectIsAuthenticated } =
  authSlice.selectors

export const authReducer = authSlice.reducer
export type AuthState = IAuthState
