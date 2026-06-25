export const uk = {
  common: {
    appName: 'Job Tracker',
    language: {
      selectorLabel: 'Обрати мову',
      english: 'Англійська',
      ukrainian: 'Українська',
    },
  },
  home: {
    title: 'Job Tracker',
    description: 'Відстежуйте свої заявки на роботу в одному місці.',
    health: {
      checking: 'Перевіряємо API...',
      unavailable: 'API недоступне',
      status: 'Статус API: {{status}}',
    },
  },
  auth: {
    login: {
      title: 'Увійти до Job Tracker',
      description: 'Продовжте з обліковим записом Google, щоб керувати своїми заявками.',
      googleButton: 'Продовжити з Google',
    },
    callback: {
      loading: 'Завершуємо вхід через Google...',
      loadingLabel: 'Завершення автентифікації',
      error: 'Не вдалося увійти через Google. Спробуйте ще раз.',
    },
    session: {
      checkingLabel: 'Перевірка автентифікації',
    },
    logout: {
      action: 'Вийти',
      loading: 'Виходимо...',
    },
  },
} as const
