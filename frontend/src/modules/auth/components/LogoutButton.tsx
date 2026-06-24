import { Button } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useLogoutMutation } from '@modules/auth/api/authApi'
import { clearAuth } from '@modules/auth/store/authSlice'
import { useAppDispatch } from '@providers/store/hooks'
import { baseApi } from '@services/api/baseApi'

export const LogoutButton = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [logout, { isLoading }] = useLogoutMutation()

  const handleLogout = async () => {
    try {
      await logout().unwrap()
    } catch {
      // Local credentials are still cleared if the server is unavailable.
    }

    dispatch(clearAuth())
    dispatch(baseApi.util.resetApiState())
    navigate('/login', { replace: true })
  }

  return (
    <Button disabled={isLoading} onClick={() => void handleLogout()}>
      {isLoading ? 'Signing out...' : 'Sign out'}
    </Button>
  )
}
