## 4.0.1 (2025-01-07)

### Upgrade Notes

### ✨ CHORE

- **Dependency Upgrades**
  - Upgrade project dependencies to the latest stable versions
  - Optimize monorepo package management configuration

### ✨ REFACTOR

- **Table System Refactor**
  - Refactor Table-related hooks to improve type inference and code reusability
  - Optimize Table Actions component encapsulation and unify button interaction standards
- **System Management Module**
  - Enhance functionality and interaction experience for all pages in the system management module
  - Improve form validation logic and data processing workflow
  - Unify list page layout and operation standards

### ✨ FIX

- **Build Optimization**
  - Fix build issues in the monorepo architecture
  - Optimize Turbo cache strategy
- **Type Definitions**
  - Improve TypeScript type declarations
  - Fix issues with type inference in certain cases

## 4.0.0 (2025-11-01)

## Upgrade Instructions

### ✨ CHORE

- **Architecture Upgrade**
    - Adopted the same [turbo](file:///Users/gaoxiang/Documents/工作/工作项目/gx12358/vue/github/vue3-antd-admin/node_modules/turbo) + `monorepo` architecture as `vben-admin`, improving project management and build efficiency
    - Set `"type": "module"` in [package.json](/Users/gaoxiang/Documents/工作/工作项目/gx12358/vue/github/vue3-antd-admin/package.json), fully supporting ES Module
    - Integrated [turbo](file:///Users/gaoxiang/Documents/工作/工作项目/gx12358/vue/github/vue3-antd-admin/node_modules/turbo) build tool, optimizing multi-package dependency management and incremental builds
    - Used `pnpm` workspace to manage dependencies, reducing disk usage and installation time

### ✨ REFACTOR

- **Project Structure Refactoring**
    - Reorganized project directory structure based on `monorepo` architecture, separating different application modules
    - Introduced `@gx` namespace for unified management of internal package dependencies
    - Refactored build configuration, using [turbo](file:///Users/gaoxiang/Documents/工作/工作项目/gx12358/vue/github/vue3-antd-admin/node_modules/turbo) to centrally manage multi-package build processes
    - Optimized `scripts` commands to support cross-package parallel execution

### ✨ FEAT

- **New Architecture Features**
    - Support for independent development and deployment of multiple applications
    - Unified maintenance of shared components and utility libraries
    - Added [turbo](file:///Users/gaoxiang/Documents/工作/工作项目/gx12358/vue/github/vue3-antd-admin/node_modules/turbo) caching mechanism, significantly improving build speed
    - Integrated `changeset` version management tool for standardized release process

### ✨ FIX

- **Dependency Management Optimization**
    - Resolved multi-package dependency version conflicts
    - Fixed cross-package reference path issues
    - Optimized `pnpm` installation scripts to ensure correct dependency resolution
    - Unified development environment configuration to avoid issues caused by environment differences

## 3.1.0 (2025-10-18)

## Upgrade Instructions

### ✨ CHORE

- **Plugin Upgrades**
    - [@gx-design-vue/***] series components upgraded to the latest version, with related code refactored
    - [vue] upgraded to `^3.5.22`
    - [vue-router] upgraded to `^4.6.3`
    - [@antfu/eslint-config] upgraded to `^6.0.0`

### ✨ REFACTOR

- **Configuration Structure Optimization**
    - Reorganized and restructured configuration items in [defaultSettings.ts](/config/default/defaultSettings.ts)
    - Added [theme](/public/js/tinymce/tinymce.d.ts#L1504-L1504) configuration item, supporting system theme mode switching
    - Integrated [router](/src/router/index.ts#L22-L25) configuration items, including [mode](/public/js/tinymce/tinymce.d.ts#L2069-L2069), `whiteList`, `recordRoute` and [auth](/src/components/GlobalLayout/AuthGroup/index.vue#L10-L10) parameters
    - Optimized [token](/src/store/modules/user.ts#L14-L14) storage configuration, supporting refresh tokens and storage type configuration
- **Build System Refactoring**
    - Removed `rollupOptions/optimizer.ts` file, optimized code splitting strategy
    - Replaced [rollup] with [rolldown], improving build performance
    - Refactored code splitting `groups` configuration
- **CDN and Resource Management**
    - Removed multiple internal tool files, simplified CDN management logic
    - Refactored HTML template injection logic, supporting theme CSS injection
- **Mock System Optimization**
    - Adjusted [vite-plugin-fake-server] plugin configuration, disabled log output
    - Optimized mock route path naming conventions, unified to use kebab-case naming

### ✨ FEAT

- **Theme Support**
    - Added system theme configuration support, can set `light` or `dark` mode in `data-theme` attribute
    - Supports automatic detection of user preferred theme mode
    - After `ProLayout` upgrade, optimized theme color matching, refactored system settings interface
- **Dependency Enhancement**
    - Added [color] dependency package, enhanced color processing capabilities

### ✨ FIX

- **Path and Naming Conventions**
    - Unified route path naming conventions, all changed to kebab-case format
    - Corrected multiple component paths and redirect paths
- **Login**
  - 
    - Corrected login interface parameter name from [userName](/apps/web-admin/mock/routers/profile/basic.fake.ts#L12-L12) to [username](/src/views/user/login/index.vue#L12-L12)
    - Unified interface return fields, using [message](/src/utils/request/checkStatus.ts#L33-L33) instead of `msg`
- **HTML Template**
    - Optimized loading animation SVG icons
    - Adjusted resource file reference paths
- **Component Upgrade Adaptation**
    - `ProTable` uses `usePorTable` from `hooks` instead of `ProTable` native method `useTable` to make it more suitable for project use
    - Removed `ProForm` and `ProField` components, and removed related component pages and code

## 3.0.8 (2025-02-27)

## Upgrade Notes

### ✨ CHORE

- **Plugins**
  - Upgraded `@gx-design-vue/***` to the latest version
  - Upgraded plugins like `vite` to their latest versions

### ✨ REFACTOR

- **prettier, editorconfig**
  - Removed `prettier` and `editorconfig` plugins, unified code style management using `@antfu/eslint-config`
- **useRequest**
  - Refactored `useRequest` to improve performance and maintainability

### ✨ FIX

- **@gx-design-vue**
  - Refactored code to accommodate updates for `@gx-design-vue/***`

### ✨ TYPES

- Adjusted `TableRecord` type in `types/system.d.ts`
- Used `types/system.d.ts` `SystemMenuItem` for global system menu type
- Used `types/system.d.ts` `AppRouteModule` for global system route type

## 3.0.7 (2025-01-02)

## Upgrade Notes

### ✨ CHORE

- **Plugins**
  - Updated `@gx-design-vue/***` to the latest version
  - Upgraded `vite` and related plugins to the latest versions

### ✨ REFACTOR

- **Build Directory**
  - Refactored to `internal/vite-config` for easier migration to `pnpm-workspace` in the future
  - Removed less frequently used plugins like `vite-plugin-pwa`
- **Mock**
  - Removed `mock`, `viteMock`, and related plugins
  - Added `vite-plugin-fake-server` and `@faker-js/faker` plugins, with `mock` now using `faker`
  - Refactored `mock`, including usage methods and local token validation
- **config/default/defaultSettings.ts**
  - Consolidated and reorganized parameters
- **Pro Layout (`@gx-design-vue/pro-layout`)**
  - Adjusted `props` parameters to align with the refactored `@gx-design-vue/pro-layout` plugin
- **src/store**
  - Removed `PiniaStoreValue` type; added `omitEmpty` parameter to `useReactiveState` for merging purposes

### ✨ FIX

- **Pro Table**
  - Refactored code to accommodate `useTable` upgrades
  - Adjusted `props` parameters to align with the refactored `@gx-design-vue/pro-table` plugin
- **utils/request**
  - Added the `VITE_PROXY_PREFIX` prefix to `baseUrl`
- **utils/accessToken**
  - Token storage no longer uses concatenated names
- **utils/storage**
  - Fixed an issue where `getStorage` returned empty values despite having data
- **eslint**
  - Adopted the `@antfu/eslint-config` plugin and formatted global code accordingly

### ✨ TYPES

- **types/mock.d.ts**
  - Refactored types to support the `@faker-js/faker` plugin
- **SettingConfig**
  - Refactored the `SettingConfig` type
- **ViteEnv**
  - Added `VITE_PROXY_PREFIX` and `VITE_IS_MOCK` environment variables
- **system.d.ts**
  - Consolidated plugin types into `system.d.ts`

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



