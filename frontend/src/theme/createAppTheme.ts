import type { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { getPalette } from '@theme/palette'
import { typography } from '@theme/typography'

export const createAppTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: getPalette(mode),
    typography,
  })
