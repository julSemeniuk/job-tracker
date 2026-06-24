import { Stack, Typography } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@layouts/MainLayout'
import {
  AuthBootstrap,
  AuthCallbackPage,
  LoginPage,
  LogoutButton,
  ProtectedRoute,
} from '@modules/auth'
import { ThemeProvider } from '@providers/theme'
import { useGetHealthQuery } from '@services/api/healthApi'

//TODO: Replace with a real home page
const HomePage = () => {
  const { data, error, isLoading } = useGetHealthQuery()

  const healthStatus = isLoading
    ? 'Checking API...'
    : error
      ? 'API unavailable'
      : `API status: ${data?.status}`

  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h3">
        Job Tracker
      </Typography>
      <Typography color="text.secondary">
        Track your job applications in one place.
      </Typography>
      <Typography color={error ? 'error' : 'success'}>{healthStatus}</Typography>
      <LogoutButton />
    </Stack>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthBootstrap />
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<AuthCallbackPage />} path="/auth/callback" />
            <Route element={<LoginPage />} path="/login" />
          </Route>
          <Route
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route element={<HomePage />} index />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
