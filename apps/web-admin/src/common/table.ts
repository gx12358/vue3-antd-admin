import type { BaseTableState } from '@gx-design-vue/pro-table'

export default {
  defaultProps: {
    options: {
      reload: true,
      fullScreen: false
    },
    draggable: true,
    keepAliveReload: true,
  } as BaseTableState
}
