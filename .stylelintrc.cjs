module.exports = {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-tailwindcss',
    'stylelint-config-prettier',
  ],
  rules: {
    // Permitir diretivas do Tailwind
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['tailwind', 'apply', 'variants', 'responsive', 'screen', 'layer'],
      },
    ],
    // Aceitar classes em kebab-case e BEM (__, --)
    'selector-class-pattern': [
      /^(?:[a-z][a-z0-9]*(?:-[a-z0-9]+)*)?(?:__(?:[a-z0-9]+(?:-[a-z0-9]+)*))?(?:--(?:[a-z0-9]+(?:-[a-z0-9]+)*))?$/,
      {
        resolveNestedSelectors: true,
        message: 'Use kebab-case ou BEM (block__element--modifier) para classes',
      },
    ],
    // Ignorar propriedades utilitárias do Tailwind usadas em CSS gerado
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'ring-color',
          'ring-offset-shadow',
          'ring-shadow',
          '--tw-ring-color',
          '--tw-ring-offset-shadow',
          '--tw-ring-shadow',
        ],
      },
    ],
  },
};


