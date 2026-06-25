import 'i18next'
import { en } from '@src/i18n/locales/en'

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation'
    resources: typeof en
    returnNull: false
  }
}
