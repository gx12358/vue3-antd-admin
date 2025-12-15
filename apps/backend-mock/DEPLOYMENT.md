# backend-mock 阿里云 ECS 部署指南（Nitro）

## 目标环境
- 云服务器：阿里云 ECS（示例以 Ubuntu 22.04 为例，CentOS 类似）
- 域名：`api.example.com`（按需替换）
- 端口：应用监听 `5320`，通过 Nginx 暴露 80/443

## 前置要求
- Node.js ≥ 16（推荐 18+ LTS）
- 包管理器：`pnpm`（推荐）或 `npm`
- 已开放安全组与系统防火墙：`80`、`443`（对公网），`5320`（仅本机或内网）
- 已安装：`git`、`nginx`（反向代理）、`pm2`（进程守护，可选）

### 安全组与防火墙放行
1. 阿里云控制台 → ECS → 安全组 → 入方向规则：添加 `80`、`443`（源 `0.0.0.0/0`）
2. 服务器上放行端口（Ubuntu/ufw 示例）：
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

## 系统准备
```bash
# 登录服务器
ssh <user>@<ecs-ip>

# 安装 Node（nvm 推荐）
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh"
nvm install --lts
nvm use --lts

# 安装 pnpm / pm2 / nginx / git / certbot（按需）
curl -fsSL https://get.pnpm.io/install.sh | sh -
sudo npm i -g pm2
sudo apt update && sudo apt install -y nginx git
sudo snap install core; sudo snap refresh core
sudo snap install --classic certbot
sudo ln -s /snap/bin/certbot /usr/bin/certbot
```

## 代码目录与依赖安装
```bash
sudo mkdir -p /srv/backend-mock && sudo chown $USER:$USER /srv/backend-mock
cd /srv/backend-mock
git clone <your_repo_url>
cd vue3-antd-admin/apps/backend-mock
# 推荐使用 pnpm（工作区适配更好）
pnpm install --frozen-lockfile
# 如使用 npm
# npm install --production
```
```bash
git clone <your_repo_url>
cd vue3-antd-admin/apps/backend-mock
# 推荐使用 pnpm（工作区适配更好）
pnpm install --frozen-lockfile
# 如使用 npm
# npm install --production
```

## 配置环境变量
在 `apps/backend-mock` 下创建或编辑 `.env`（生产环境务必替换为强随机密钥）：
```bash
PORT=5320
ACCESS_TOKEN_SECRET=<random_access_secret>
REFRESH_TOKEN_SECRET=<random_refresh_secret>
```
说明：JWT 工具已读取上述环境变量，未设置时将回退为内置默认值（不建议在生产使用默认值）。

## 构建与启动（生产）
```bash
# 构建产物
pnpm run build

# 直接启动（Node 预设）
PORT=5320 NODE_ENV=production node .output/server/index.mjs
```
访问 `http://<server-ip>:5320/` 验证首页，或使用以下接口进行健康检查：
- `GET /api/test` → 期望 `200`
- `GET /api/status?status=200` → 期望 `200` 与错误结构

## 离线产物部署（本地打包上传 + PM2 启动）
适用于本地构建好后，仅将产物上传到服务器运行的场景。

### 1. 本地打包
```bash
cd vue3-antd-admin/apps/backend-mock
pnpm run build
# 只打包运行所需内容
tar -czf backend-mock-artifact.tgz .output ecosystem.config.js
```

### 2. 上传到服务器
```bash
scp backend-mock-artifact.tgz <user>@<ecs-ip>:/srv/backend-mock/
```

### 3. 服务器解压与准备
```bash
ssh <user>@<ecs-ip>
sudo mkdir -p /srv/backend-mock && sudo chown $USER:$USER /srv/backend-mock
cd /srv/backend-mock
tar xzf backend-mock-artifact.tgz
mkdir -p logs

# 可选：若存在 .output/server/package.json 且有依赖
cd .output/server && npm install --production
cd /srv/backend-mock
```

