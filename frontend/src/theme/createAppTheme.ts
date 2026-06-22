import type { PaletteMode } from '@mui/material'
import { createTheme } from '@mui/material/styles'
import { getPalette } from './palette'
import { typography } from './typography'

export const createAppTheme = (mode: PaletteMode = 'light') =>
  createTheme({
    palette: getPalette(mode),
    typography,
  })
