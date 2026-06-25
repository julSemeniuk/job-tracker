import { useNavigate } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes'
import { useLogoutMutation } from '@src/modules/auth/services/authApi'
import { clearAuth } from '@modules/auth/store/authSlice'
import { useAppDispatch } from '@providers/store/hooks'
import { baseApi } from '@services/api/baseApi'

export const useLogout = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logoutRequest, { isLoading }] = useLogoutMutation()

  const logout = async () => {
    try {
      await logoutRequest().unwrap()
    } catch {
      // Local credentials are still cleared if the server is unavailable.
    } finally {
      dispatch(clearAuth())
      dispatch(baseApi.util.resetApiState())
      void navigate(APP_ROUTES.LOGIN, { replace: true })
    }
  }

  return {
    logout,
    isLoggingOut: isLoading,
  }
}