### 4. 设置环境变量
- 推荐通过 PM2 配置（`ecosystem.config.js` 中 `env` 字段）
- 或在 shell 中导出后再启动：
```bash
export PORT=5320 ACCESS_TOKEN_SECRET=<secret> REFRESH_TOKEN_SECRET=<secret>
```

### 5. 使用 PM2 启动
```bash
# 如未安装 pm2： npm i -g pm2
pm2 start ecosystem.config.js
pm2 status
pm2 logs
pm2 save && pm2 startup systemd
```

### 6. 验证
```bash
curl -i http://<ecs-ip>:5320/
curl -i http://<ecs-ip>:5320/api/test
curl -i "http://<ecs-ip>:5320/api/status?status=500"
```

### 一键打包与部署（示例）
```bash
# 本地
cd vue3-antd-admin/apps/backend-mock \
  && pnpm run build \
  && tar -czf backend-mock-artifact.tgz .output ecosystem.config.js

# 上传
scp backend-mock-artifact.tgz <user>@<ecs-ip>:/srv/backend-mock/

# 服务器
ssh <user>@<ecs-ip> 'cd /srv/backend-mock && tar xzf backend-mock-artifact.tgz && mkdir -p logs && pm2 start ecosystem.config.js && pm2 save'
```

## 使用 PM2 管理（推荐）
项目已包含 `ecosystem.config.js`，可直接使用：
```bash
pnpm run build
mkdir -p logs
pm2 start ecosystem.config.js
pm2 status
pm2 logs

# 设置开机自启
pm2 save
pm2 startup systemd
```
默认日志输出至 `logs/combined.log` 与 `logs/error.log`。

## Nginx 反向代理与 HTTPS（推荐）
示例将 `api.example.com` 代理至本地端口 `5320`：
```nginx
server {
  listen 80;
  server_name api.example.com;

  location / {
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_pass http://127.0.0.1:5320;
  }
}
```
申请证书并自动配置 HTTPS（Ubuntu/certbot 示例）：
```bash
sudo certbot --nginx -d api.example.com
# 验证成功后，自动生成 443 配置与证书；证书续期：
sudo certbot renew --dry-run
```

## 行为与安全提示
- 非开发环境下，对 `/api/system/**` 的 `DELETE/PATCH/POST/PUT` 写操作会被禁止并返回 403（演示环境保护）。
- 当前全局启用 `CORS` 并允许 `*`，建议在生产通过 Nginx 限制来源或按需求调整。
- 强烈建议为 `ACCESS_TOKEN_SECRET` 与 `REFRESH_TOKEN_SECRET` 使用强随机值，并妥善保管。

## 维护与监控
- 进程监控：`pm2 monit`
- 查看日志：`pm2 logs`
- 平滑重载：`pm2 reload backend-mock`
- 更新部署：拉取代码 → `pnpm install` → `pnpm run build` → `pm2 reload`

## 故障排查
- 端口占用：`lsof -i :5320`，必要时更换端口或释放占用。
- 环境变量未生效：确认在启动命令或 `ecosystem.config.js` 中设置了 `PORT` 与秘钥。
- Node 版本不兼容：使用 `node -v` 检查，优先 LTS。
- 写操作被禁止：检查请求路径是否在 `/api/system/**`，生产环境是预期行为。
 - 域名解析：在域名 DNS 供应商（或阿里云解析）中将 `api.example.com` 指向 ECS 公网 IP。
 - 防火墙与安全组：确认安全组入方向已放行 80/443，系统防火墙已放行。

## 常用验证命令
```bash
curl -i http://localhost:5320/
curl -i http://localhost:5320/api/test
curl -i "http://localhost:5320/api/status?status=500"
curl -i -X OPTIONS http://localhost:5320/api/test
```

## 文件定位
- 启动脚本：`apps/backend-mock/package.json`
- 环境变量：`apps/backend-mock/.env`
- PM2 配置：`apps/backend-mock/ecosystem.config.js`
- 路由与中间件：`apps/backend-mock/api/**`、`apps/backend-mock/middleware/1.api.ts`
