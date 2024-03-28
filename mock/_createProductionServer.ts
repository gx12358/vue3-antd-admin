import { createProdMockServer } from '../build/vite/plugin/viteMock/client'

const modules = import.meta.glob('./datasSource/**/*.ts', { eager: true })

const mockModules: any[] = []
Object.keys(modules).forEach((key) => {
  if (key.includes('/_')) {
    return
  }
  if (modules[key] && modules[key]['default'])
    mockModules.push(...modules[key]['default'])
})

/**
 * Used in a production environment. Need to manually import all modules
 */
export function setupProdMockServer() {
  createProdMockServer(mockModules)
}
