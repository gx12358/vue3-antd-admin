import { resolve } from 'node:path'
import { theme } from 'ant-design-vue'

export function generateModifyVars() {
  const { defaultAlgorithm, defaultSeed } = theme

  const mapToken = defaultAlgorithm(defaultSeed)
  const modifyVarsParams = {
    ...mapToken,
    hack: `true;  @import (reference) "${resolve('src/design/config.less')}";`
  }

  return modifyVarsParams
}
