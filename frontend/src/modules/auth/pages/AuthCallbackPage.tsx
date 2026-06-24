import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRefreshAuthMutation } from '@modules/auth/api/authApi'

export const AuthCallbackPage = () => {
  const navigate = useNavigate()
  const [refreshAuth] = useRefreshAuthMutation()
  const [error, setError] = useState<string | null>(null)
  const startedRef = useRef(false)

  useEffect(() => {
    if (startedRef.current) {
      return
    }

    startedRef.current = true

    const completeAuthentication = async () => {
      try {
        await refreshAuth().unwrap()
        navigate('/', { replace: true })
      } catch {
        const message = 'Google authentication failed. Please try again.'
        setError(message)
        navigate('/login', {
          replace: true,
          state: { authError: message },
        })
      }
    }

    void completeAuthentication()
  }, [navigate, refreshAuth])

  return (
    <Stack spacing={2} sx={{ alignItems: 'center' }}>
      {error ? (
        <Alert severity="error">{error}</Alert>
      ) : (
        <>
          <CircularProgress aria-label="Completing authentication" />
          <Typography>Completing Google sign-in...</Typography>
        </>
      )}
    </Stack>
  )
}
