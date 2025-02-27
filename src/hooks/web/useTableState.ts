import type { BaseTableState } from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'
import { table } from '@/common'
import { deepMerge } from '@gx-design-vue/pro-utils'
import { cloneDeep } from 'lodash-es'
import { reactive } from 'vue'

const { defaultProps } = table

export default function <T extends object = RecordType, R extends object = RecordType>(
  state: BaseTableState<T, R>
): BaseTableState<T, R> {
  const tableState = reactive(deepMerge<BaseTableState<T, R>>(
    cloneDeep(defaultProps),
    state as any,
    { omitNil: false, omitEmpty: false }
  ) as BaseTableState<T, R>)

  return tableState as unknown as BaseTableState<T, R>
}
