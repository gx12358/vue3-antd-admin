# 实际执行环境 production
VITE_NODE_ENV= production

# environment 代码环境
VITE_USE_MODE = pro

# 是否开启mock
VITE_USE_MOCK = true

# 是否删除console
VITE_DROP_CONSOLE = false

# Whether to enable gzip or brotli compression
# Optional: gzip | brotli | none
# If you need multiple forms, you can use `,` to separate
VITE_BUILD_COMPRESS = 'none'

# 使用压缩时是否删除源文件，默认为false
VITE_BUILD_COMPRESS_DELETE_ORIGIN_FILE = false

# 是否使用pwa
VITE_USE_PWA = false

# 是否为打包后的文件提供传统浏览器兼容性支持
VITE_LEGACY = false

# proxy 代理的api 前缀
VITE_PROXY_PREFIX = /proApi

# api前缀
VITE_BASE_URL=/mock-server
