## 3.0.1(2024-03.28)

## Upgrade instructions

### ✨ Refactor

- **Others**
  - `package.json`add`"type": "module"`
  - `package.json` Remove `eslint` related plugins
  - Updated the `.eslintrc.js` file to `eslint.config.js` and introduce the `@antfu/eslint-config` plugin
  - Updated `.eslintrc.js` file to `esm` syntax
  - Updated `stylelint.config.js` file to `esm` syntax
  - Updated `prettier.config.js` file to `esm` syntax
  - Updated `commitlint.config.js` file to `esm` syntax
  - `.stylelintrc.cjs` Rule modification
- **Vite Plugins**
  - Refactoring the `viteMock` plugin and updating it to the latest version of `vite-plugin-mock`' to adapt to the ESM syntax
  - Add `appConfiguration` to replace the previous `postBuild` script
  - Change `viteBuildInfo` to `viteNotice`, and after packaging, the prompt language will be changed to the `closeBundle` function in `viteNotice`

### ✨ Features

- Add `CHANGELOG` Markdown
- Add `CHANGELOG.en_US` Markdown
- Add `CHANGELOG.zh_CN` Markdown



