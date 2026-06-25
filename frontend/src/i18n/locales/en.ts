export const en = {
  common: {
    appName: 'Job Tracker',
    language: {
      selectorLabel: 'Select language',
      english: 'English',
      ukrainian: 'Ukrainian',
    },
  },
  home: {
    title: 'Job Tracker',
    description: 'Track your job applications in one place.',
    health: {
      checking: 'Checking API...',
      unavailable: 'API unavailable',
      status: 'API status: {{status}}',
    },
  },
  auth: {
    login: {
      title: 'Sign in to Job Tracker',
      description: 'Continue with your Google account to manage your applications.',
      googleButton: 'Continue with Google',
    },
    callback: {
      loading: 'Completing Google sign-in...',
      loadingLabel: 'Completing authentication',
      error: 'Google authentication failed. Please try again.',
    },
    session: {
      checkingLabel: 'Checking authentication',
    },
    logout: {
      action: 'Sign out',
      loading: 'Signing out...',
    },
  },
} as const
