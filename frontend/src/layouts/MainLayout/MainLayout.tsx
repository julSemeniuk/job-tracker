import { AppBar, Container, Stack, Toolbar, Typography } from '@mui/material'
import type { JSX } from 'react'
import { useTranslation } from 'react-i18next'
import { Outlet } from 'react-router-dom'
import { LanguageSwitcher } from '@src/components'
import { layoutStyles } from '@layouts/MainLayout/styles'
import type { MainLayoutProps } from '@layouts/MainLayout/types'

export const MainLayout = ({ headerTitle }: MainLayoutProps): JSX.Element => {
  const { t } = useTranslation()

  return (
    <Stack sx={layoutStyles.root}>
      <AppBar component="header" position="static" sx={layoutStyles.header}>
        <Toolbar sx={layoutStyles.toolbar}>
          <Typography component="span" variant="h6">
            {headerTitle ?? t('common.appName')}
          </Typography>
          <LanguageSwitcher />
        </Toolbar>
      </AppBar>
      <Container component="main" maxWidth="lg" sx={layoutStyles.main}>
        <Outlet />
      </Container>
    </Stack>
  )
}
