import { useCallback } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { API_ENDPOINTS } from '@constants/endpoints'
import { APP_ROUTES } from '@constants/routes'
import { selectIsAuthenticated } from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'
import { API_BASE_URL } from '@services/api/apiConfig'
import type { ILoginLocationState } from '@modules/auth/types'
import { AuthView } from '../view/AuthView'

export const AuthController = () => {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const locationState = location.state as ILoginLocationState | null

  const handleGoogleLogin = useCallback(() => {
    window.location.assign(`${API_BASE_URL}${API_ENDPOINTS.GOOGLE_LOGIN}`)
  }, [])

  if (isAuthenticated) {
    return <Navigate replace to={APP_ROUTES.HOME} />
  }

  return <AuthView locationState={locationState} handleGoogleLogin={handleGoogleLogin} />
}
