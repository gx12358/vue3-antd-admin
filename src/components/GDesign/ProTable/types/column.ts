import type { VNodeChild } from 'vue'
import type {
  ColumnFilterItem,
  ColumnTitle,
  CompareFn,
  FilterDropdownProps,
  FilterValue,
  Key,
  SortOrder,
  AlignType,
  CellEllipsisType,
  DataIndex,
  FixedType,
  GetComponentProps,
  RenderedCell
} from '@gx-design/Table/typings'
import type { TooltipProps } from 'ant-design-vue/lib/tooltip/Tooltip'

/**
 * @param text 文本框
 * @param date 日期 YYYY-MM-DD
 * @param dateMonth 月选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param time: 时间 HH:mm:ss
 * @param select 下拉选择器
 */
export type ProFieldValueType =
  | 'text'
  | 'date'
  | 'select'
  | 'treeSelect'
  | 'dateMonth'
  | 'dateRange'
  | 'time'

/**
 * @param text 文本框
 * @param date 日期 YYYY-MM-DD
 * @param dateMonth 月选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param time: 时间 HH:mm:ss
 * @param select 下拉选择器
 */
export type ProFieldValueFormat =
  | 'data'
  | 'dateMonth'
  | 'dateRange'
  | 'dateMonth'
  | 'time'

export type ProSchemaValueEnumType = {
  /** @name 演示的文案 */
  text: VNodeChild | JSX.Element;

  /** @name 演示的value值 */
  value: any;

  /** @name 是否禁用 */
  disabled?: boolean;
};

type ProSchemaValueType<ValueType> = (ValueType | ProFieldValueType);

type ProSchemaValueFormat<ValueType> = (ValueType | ProFieldValueFormat);

export type ProSearchMap<
  ValueType = 'text',
  ValueFormat = 'date',
  > = {
  name?: string;
  /** 选择如何渲染相应的模式 */
  valueType?: ProSchemaValueType<ValueType>;
  ValueFormat?: ProSchemaValueFormat<ValueFormat>;
  placeholder?: string | string[];
  /** valueType为select生效 */
  allowClear?: boolean;
  /** valueType为select生效 */
  showSearch?: boolean;
  /** valueType为date|dateMonth|dateRange|time生效 */
  format?: string;
  /** valueType为date生效 */
  showToday?: boolean;
  /** valueType为dateRange生效 */
  rangeStartName?: string;
  /** valueType为dateRange生效 */
  rangeEndName?: string;
  /** valueType为time生效 */
  use12Hours?: boolean;
  /** valueType为select生效 */
  loading?: boolean;
  showTime?: RecordType | boolean;
  /** 搜索表单的默认值 */
  initialValue?: any;
  /** 针对select、treeselect取值的key */
  valueKey?: string;
  /** 表单的属性值（ant-design）*/
  field?: RecordType;
  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name 映射值的类型
   */
  valueEnum?: ProSchemaValueEnumType[]
};

export type ProColumn = {
  title?: ColumnTitle<any>;
  // Sorter
  sorter?:
    | boolean
    | CompareFn<RecordType>
    | {
    compare?: CompareFn<RecordType>;
    /** Config multiple sorter order priority */
    multiple?: number;
  };
  sortOrder?: SortOrder;
  defaultSortOrder?: SortOrder;
  sortDirections?: SortOrder[];
  showSorterTooltip?: boolean | TooltipProps;

  // Filter
  filtered?: boolean;
  filters?: ColumnFilterItem[];
  filterDropdown?: VueNode | ((props: FilterDropdownProps<RecordType>) => VueNode);
  filterMultiple?: boolean;
  filteredValue?: FilterValue | null;
  defaultFilteredValue?: FilterValue | null;
  filterIcon?: VueNode | ((opt: { filtered: boolean; column: ProColumns }) => VueNode);
  onFilter?: (value: string | number | boolean, record: RecordType) => boolean;
  filterDropdownVisible?: boolean;
  onFilterDropdownVisibleChange?: (visible: boolean) => void;

  // Responsive
  responsive?: Breakpoint[];

  // Children
  children?: ProColumns[];

  colSpan?: number;
  dataIndex?: DataIndex;
  customRender?: (opt: {
    value: any;
    text: any; // 兼容 V2
    record: RecordType;
    index: number;
    column: ProColumns;
  }) => any | RenderedCell<RecordType>;
  rowSpan?: number;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  customCell?: GetComponentProps<RecordType>;
  /** @deprecated Please use `onCell` instead */
  onCellClick?: (record: RecordType, e: MouseEvent) => void;

  key?: Key;
  class?: string;
  className?: string;
  fixed?: FixedType;
  customHeaderCell?: GetComponentProps<ProColumns[]>;
  ellipsis?: CellEllipsisType;
  align?: AlignType;

  customFilterDropdown?: boolean;

  /** @deprecated Please use `v-slot:filterIcon` `v-slot:bodyCell` `v-slot:headerCell` instead */
  slots?: {
    filterIcon?: string;
    filterDropdown?: string;
    customRender?: string;
    title?: string;
  };

  /**
   * @private Internal usage.
   *
   * !!! DO NOT USE IN PRODUCTION ENVIRONMENT !!!
   */
  __originColumn__?: any;

  uuid?: string;
  /** 不在列表中显示 */
  show?: boolean;
  /** 列表顺序值 */
  order?: number;
  /** 不在配置工具中显示 */
  hideInSetting?: boolean;
  /** 表单搜索配置 */
  searchConfig?: ProSearchMap;
  /** 是否拷贝 */
  copyable?: boolean;
  /** 值为空时，默认取值 */
  columnEmptyText?: string;
}

export type ProColumns = ProColumn[]
