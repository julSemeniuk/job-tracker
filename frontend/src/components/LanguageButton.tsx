import { Button } from '@mui/material'
import { useCallback, type JSX } from 'react'
import type { SupportedLanguage } from '@src/i18n/types'

interface ILanguageButtonProps {
  isActive: boolean
  language: SupportedLanguage
  onChange: (language: SupportedLanguage) => void
}

export const LanguageButton = ({
  isActive,
  language,
  onChange,
}: ILanguageButtonProps): JSX.Element => {
  const handleClick = useCallback(() => {
    onChange(language)
  }, [language, onChange])

  const buttonVariant = isActive ? 'contained' : 'outlined'

  return (
    <Button onClick={handleClick} variant={buttonVariant}>
      {language.toUpperCase()}
    </Button>
  )
}
