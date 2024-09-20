import fs from 'node:fs'
import path from 'node:path'
import { defaultSettings } from '../../config'

const { cdnUrl, cdnModules } = defaultSettings

function getModuleVersion(name: string): string {
  const pwd = process.cwd()
  const pkgFile = path.join(pwd, 'node_modules', name, 'package.json')
  if (fs.existsSync(pkgFile)) {
    const pkgJson = JSON.parse(fs.readFileSync(pkgFile, 'utf8'))
    return pkgJson.version
  }

  return ''
}

function isFullPath(path: string) {
  return path.startsWith('http:') || path.startsWith('https:') || path.startsWith('//')
}

function renderUrl(data: CdnModuleList & {
  version: string
}) {
  const { path } = data
  if (isFullPath(path))
    return path
  return cdnUrl.replace(/\{name\}/g, data.name)
    .replace(/\{version\}/g, data.version)
    .replace(/\{path\}/g, path)
}

function getCdnModuleFiles() {
  return cdnModules.map((m) => {
    const version = getModuleVersion(m.name)
    if (!version) {
      throw new Error(`modules: ${m.name} package.json file does not exist`)
    }

    let css = m.css || []
    if (!Array.isArray(css) && css) {
      css = [ css ]
    }

    return {
      js: renderUrl({
        ...m,
        version
      }),
      css
    }
  })
}

export function getExternalMap() {
  const externalMap = {}
  cdnModules.forEach((v) => {
    externalMap[v.name] = v.globalName
  })
  return externalMap
}

export default getCdnModuleFiles()
