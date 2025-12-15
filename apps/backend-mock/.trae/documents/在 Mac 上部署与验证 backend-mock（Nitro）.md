## 部署差异说明
- 使用 `Nitro` 开发/构建；`package.json` 脚本为 `nitro dev` 与 `nitro build`（apps/backend-mock/package.json:9-11）。
- `.env` 已存在，无 `.env.example`；默认端口 `PORT=5320`（apps/backend-mock/.env:1-3）。
- 未提供 PM2 配置文件；如需 PM2，需新增 `ecosystem.config.js`。
- 无通用文件日志（如 `logs/combined.log`）；错误由自定义错误处理直接写入响应（apps/backend-mock/error.ts，apps/backend-mock/nitro.config.ts:1-6）。

## 安装依赖
- 推荐：在仓库根或 `apps/backend-mock` 执行 `pnpm install`（本仓库为 pnpm 工作区）。
- 兼容：可用 `npm install`，但优先 `pnpm` 以避免工作区依赖问题。

## 开发模式验证
- 启动：在 `apps/backend-mock` 运行 `pnpm run start`（Nitro 开发，apps/backend-mock/package.json:10）。
- 端口监听：`lsof -i :5320`（端口来源 apps/backend-mock/.env:1）。
- 健康检查：
  - `curl http://localhost:5320/` → 返回 HTML（apps/backend-mock/routes/[...].ts:3-14）。
  - `curl http://localhost:5320/api/test` → 返回 `Test get handler`（apps/backend-mock/api/test.get.ts:1-3）。
  - `curl "http://localhost:5320/api/status?status=200"` → 响应 200 与错误结构（apps/backend-mock/api/status.ts:1-8）。
- CORS/OPTIONS：对任意 `/api/**` 发送 `OPTIONS` 请求应返回 204（apps/backend-mock/middleware/1.api.ts:9-13；apps/backend-mock/nitro.config.ts:7-19）。

## 生产构建与启动
- 构建：`pnpm run build`（apps/backend-mock/package.json:9）。
- 启动（二选一）：
  - `PORT=5320 node .output/server/index.mjs`（Nitro 默认 Node 预设）。
  - 或 `npx nitro preview`（预览已构建产物）。
- PM2（可选）：新增 `ecosystem.config.js` 后可执行 `pm2 start ecosystem.config.js`；监控 `pm2 monit`、日志 `pm2 logs`。

## 行为与限制
- 非开发环境对 `/api/system/**` 写操作（DELETE/PATCH/POST/PUT）将被禁止并返回 403（apps/backend-mock/middleware/1.api.ts:14-21）。
- JWT 密钥当前为硬编码（apps/backend-mock/utils/jwt-utils.ts:10-13）；`.env` 中的 `ACCESS_TOKEN_SECRET`/`REFRESH_TOKEN_SECRET` 未被使用。若需生产安全，后续可改为从环境变量读取。

## 验证清单
- 端口：`lsof -i :5320`。
- 健康：
  - `curl http://localhost:5320/`（主页 HTML）。
  - `curl http://localhost:5320/api/test`（纯文本）。
  - `curl "http://localhost:5320/api/status?status=500"`（非 200 状态模拟）。
- CORS/OPTIONS：`curl -X OPTIONS http://localhost:5320/api/test -i`，期望 `204 No Content`。
- 日志：无 `logs/combined.log`；通过错误响应与终端输出来观测。

## 后续可选增强
- 新增 `ecosystem.config.js` 以使用 PM2 管理进程与日志轮换。
- 调整 JWT 工具读取 `.env` 秘钥，替换硬编码常量。
- 若需指定不同端口，更新 `.env` 中 `PORT` 或启动命令前置 `PORT=<port>`。
