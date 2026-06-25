import { Button } from '@mui/material'
import { useCallback, type JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { useLogout } from '@modules/auth/hooks'

export const LogoutButton = (): JSX.Element => {
  const { t } = useTranslation()
  const { logout, isLoggingOut } = useLogout()

  const handleLogout = useCallback(() => {
    void logout()
  }, [logout])

  const buttonLabel = isLoggingOut ? t('auth.logout.loading') : t('auth.logout.action')

  return (
    <Button disabled={isLoggingOut} onClick={handleLogout}>
      {buttonLabel}
    </Button>
  )
}
