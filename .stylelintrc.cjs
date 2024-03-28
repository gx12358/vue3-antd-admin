module.exports = {
  root: true,
  extends: [ 'stylelint-config-standard' ],
  plugins: [ 'stylelint-order', 'stylelint-prettier' ],
  rules: {
    'custom-property-empty-line-before': 'never',
    'color-function-notation': null,
    'media-feature-range-notation': null,
    'selector-not-notation': null,
    'import-notation': null,
    'function-no-unknown': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: [ 'global', 'deep' ]
      }
    ],
    'selector-pseudo-element-no-unknown': [
      true,
      {
        ignorePseudoElements: [ 'v-deep' ]
      }
    ],
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [ 'apply' ]
      }
    ],
    'no-empty-source': null,
    'named-grid-areas-no-invalid': null,
    'no-descending-specificity': null,
    'font-family-no-missing-generic-family-keyword': null,
    'rule-empty-line-before': [
      'always',
      {
        ignore: ['after-comment', 'first-nested'],
      },
    ],
    'unit-no-unknown': [true, { ignoreUnits: ['rpx'] }],
    'order/order': [
      [
        'dollar-variables',
        'custom-properties',
        'at-rules',
        {
          type: 'at-rule',
          name: 'supports',
        },
        {
          type: 'at-rule',
          name: 'media',
        },
        'rules',
      ],
    ],
  },
  ignoreFiles: [ '**/*.js', '**/*.jsx', '**/*.tsx', '**/*.ts' ],
  overrides: [
    {
      files: [ '**/*.(css|html|vue)' ],
      customSyntax: 'postcss-html'
    },
    {
      files: [ '*.less', '**/*.less' ],
      customSyntax: 'postcss-less',
      extends: [ 'stylelint-config-standard', 'stylelint-config-recommended-vue' ]
    }
  ]
}
