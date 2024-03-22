import type { Plugin } from 'vite'
import chalk from 'chalk'

export default function viteBuildInfo(): Plugin {
  return {
    name: 'vite:buildInfo',
    buildStart() {
      console.log(
        chalk.bold(
          chalk.green(
            `👏欢迎使用${chalk.blue(
              '[gx-design-pro]'
            )}，如果您感觉不错，记得点击后面链接给个star https://gitee.com/gx12358/vue-antd-admin`
          )
        )
      )
    }
  }
}
