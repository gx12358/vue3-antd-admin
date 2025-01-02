import type { BaseTableState } from '@gx-design-vue/pro-table'

const defaultSearch: BaseTableState['search'] = {
  type: 'button',
  actions: {
    reload: true
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
