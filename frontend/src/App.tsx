import { Stack, Typography } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@layouts/MainLayout'
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
    </Stack>
  )
}

const App = () => {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout />}>
            <Route index element={<HomePage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
