import { useEffect, useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes'
import { useRefreshAuthMutation } from '@src/modules/auth/services/authApi'
import { selectAuthStatus } from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'
import { AUTH_STATUS } from '@modules/auth/constants'

export const AuthSessionInitializer = (): ReactNode => {
  const location = useLocation()
  const status = useAppSelector(selectAuthStatus)
  const [refreshAuth] = useRefreshAuthMutation()
  const attemptedRef = useRef(false)

  useEffect(() => {
    const shouldSkipSessionRestore =
      attemptedRef.current ||
      status !== AUTH_STATUS.IDLE ||
      location.pathname === APP_ROUTES.AUTH_CALLBACK

    if (shouldSkipSessionRestore) {
      return
    }

    attemptedRef.current = true

    void refreshAuth()
  }, [location.pathname, refreshAuth, status])

  return null
}
