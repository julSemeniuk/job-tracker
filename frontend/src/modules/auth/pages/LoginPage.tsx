import { Alert, Button, Stack, Typography } from '@mui/material'
import { Navigate, useLocation } from 'react-router-dom'
import { selectIsAuthenticated } from '@modules/auth/store/authSlice'
import { useAppSelector } from '@providers/store/hooks'
import { API_BASE_URL } from '@services/api/apiConfig'

interface LoginLocationState {
  authError?: string
}

export const LoginPage = () => {
  const location = useLocation()
  const isAuthenticated = useAppSelector(selectIsAuthenticated)
  const locationState = location.state as LoginLocationState | null

  if (isAuthenticated) {
    return <Navigate replace to="/" />
  }

  const handleGoogleLogin = () => {
    window.location.assign(`${API_BASE_URL}/auth/google`)
  }

  return (
    <Stack spacing={3} sx={{ maxWidth: 420 }}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4">
          Sign in to Job Tracker
        </Typography>
        <Typography color="text.secondary">
          Continue with your Google account to manage your applications.
        </Typography>
      </Stack>

      {locationState?.authError && (
        <Alert severity="error">{locationState.authError}</Alert>
      )}

      <Button onClick={handleGoogleLogin} variant="contained">
        Continue with Google
      </Button>
    </Stack>
  )
}
