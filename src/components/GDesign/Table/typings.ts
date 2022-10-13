import type { TableProps } from 'ant-design-vue'

export type { ContextSlots } from 'ant-design-vue/lib/table/context'

export type { SpinProps, TooltipProps } from '@gx-design/utils'

export type PageItemRender = WithFalse<(opt: {
  page: number;
  type: 'page' | 'prev' | 'next' | 'jump-prev' | 'jump-next';
  originalElement: any;
}) => CustomRender>

export type {
  Key,
  SortOrder,
  ColumnFilterItem,
  ColumnTitle,
  CompareFn,
  FilterDropdownProps,
  GetRowKey,
  FilterValue,
  ColumnsType,
  ExpandType,
  TablePaginationConfig,
  TableAction,
  TableLocale,
  SorterResult,
  TableCurrentDataSource,
  ColumnType,
  TableRowSelection,
  GetPopupContainer
} from 'ant-design-vue/lib/table/interface'

export type {
  AlignType,
  CellEllipsisType,
  DataIndex,
  FixedType,
  GetComponentProps,
  RenderedCell
} from 'ant-design-vue/lib/vc-table/interface'

export type {
  TableProps
}
