---
trigger: always_on
---

# vue3-antd-admin

你是一名高级前端开发工程师。本提示词用于指导大模型在本仓库（vue3-antd-admin）内进行开发与分析

## 项目特点
- Monorepo 管理多应用：`apps/web-admin`（管理端）、`apps/backend-mock`（接口模拟），以及 `internal` 共享工具与配置。
- 技术栈：Vue3 + TypeScript + Vite5 + Ant Design Vue + Pinia + Vue Router + UnoCSS。
- 内置路由守卫与权限体系、请求封装、主题与设计系统、Mock 后端。

## 核心配置文件
- [apps/web-admin/package.json](mdc:apps/web-admin/package.json) - 管理端依赖与脚本
- [apps/web-admin/vite.config.ts](mdc:apps/web-admin/vite.config.ts) - 管理端 Vite 构建配置
- [apps/web-admin/unocss.config.ts](mdc:apps/web-admin/unocss.config.ts) - UnoCSS 配置
- [apps/web-admin/src/router/index.ts](mdc:apps/web-admin/src/router/index.ts) - 路由入口与模块
- [apps/web-admin/src/router/guard/permissions.ts](mdc:apps/web-admin/src/router/guard/permissions.ts) - 路由权限守卫
- [apps/web-admin/src/store/index.ts](mdc:apps/web-admin/src/store/index.ts) - Pinia 初始化与 Store 出口
- [apps/web-admin/src/services/base.ts](mdc:apps/web-admin/src/services/base.ts) - 请求客户端与拦截器
- [apps/web-admin/config/network.ts](mdc:apps/web-admin/config/network.ts) - 网络配置（超时与成功 code）
- [apps/backend-mock/nitro.config.ts](mdc:apps/backend-mock/nitro.config.ts) - Mock 服务配置

## 主要目录结构
```
vue3-antd-admin
├─ apps/
│  ├─ web-admin/                               # 管理端应用
│  │  ├─ src/
│  │  │  ├─ common/                            # 通用常量、表格配置等
│  │  │  ├─ components/                        # 业务通用组件（AntD/Pro 组件封装）
│  │  │  ├─ core/                              # 设计系统/指令注册/AntD 组件注册
│  │  │  ├─ design/                            # 全局样式与设计规范
│  │  │  ├─ hooks/                             # 业务与 Web 层 Hooks
│  │  │  ├─ layout/                            # 布局组件（BasicLayout 等）
│  │  │  ├─ plugins/                           # 第三方插件适配（dayjs 等）
│  │  │  ├─ router/                            # 路由与守卫、模块化路由
│  │  │  ├─ services/                          # 请求封装与业务 API
│  │  │  ├─ store/                             # Pinia Store 模块
│  │  │  ├─ utils/                             # 工具方法（token/env/storage 等）
│  │  │  └─ views/                             # 页面视图（仪表盘、系统、Pro 等）
│  │  ├─ config/                               # 应用配置（app、network 等）
│  │  ├─ types/                                # 类型声明
│  │  ├─ index.html
│  │  ├─ vite.config.ts                        # Vite 配置
│  │  └─ unocss.config.ts                      # UnoCSS 配置
│  └─ backend-mock/                            # Nitro Mock 服务
│     ├─ api/                                  # 业务接口（demo/system/...）
│     ├─ middleware/                           # 中间件（如统一接口前缀）
│     ├─ routes/                               # Nitro 路由入口
│     ├─ utils/                                # 模拟数据、JWT、响应封装
│     ├─ nitro.config.ts                       # Nitro 配置
│     └─ package.json
├─ packages/                                   # 共享包（以 @gx/* 暴露）
│  ├─ @core/
│  │  ├─ base/design/                          # 全局设计系统（CSS/Design Tokens/Less 配置）
│  │  └─ base/shared/                          # 通用工具与缓存（env/format/validate 等）
│  ├─ config/                                  # 应用与网络等统一配置导出（@gx-config）
│  ├─ effects/
│  │  ├─ access/                               # Token 与访问控制工具（@gx/access）
│  │  ├─ common-ui/                            # 通用 UI 组件集（编辑器/图标/上传 等）
│  │  ├─ hooks/                                # 业务 Hooks（SWR/ECharts/use-request 等）
│  │  └─ request/                              # 请求客户端与拦截器（@gx/request）
│  ├─ styles/                                  # 全局样式与 AntD 定制（@gx/styles）
│  └─ types/                                   # 共享类型定义（@gx/types）
├─ internal/                                   # 内部共享工具与工程配置
│  ├─ unocss-config/                           # UnoCSS 共享预设与规则（@gx/unocss-config）
│  ├─ vite-config/                             # Vite 共享配置与插件
│  ├─ tsconfig/                                # TS 配置预设（base/web/node/library）
│  └─ node-utils/                              # Node 工具库（fs/git/hash/monorepo 等）
├─ .husky/                                     # Git Hooks
├─ .lingma/                                    # IDE/Agent 规则与提示词
├─ 构建与工程文件                              # eslint/commitlint/cspell/README 等
└─ index.html                                  # 根 HTML（部分工具用途）
```

