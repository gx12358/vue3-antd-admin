# web-admin 路由提示词

本提示词约束并指导 web-admin 的路由编写，严格遵循 `apps/web-admin/types/system.d.ts` 中的类型：`AppRouteModule`、`SystemMenuItem`、`SystemMenuMeta`，以及现有的路由聚合与守卫实现。

## 类型约束
- `AppRouteModule`：路由定义类型，字段包括：`path`、`name`、`component`、`redirect`、`children?: AppRouteModule[]`、`meta?: SystemMenuMeta`（apps/web-admin/types/system.d.ts:130）。
- `SystemMenuMeta`：路由元信息类型，支持权限与显示控制：`title`、`icon`、`permissions?: string | string[]` 等（apps/web-admin/types/system.d.ts:124）。
- `SystemMenuItem`：后端菜单项类型，用于生成动态路由，支持 `children?: SystemMenuItem[]`（apps/web-admin/types/system.d.ts:136）。

## 入口结构
- 路由创建在 `src/router/index.ts`，依据应用配置选择 `hash` 或 `browser` 模式，并注入基础路由（apps/web-admin/src/router/index.ts:23）。
- 基础路由与本地模块路由聚合在 `src/router/routes/index.ts`，使用 `import.meta.glob` 载入 `routes/modules/**/*`（apps/web-admin/src/router/routes/index.ts:3）。
- 权限守卫在 `src/router/guard/permissions.ts`，基于 `meta.permissions` 与登录状态进行跳转控制（apps/web-admin/src/router/guard/permissions.ts:24）。

## 静态模块路由写法（严格使用 AppRouteModule）
```ts
// 文件：apps/web-admin/src/router/routes/modules/dashboard.ts
const routes: AppRouteModule = {
  path: '/dashboard',
  name: 'Dashboard',
  component: () => import('@/layout/BasicLayout.vue'),
  redirect: '/dashboard/workspace',
  meta: { title: '仪表盘', icon: 'dashboard-line' },
  children: [
    {
      path: '/dashboard/workspace',
      name: 'Workspace',
      component: () => import('@/views/dashboard/workspace/index.vue'),
      meta: { title: '工作台', permissions: ['dashboard:workspace:view'] }
    },
    {
      path: '/dashboard/analytics',
      name: 'Analytics',
      component: () => import('@/views/dashboard/analytics/index.vue'),
      meta: { title: '分析页', permissions: ['dashboard:analytics:view'] }
    }
  ]
}

export default routes
```

约束说明：
- `path` 必须以 `/` 开头，子路由可使用完整路径（当前项目采用绝对路径风格）。
- `name` 必须唯一且稳定，供缓存、面包屑与权限使用。
- `component` 使用懒加载函数返回组件引用，不直接传字符串路径。
- `meta.permissions` 为权限校验依据，守卫在 `permissions.ts` 中解析并决定放行或转向 403（apps/web-admin/src/router/guard/permissions.ts:45）。

## 基础路由（登录页与异常页）
```ts
// 文件：apps/web-admin/src/router/routes/index.ts（片段）
export const basicRoutes = (type: SystemRoutesAuth) => {
  const routes = type === 'front' ? customRoutes : []
  return [
    {
      path: '/user',
      component: () => import('@/layout/UserLayout.vue'),
      name: 'UserLayout',
      redirect: '/user/login',
      children: [
        {
          path: '/user/login',
          name: 'Login',
          meta: { hidden: true, title: '登录' },
          component: () => import('@/views/user/login/index.vue')
        }
      ]
    },
    permissionRouters
  ] as AppRouteModule[]
}
```

说明：
- 异常页在 `permissionRouters` 下定义，包含 `403/404`，用于守卫不通过时的跳转（apps/web-admin/src/router/routes/index.ts:16）。

## 动态路由生成（SystemMenuItem → AppRouteModule）
后端返回的菜单结构 `SystemMenuItem[]` 经过 `routeHelper.ts` 的 `generator` 转换为 `AppRouteModule[]`（apps/web-admin/src/router/helper/routeHelper.ts:106）。关键映射：
- `path`：拼接父路径与当前项 `path`，去重斜杠。
- `name`：使用菜单 `name` 或 `componentName`。
- `component`：若为布局名（如 `BasicLayout`/`IframeLayout`）使用映射；否则通过 `asyncImportRoute` 动态引入 `views` 下的页面。
- `meta`：由菜单的展示与控制属性映射，含 `title`、`icon`、`hidden`、`hideInMenu`、`keepAlive`、`link` 等。

示例：后端菜单项（严格使用 SystemMenuItem）
```ts
const menu: SystemMenuItem = {
  name: 'Profile',
  path: 'profile',
  component: 'BasicLayout',
  title: '个人中心',
  icon: 'user-3-line',
  children: [
    {
      name: 'ProfileBasic',
      path: 'profile/basic',
      component: 'pro-pages/profile/basic/index.vue',
      title: '基础详情',
      keepAlive: true,
      permissions: ['profile:basic:view']
    }
  ]
}
```

映射结果（`generator(menu)` 输出为 AppRouteModule）：
```ts
const route: AppRouteModule = {
  path: '/profile',
  name: 'Profile',
  component: () => import('@/layout/BasicLayout.vue'),
  meta: { title: '个人中心', icon: 'user-3-line' },
  children: [
    {
      path: '/profile/basic',
      name: 'ProfileBasic',
      component: () => import('@/views/pro-pages/profile/basic/index.vue'),
      meta: { title: '基础详情', keepAlive: true, permissions: ['profile:basic:view'] }
    }
  ]
}
```

## 权限与守卫
- 守卫在 `permissions.ts` 中：
  - 校验登录与白名单（apps/web-admin/src/router/guard/permissions.ts:25）。
  - 在存在 `meta.permissions` 时，通过 `useAuth` 判断是否具备访问权限，否则跳转 `/exception/403`（apps/web-admin/src/router/guard/permissions.ts:45）。
  - 登录后若无角色，调用 `userStore.checkUserPermission()` 拉取并注入后端路由（apps/web-admin/src/router/guard/permissions.ts:61）。

## 编写规范（必须遵循）
- 所有 `routes/modules/*` 文件默认导出 `AppRouteModule | AppRouteModule[]`。
- 子路由 `children` 必须是 `AppRouteModule[]`，且每个子项包含 `path`、`name`、`component` 与 `meta`（如需）。
- 需要权限控制的页面必须在 `meta.permissions` 中声明对应字符串或字符串数组。
- 页面组件路径必须与 `views` 目录保持一致，动态导入能正确解析；避免同层同名 `.vue` 与 `.tsx` 文件以防解析冲突（apps/web-admin/src/router/helper/routeHelper.ts:61）。
- 外链页面使用 `IframeLayout` 并设置 `link` 与 `linkStatus`，保持与 `SystemMenuItem` 字段一致（apps/web-admin/src/router/helper/routeHelper.ts:166）。

## 快速模板
```ts
const routes: AppRouteModule = {
  path: '/feature',
  name: 'Feature',
  component: () => import('@/layout/BasicLayout.vue'),
  redirect: '/feature/index',
  meta: { title: '特性' },
  children: [
    {
      path: '/feature/index',
      name: 'FeatureIndex',
      component: () => import('@/views/feature/index.vue'),
      meta: { title: '概览', permissions: ['feature:index:view'] }
    }
  ]
}

export default routes
```
