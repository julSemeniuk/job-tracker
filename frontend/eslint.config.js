import eslint from '@eslint/js'
import eslintPluginPrettierRecommended from 'eslint-plugin-prettier/recommended'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  {
    ignores: ['dist', 'build', 'coverage', 'node_modules'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked.map(config => ({
    ...config,
    files: ['**/*.{ts,tsx}'],
  })),
  {
    ...react.configs.flat.recommended,
    files: ['**/*.{jsx,tsx}'],
  },
  {
    ...react.configs.flat['jsx-runtime'],
    files: ['**/*.{jsx,tsx}'],
  },
  {
    ...reactHooks.configs.flat['recommended-latest'],
    files: ['**/*.{jsx,tsx}'],
  },
  reactRefresh.configs.vite,
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react,
    },
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      'no-restricted-syntax': [
        'error',
        {
          selector: 'Program > TSInterfaceDeclaration[id.name!=/^I[A-Z]/]',
          message: 'Interface names must start with I followed by an uppercase letter.',
        },
      ],
      'react/prop-types': 'off',
      'react/jsx-no-bind': [
        'error',
        {
          allowArrowFunctions: false,
          allowBind: false,
          allowFunctions: false,
          ignoreRefs: true,
        },
      ],
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      'no-restricted-syntax': 'off',
    },
  },
  eslintPluginPrettierRecommended
)
