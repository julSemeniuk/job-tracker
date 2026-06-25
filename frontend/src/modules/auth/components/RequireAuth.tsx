import { Box, CircularProgress } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Navigate, useLocation } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes'
import { AUTH_STATUS } from '@modules/auth/constants'
import { authStyles } from '@modules/auth/styles'
import { selectAuthStatus, selectIsAuthenticated } from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'
import type { PropsWithChildren, ReactNode } from 'react'

const { IDLE, LOADING } = AUTH_STATUS

export const RequireAuth = ({ children }: PropsWithChildren): ReactNode => {
  const { t } = useTranslation()
  const location = useLocation()
  const status = useAppSelector(selectAuthStatus)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  const isCheckingAuthentication = status === IDLE || status === LOADING

  if (isCheckingAuthentication) {
    return (
      <Box sx={authStyles.authenticationLoader}>
        <CircularProgress aria-label={t('auth.session.checkingLabel')} />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return <Navigate replace state={{ from: location.pathname }} to={APP_ROUTES.LOGIN} />
  }

  return children
}
