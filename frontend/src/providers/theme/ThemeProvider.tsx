import {
  CssBaseline,
  ThemeProvider as MuiThemeProvider,
  useMediaQuery,
} from '@mui/material'
import { useMemo, type PropsWithChildren } from 'react'
import { createAppTheme } from '@theme/createAppTheme'

export const ThemeProvider = ({ children }: PropsWithChildren) => {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)')
  const appTheme = useMemo(
    () => createAppTheme(prefersDarkMode ? 'dark' : 'light'),
    [prefersDarkMode],
  )

  return (
    <MuiThemeProvider theme={appTheme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  )
}
