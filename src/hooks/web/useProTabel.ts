import type { BaseTableState, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'
import { useTable } from '@gx-design-vue/pro-table'
import useTabelState from './useTabelState'

export default function <T extends object = RecordType, R extends object = RecordType>(
  tableRef: Ref<ProTableRef<T> | undefined>,
  options?: {
    state?: BaseTableState<T, R>;
    request?: RequsetFunction<T, R>;
  }
) {
  return useTable(tableRef, {
    state: useTabelState<T, R>(options?.state || {} as any),
    request: options?.request
  })
}
