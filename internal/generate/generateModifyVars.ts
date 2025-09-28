import { resolve } from 'node:path'

export function generateModifyVars() {
  const modifyVarsParams = {
    hack: `true;  @import (reference) "${resolve('src/design/config.less')}";`
  }

  return modifyVarsParams
}
