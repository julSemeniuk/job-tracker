import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes'
import { useRefreshAuthMutation } from '@src/modules/auth/services/authApi'
import { AuthCallbackView } from '@modules/auth/submodules/authCallback/view/AuthCallbackView'

export const AuthCallbackController = () => {
  const { t } = useTranslation()
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
        void navigate(APP_ROUTES.HOME, { replace: true })
      } catch {
        const message = t('auth.callback.error')
        setError(message)
        void navigate(APP_ROUTES.LOGIN, {
          replace: true,
          state: { authError: message },
        })
      }
    }

    void completeAuthentication()
  }, [navigate, refreshAuth, t])

  return <AuthCallbackView error={error} />
}
