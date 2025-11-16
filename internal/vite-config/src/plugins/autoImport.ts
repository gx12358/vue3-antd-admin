import autoImport from 'unplugin-auto-import/vite'
import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'
import Components from 'unplugin-vue-components/vite'

const importsModules: any[] = [ 'vue', 'vue-router' ]

export function createAutoImport() {
  return [
    autoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/ // .md
      ],
      imports: importsModules,
      dts: 'types/auto-imports.d.ts',
      dirs: [ 'src/store' ]
    }),
    Components({
      resolvers: [ AntDesignVueResolver({ importStyle: false, resolveIcons: true }) ],
      dts: 'types/ant-design-import.d.ts'
    })
  ]
}
