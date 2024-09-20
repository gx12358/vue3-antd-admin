import antFuEslint from '@antfu/eslint-config'

export default antFuEslint({
  vue: true,
  vueJsx: true,
  typescript: true,
  gitignore: true,
  markdown: true,
  ignores: [
    'src/assets/**/*.js',
    'build/vite/plugin/viteMock',
    'public',
    'tsconfig.*.json',
    'tsconfig.json'
  ]
}, {
  rules: {
    'curly': 0,
    'no-console': 0,
    'vue/html-comment-content-spacing': 0,
    'style/indent-binary-ops': 0,
    'antfu/if-newline': 0,
    'import/order': 0,
    'style/quote-props': 0,
    'style/brace-style': 0,
    'style/comma-dangle': 0,
    'style/multiline-ternary': 0,
    'prefer-regex-literals': 0,
    'antfu/top-level-function': 0,
    'vue/array-bracket-spacing': 0,
    'style/array-bracket-spacing': 0,
    'node/prefer-global/process': 0,
    'style/indent': 0,
    'prefer-template': 0,
    'dot-notation': 0,
    'no-cond-assign': 0,
    'no-useless-computed-key': 0,
    'node/no-deprecated-api': 0,
    'antfu/consistent-list-newline': 0,
    'import/no-mutable-exports': 0,
    'style/member-delimiter-style': 0,
    'unused-imports/no-unused-imports': 0,
    'eslint-comments/no-unlimited-disable': 0,
    'no-async-promise-executor': 0,
    'unicorn/escape-case': 0,
    'ts/ban-ts-comment': 0,
    'ts/prefer-ts-expect-error': 0,
    'ts/method-signature-style': 0,
    'style/no-trailing-spaces': 0,
    'ts/consistent-type-imports': 0,
    'style/type-generic-spacing': 0,
    'prefer-promise-reject-errors': 0
  }
})
