import { Stack, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { LogoutButton } from '@modules/auth'
import { useGetHealthQuery } from '@services/api/healthApi'

export const HomePage = () => {
  const { t } = useTranslation()
  const { data, error, isLoading } = useGetHealthQuery()

  const healthStatus = isLoading
    ? t('home.health.checking')
    : error
      ? t('home.health.unavailable')
      : t('home.health.status', { status: data?.status })

  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h3">
        {t('home.title')}
      </Typography>
      <Typography color="text.secondary">{t('home.description')}</Typography>
      <Typography color={error ? 'error' : 'success'}>{healthStatus}</Typography>
      <LogoutButton />
    </Stack>
  )
}
