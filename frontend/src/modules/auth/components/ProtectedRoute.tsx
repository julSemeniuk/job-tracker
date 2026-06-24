import { Box, CircularProgress } from '@mui/material'
import type { PropsWithChildren } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import {
  selectAuthStatus,
  selectIsAuthenticated,
} from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'

export const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const location = useLocation()
  const status = useAppSelector(selectAuthStatus)
  const isAuthenticated = useAppSelector(selectIsAuthenticated)

  if (status === 'idle' || status === 'loading') {
    return (
      <Box sx={{ display: 'grid', minHeight: '100vh', placeItems: 'center' }}>
        <CircularProgress aria-label="Checking authentication" />
      </Box>
    )
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        replace
        state={{ from: location.pathname }}
        to="/login"
      />
    )
  }

  return children
}