## 开发命令
- `pnpm -F @gx/web-admin dev` - 启动管理端开发环境
- `pnpm -F @gx/web-admin dev:pro` - 管理端以 `pro` 模式启动
- `pnpm -F @gx/web-admin build` - 管理端构建生产版本
- `pnpm -F @gx/web-admin preview` - 管理端本地预览
- `pnpm -F @gx/backend-mock start` - 启动 Mock 服务（Nitro）

## Vue 组件规范
- 使用 Composition API 与 `<script setup lang="ts">`。
- 组件文件使用 PascalCase 命名；页面位于 `views/`，局部组件位于页面下的 `components/`。
- 优先使用 Ant Design Vue 与 `@gx-design-vue/*` 系列 Pro 组件。

## TypeScript 规范
- 严格使用 TypeScript，避免 `any`；为 API 响应定义清晰类型。
- 使用 `interface` 定义对象结构，`type` 定义联合类型；导入类型使用 `import type`。

## 状态管理
- 使用 Pinia，`store/modules/*` 为模块化 Store；在 `store/index.ts` 初始化与导出。
- 用户与权限：`modules/user.ts`、`modules/permission.ts`；动态路由在权限校验后注入。

## UnoCSS 原子化 CSS
- 使用 UnoCSS（`unocss.config.ts`），结合 `@gx/unocss-config` 共享规则，优先使用原子类减少自定义 CSS。

## 路由与权限
- 路由守卫在 `router/guard/permissions.ts`：白名单、登录拦截、基于 `meta.permissions` 的鉴权，缺失权限跳转 403。
- 支持根据后端返回动态注入路由，登录后通过 `userStore.checkUserPermission()` 获取并注册。

## 网络请求约定
- 请求客户端在 `services/base.ts`：统一超时、URL 拼接、携带 Token（`Authorization`、`tenant-id`）。
- 成功 code 在 `config/network.ts` 维护（默认 `[200, 0]`），错误统一在拦截器内处理并提示。
- 环境变量：`VITE_BASE_URL`、`VITE_PROXY_PREFIX` 控制基础地址与是否走 Mock。

## 页面与组件开发
- 页面位于 `views/`，路由位于 `router/routes/modules/`，统一走守卫；通用业务组件位于 `components/`。
- 封装表格、上传、编辑器等 Pro 组件在 `views/pro-components/` 与 `@gx-design-vue/*` 下。

## 示例代码结构
```vue
<script setup lang="ts">
import { Button, message } from 'ant-design-vue'
import { requestClient } from '@/services/base'
import { useStoreUser } from '@/store/modules/user'

const userStore = useStoreUser()

async function loadProfile() {
  try {
    const data = await requestClient.get('/system/user/profile/get')
    message.success(`欢迎，${data?.nickname || '用户'}`)
  } catch (e) {
    // 错误已在拦截器统一提示，这里可按需处理
  }
}
</script>

<template>
  <div class="p-4">
    <Button type="primary" @click="loadProfile">
      加载资料
    </Button>
  </div>
</template>
```

## 生命周期
- 遵循 Vue3 生命周期与 Composition API 规范；路由进入前通过守卫进行权限与动态路由处理。

## 贡献约定
- 遵循现有目录与模块化约定；新增页面需在路由模块注册并设置 `meta.permissions`（如有权限要求）。
- 新增 API 统一放在 `services/*`；为响应与请求参数补充类型；必要时扩展拦截器处理。
---
trigger: always_on
---
