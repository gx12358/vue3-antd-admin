## 3.0.1(2024-03.28)

## 升级说明

### ✨ Refactor

- **其它**
  - `package.json`新增`"type": "module"`
  - `package.json`去除`eslint`相关插件
  - 更新`.eslintrc.js`文件为`eslint.config.js`，并引入`@antfu/eslint-config`插件
  - 更新`stylelint.config.js`文件为`esm`语法
  - 更新`prettier.config.js`文件为`esm`语法
  - 更新`commitlint.config.js`文件为`esm`语法
  - `.stylelintrc.cjs`规则修改
- **vite 插件**
  - 重构`viteMock`插件，更新为`vite-plugin-mock`最新版本，已适应esm语法
  - 新增`appConfig`代替之前的`node-postBuild.ts`脚本
  - `viteBuildInfo`更改为 `viteNotice`，打包后提示语改为在`viteNotice`的`closeBundle`函数

