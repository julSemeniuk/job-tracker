import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'
import { Outlet } from 'react-router-dom'
import { layoutStyles } from '@layouts/MainLayout/styles'
import type { MainLayoutProps } from '@layouts/MainLayout/types'

export const MainLayout = ({ headerTitle = 'Job Tracker' }: MainLayoutProps) => {
  return (
    <Box sx={layoutStyles.root}>
      <AppBar component="header" position="static" sx={layoutStyles.header}>
        <Toolbar sx={layoutStyles.toolbar}>
          <Typography component="span" variant="h6">
            {headerTitle}
          </Typography>
        </Toolbar>
      </AppBar>

      <Container component="main" maxWidth="lg" sx={layoutStyles.main}>
        <Outlet />
      </Container>
    </Box>
  )
}
