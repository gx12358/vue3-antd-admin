import type { BaseTableState, ProTableRef, RequestFunction } from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'
import { useTable } from '@gx-design-vue/pro-table'
import useTableState from './use-table-state'

export default function <T extends object = RecordType, R extends object = RecordType>(
  tableRef: Ref<ProTableRef<T> | undefined>,
  options?: {
    state?: BaseTableState<T, R>;
    request?: RequestFunction<T, R>;
  }
) {
  return useTable(tableRef, {
    state: useTableState<T, R>(options?.state || {} as any),
    request: options?.request
  })
}
