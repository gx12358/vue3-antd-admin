import type { Ref, ComputedRef } from 'vue'
import { inject, InjectionKey, provide, Slots } from 'vue'
import type { SizeType } from '@gx-admin/utils'
import type { PaginationProps } from '@gx-design/Pagination/typings'
import type { ProColumns } from '../types/column'
import type { ColumnsState, SettingsAction } from '../hooks/useColumnSetting'

export type ContextType = any;


export interface TableContextProps {
  /* 附加属性 */
  columns?: ComputedRef<ProColumns>;
  cacheColumns?: ComputedRef<ProColumns>;
  tableSize?: Ref<SizeType>;
  action?: {
    /** @name 刷新 */
    reload: (info?: any) => void;
    toggle: () => Promise<void>;
    setTableSize: (size: SizeType) => void;
  };
  setPagination: (info: Partial<PaginationProps>) => void;
  settingsAction: SettingsAction;
  slots: Slots;
  changeColumns: (map: Record<string, ColumnsState>, fixed: boolean) => void;
  [key: string]: any;
}

const tableContextInjectKey: InjectionKey<TableContextProps> = Symbol('table-context')

export const useContext = <T>(
  contextInjectKey: string | InjectionKey<ContextType> = Symbol(),
  defaultValue?: ContextType
): T => {
  return inject(contextInjectKey, defaultValue || ({} as T))
}

export const provideTableContext = (value: TableContextProps | ComputedRef<TableContextProps>) => {
  provide(tableContextInjectKey, value)
}

export const useTableContext = () =>
  useContext<Required<TableContextProps>>(tableContextInjectKey, [])
