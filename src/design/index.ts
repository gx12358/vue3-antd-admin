// 加载插件
const modules = import.meta.globEager('./plugins/*.ts')
const requirePlugin: any[] = []
Object.keys(modules).forEach((key) => {
  requirePlugin.push(key)
})
