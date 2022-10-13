import autoImport from 'unplugin-auto-import/vite'
// import Components from 'unplugin-vue-components/vite'
// import { AntDesignVueResolver } from 'unplugin-vue-components/resolvers'

export function createAutoImport() {
  return [
    autoImport({
      include: [
        /\.[tj]sx?$/, // .ts, .tsx, .js, .jsx
        /\.vue$/, /\.vue\?vue/, // .vue
        /\.md$/, // .md
      ],
      imports: [
        'vue',
        'vue-router'
      ],
      dts: 'types/auto-imports.d.ts'
    }),
    // Components({
    //   resolvers: [
    //     AntDesignVueResolver()
    //   ],
    //   dts: 'types/components.d.ts'
    // })
  ]
}
