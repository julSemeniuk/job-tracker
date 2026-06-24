import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useRefreshAuthMutation } from '@modules/auth/api/authApi'
import { selectAuthStatus } from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'

export const AuthBootstrap = () => {
  const location = useLocation()
  const status = useAppSelector(selectAuthStatus)
  const [refreshAuth] = useRefreshAuthMutation()
  const attemptedRef = useRef(false)

  useEffect(() => {
    if (
      attemptedRef.current ||
      status !== 'idle' ||
      location.pathname === '/auth/callback'
    ) {
      return
    }

    attemptedRef.current = true
    void refreshAuth()
  }, [location.pathname, refreshAuth, status])

  return null
}
