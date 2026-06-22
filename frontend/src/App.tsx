import { Stack, Typography } from '@mui/material'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { MainLayout } from '@layouts/MainLayout'
import { ThemeProvider } from '@providers/theme'

//TODO: Replace with a real home page
const HomePage = () => {
  return (
    <Stack spacing={1}>
      <Typography component="h1" variant="h3">
        Job Tracker
      </Typography>
      <Typography color="text.secondary">
        Track your job applications in one place.
      </Typography>
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
