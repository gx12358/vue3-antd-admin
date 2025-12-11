import type { BaseTableState } from '@gx-design-vue/pro-table'

const defaultSearch: BaseTableState['search'] = {
  actions: {
    reload: true
  },
  span: {
    xxl: 5,
    xl: 5,
    lg: 3
  }
}

export default {
  defaultSearch,
  defaultProps: {
    search: defaultSearch,
    draggabled: true,
    keepAliveReload: true,
  } as BaseTableState
}
