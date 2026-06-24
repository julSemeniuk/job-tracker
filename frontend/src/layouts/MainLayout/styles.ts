import type { StylesProps } from '@src/types'

export const layoutStyles = {
  root: {
    display: 'flex',
    minHeight: '100vh',
    flexDirection: 'column',
    bgcolor: 'background.default',
  },
  header: {
    borderBottom: 1,
    borderColor: 'divider',
    bgcolor: 'background.paper',
    color: 'text.primary',
  },
  toolbar: {
    display: 'flex',
    justifyContent: 'space-between',
    minHeight: 64,
  },
  main: {
    display: 'flex',
    flex: 1,
    py: { xs: 3, md: 4 },
  },
} satisfies StylesProps
