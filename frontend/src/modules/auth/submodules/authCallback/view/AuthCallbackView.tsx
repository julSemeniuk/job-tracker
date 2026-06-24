import { Alert, CircularProgress, Stack, Typography } from '@mui/material'
import type { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { authStyles } from '@modules/auth/styles'

interface IAuthCallbackViewProps {
  error: string | null
}

export const AuthCallbackView = ({ error }: IAuthCallbackViewProps): ReactNode => {
  const { t } = useTranslation()

  if (error) {
    return <Alert severity="error">{error}</Alert>
  }

  return (
    <Stack spacing={2} sx={authStyles.callbackStatus}>
      <CircularProgress aria-label={t('auth.callback.loadingLabel')} />
      <Typography>{t('auth.callback.loading')}</Typography>
    </Stack>
  )
}
