import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import { DEFAULT_LANGUAGE, resources, SUPPORTED_LANGUAGES } from '@src/i18n/constants'
import type { SupportedLanguage } from '@src/i18n/types'
import { COMMON } from '@src/constants'

const { LANGUAGE } = COMMON.STORAGE_KEY

const isSupportedLanguage = (language?: string | null): language is SupportedLanguage => {
  return SUPPORTED_LANGUAGES.some(supportedLanguage => supportedLanguage === language)
}

const getInitialLanguage = (): SupportedLanguage => {
  const storedLanguage = localStorage.getItem(LANGUAGE)

  if (isSupportedLanguage(storedLanguage)) {
    return storedLanguage
  }

  const browserLanguage = navigator.language.split('-')[0]
  return isSupportedLanguage(browserLanguage) ? browserLanguage : DEFAULT_LANGUAGE
}

i18n.use(initReactI18next)

void i18n.init({
  resources,
  lng: getInitialLanguage(),
  fallbackLng: DEFAULT_LANGUAGE,
  interpolation: {
    escapeValue: false,
  },
})

i18n.on('languageChanged', language => {
  if (isSupportedLanguage(language)) {
    localStorage.setItem(LANGUAGE, language)
    document.documentElement.lang = language
  }
})

document.documentElement.lang = i18n.resolvedLanguage ?? DEFAULT_LANGUAGE

export { i18n }
