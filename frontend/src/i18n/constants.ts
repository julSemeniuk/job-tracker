import { en } from '@src/i18n/locales/en'
import { uk } from '@src/i18n/locales/uk'

export const DEFAULT_LANGUAGE = 'en'
export const SUPPORTED_LANGUAGES = ['en', 'uk'] as const

export const resources = {
  en: { translation: en },
  uk: { translation: uk },
} as const
