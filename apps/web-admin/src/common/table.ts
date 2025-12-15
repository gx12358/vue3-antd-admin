import type { BaseTableState } from '@gx-design-vue/pro-table'

const defaultSearch: BaseTableState['form'] = {
  actions: {
    resetReload: true
  },
  autoRequest: false,
  span: {
    xxl: 5,
    xl: 5,
    lg: 3
  },
  label: {
    gap: 16
  }
}

export default {
  defaultSearch,
  defaultProps: {
    form: defaultSearch,
    draggabled: true,
    keepAliveReload: true,
  } as BaseTableState
}
