import type { Ref } from 'vue'
import { reactive, ref, unref, watch, watchEffect } from 'vue'
import type { ProColumns } from '../types/column'
import { genColumnKey } from '../utils'

export type SettingsOperationType = 'fixed' | 'drop' | 'show' | undefined

export type ColumnsState = {
  show?: boolean;
  fixed?: 'right' | 'left' | boolean | undefined;
  order?: number;
  disable?:
    | boolean
    | {
    checkbox: boolean;
    icon: boolean;
  };
};

export type SettingsAction = {
  autoScroll?: Ref<boolean>,
  sortKeyColumns: Ref<string[]>,
  columnsMap: Record<string, ColumnsState>,
  operationType: Ref<SettingsOperationType>,
  setSortKeyColumns: (value: string[]) => void;
  cacheColumnsMap: Record<string, ColumnsState>,
  setColumnsMap: (value: Record<string, ColumnsState>, key?: SettingsOperationType) => void;
}

export type ColumnsStateType = {
  value?: Record<string, ColumnsState>;
  onChange?: (map: Record<string, ColumnsState>) => void;
};

export function useColumnSetting({ columns, columnsState, changeColumns }: {
  columns: Ref<ProColumns>;
  columnsState: Ref<ColumnsStateType>;
  changeColumns?: (map: Record<string, ColumnsState>, fixed: boolean) => void;
}) {
  const operationType: Ref<SettingsOperationType> = ref(undefined)
  const columnsMap = reactive<Record<string, ColumnsState>>({})
  const cacheColumnsMap = reactive<Record<string, ColumnsState>>({})
  const defaultColumnKeyMap = reactive<Record<string, ColumnsState>>({})
  // 用于排序的数组
  const sortKeyColumns: Ref<string[]> = ref([])

  /** 默认全选中 */
  watch(() => columns.value, () => {
    unref(columns)?.forEach(({ show, key, fixed }, index) => {
      const columnKey = genColumnKey(key as string, index)
      if (columnKey) {
        defaultColumnKeyMap[columnKey] = { show: show === undefined ? true : show, fixed }
      }
    })
  }, {
    deep: true,
    immediate: true
  })

  watch(() => columns.value, () => {
    // 重新生成key的字符串用于排序
    const columnKeys = unref(columns).map((item) => item.key) as string[]
    setSortKeyColumns(columnKeys)
  }, {
    deep: true,
    immediate: true
  })

  watchEffect(() => {
    const columnKeysMap = {
      ...(unref(columnsState)?.value),
      ...unref(defaultColumnKeyMap)
    }
    Object.assign(columnsMap, columnKeysMap)
    Object.assign(cacheColumnsMap, columnKeysMap)
  })

  function setColumnsMap(value: Record<string, ColumnsState>, key?: SettingsOperationType) {
    operationType.value = key
    Object.assign(columnsMap, value)
    changeColumns(columnsMap, key === 'fixed')
  }

  function setSortKeyColumns(keys: string[]) {
    sortKeyColumns.value = keys
  }

  return {
    columnsMap,
    operationType,
    setColumnsMap,
    sortKeyColumns,
    cacheColumnsMap,
    setSortKeyColumns,
  } as SettingsAction
}
