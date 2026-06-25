import { Alert, Button, Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import type { ILoginLocationState } from '@modules/auth/types'

interface IAuthViewProps {
  locationState: ILoginLocationState | null
  handleGoogleLogin: () => void
}

export const AuthView = ({
  locationState,
  handleGoogleLogin,
}: IAuthViewProps): React.JSX.Element => {
  const { t } = useTranslation()

  return (
    <Stack spacing={3} sx={{ maxWidth: 420 }}>
      <Stack spacing={1}>
        <Typography component="h1" variant="h4">
          {t('auth.login.title')}
        </Typography>
        <Typography color="text.secondary">{t('auth.login.description')}</Typography>
      </Stack>

      {locationState?.authError && <Alert severity="error">{locationState.authError}</Alert>}

      <Button onClick={handleGoogleLogin} variant="contained">
        {t('auth.login.googleButton')}
      </Button>
    </Stack>
  )
}
