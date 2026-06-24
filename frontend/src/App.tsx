import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { APP_ROUTES } from '@constants/routes'
import { MainLayout } from '@layouts/MainLayout'
import {
  AuthCallbackController,
  AuthController,
  AuthSessionInitializer,
  RequireAuth,
} from '@modules/auth'
import { HomePage } from '@src/pages'
import { ThemeProvider } from '@providers/theme'

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <AuthSessionInitializer />
        <Routes>
          <Route element={<MainLayout />}>
            <Route element={<AuthCallbackController />} path={APP_ROUTES.AUTH_CALLBACK} />
            <Route element={<AuthController />} path={APP_ROUTES.LOGIN} />
          </Route>
          <Route
            element={
              <RequireAuth>
                <MainLayout />
              </RequireAuth>
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
