import { configureStore } from '@reduxjs/toolkit'
import { authReducer } from '@modules/auth/store/authSlice'
import { baseApi } from '@services/api/baseApi'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware),
  devTools: import.meta.env.DEV,
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
