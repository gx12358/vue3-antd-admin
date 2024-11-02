## 3.0.6 (2024-11-02)

## Upgrade instructions

### ✨ CHORE

- **Plugins**
  - `@gx-design-pro/pro-table` optimized type hints for the `useTable` hooks and refactored.
  - `@gx-design-pro/pro-layout`
    - Added multiple variables to `layout-token` for easier theme customization.
    - Fixed theme color issues not applying in multimode.
    - Introduced the `ProAppPage` component to simplify system usage.
  - `@gx-design-pro/image`
    - Refactored several API methods.
    - Redesigned the `ImagePreview` component with style adjustments.
  - Updated versions of multiple plugins.

### ✨ FIX

- **Pro Table**
  - Refactored code in response to the `useTable` upgrade.
- **Store**
  - Used the `useReactiveState` hooks method and `PiniaStoreValue` type to improve type hints for `useStore`.
- **useForm**
  - Changed `ant`'s `useForm` to `useProForm` for improved type hints.
- **ESLint**
  - Adopted the `@antfu/eslint-config` plugin and formatted the global code.

## 3.0.5(2024-09.06)

## Upgrade instructions

### ✨ CHORE

- **Plugins**
  - Upgrade the versions of `@gx-desing-pro/****`, `vue` plugins in `package.json`

### ✨ FIX

- **Pro Layout**
  - Fix the `layout` style of `ProLayout` not working in dark mode
  - Adjust the theme configuration scheme of `ProLayout` to `theme:layout` mode to achieve theme color matching in multiple modes
- **Pro Provider**
  - Adjust the value of `hashId` to `ant:hashId` to solve the problem of dark mode not working
  - Add a new `theme:layout` value to `token:layout` to solve the problem of ineffective multimode color matching in `ProLayout`

## 3.0.4(2024-07.01)

## Upgrade instructions

### ✨ CHORE

- **Plugins**
  - Upgrade the versions of `vite`, `vue`, and `ant-design-vue` plugins in `package.json`

### ✨ FIX

- **Dayjs**
  - Fix errors in `dayjs` when using `local` and `build` in version `vite5`, by writing the `local` configuration file of `dayjs` to the local system

## 3.0.3(2024-04.25)

## Upgrade instructions

### ✨ FIX

- **Plugins**
  - Fix `roll up plugin visualizer` causing `report` failure in version `vite5`

## 3.0.3(2024-04.10)

## Upgrade instructions

### ✨ Feat

- **Others**
  - `config` add `theme` themeConfig

### ✨ Refactor

- **ThemeConfig**
  - `BasicLayout.vue` add `state` move to `store/global`
  - `store/global`
    - add `layout`

## 3.0.2(2024-04.02)

## Upgrade instructions

### ✨ Feat

- **Others**
  - `.env`Add`VITE_GITHUB_PAGE``VITE_GITEE_PAGE`environment
  - `assets/public_icon/`Add`gitee``github`Icon
- **GlobalLayout/RightContent component**
  - Add`gitee``github`Icon and Address Redirection

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



