/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */
const config = {
  // Core formatting options
  printWidth: 80,
  tabWidth: 2,
  useTabs: false,
  semi: false,
  singleQuote: true,
  quoteProps: 'as-needed',
  jsxSingleQuote: true,
  trailingComma: 'es5',
  bracketSpacing: true,
  bracketSameLine: false,
  arrowParens: 'avoid',
  endOfLine: 'lf',

  // Plugin configurations
  plugins: [
    '@prettier/plugin-xml',
    'prettier-plugin-tailwindcss', // Must be last for proper class sorting
  ],

  // File-specific overrides
  overrides: [
    {
      files: '*.json',
      options: {
        printWidth: 120,
        tabWidth: 2,
      },
    },
    {
      files: '*.md',
      options: {
        printWidth: 100,
        proseWrap: 'always',
        singleQuote: false,
      },
    },
    {
      files: '*.{yaml,yml}',
      options: {
        printWidth: 120,
        singleQuote: false,
      },
    },
    {
      files: '*.{css,scss,less}',
      options: {
        printWidth: 120,
        singleQuote: false,
      },
    },
  ],
}

export default config
