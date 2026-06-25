import { ButtonGroup } from '@mui/material'
import { useCallback, type JSX } from 'react'
import { useTranslation } from 'react-i18next'

import { LanguageButton } from '@src/components'
import type { SupportedLanguage } from '@src/i18n/types'
import { SUPPORTED_LANGUAGES } from '@src/i18n/constants'

export const LanguageSwitcher = (): JSX.Element => {
  const { i18n, t } = useTranslation()

  const changeLanguage = useCallback(
    (language: SupportedLanguage) => {
      void i18n.changeLanguage(language)
    },
    [i18n]
  )

  const renderLanguageButton = (language: SupportedLanguage) => {
    return (
      <LanguageButton
        isActive={i18n.resolvedLanguage === language}
        key={language}
        language={language}
        onChange={changeLanguage}
      />
    )
  }

  return (
    <ButtonGroup aria-label={t('common.language.selectorLabel')} size="small">
      {SUPPORTED_LANGUAGES.map(renderLanguageButton)}
    </ButtonGroup>
  )
}
