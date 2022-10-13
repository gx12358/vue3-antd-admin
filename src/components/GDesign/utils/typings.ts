import type { CSSProperties, ExtractPropTypes } from 'vue'
import { VueElement } from 'vue'
import type { Dayjs } from 'dayjs'
import type { NamePath } from 'ant-design-vue/lib/form/interface'
import type { Breakpoint } from 'ant-design-vue/lib/_util/responsiveObserve'
import type { FormInstance } from '@gx-design/ProForm/typings'

export const tuple = <T extends string[]>(...args: T) => args

export type {
  Breakpoint
}

type triggerTypes = 'hover' | 'focus' | 'click' | 'contextmenu'

type placementTypes =
  'top'
  | 'left'
  | 'right'
  | 'bottom'
  | 'topLeft'
  | 'topRight'
  | 'bottomLeft'
  | 'bottomRight'
  | 'leftTop'
  | 'leftBottom'
  | 'rightTop'
  | 'rightBottom'

export type abstractTooltipProps = {
  trigger?: triggerTypes | triggerTypes[];
  visible?: boolean;
  defaultVisible?: boolean;
  placement?: placementTypes;
  color?: string;
  transitionName?: string;
  overlayStyle?: CSSProperties;
  overlayClassName?: string;
  openClassName?: string;
  prefixCls?: string;
  mouseEnterDelay?: number;
  mouseLeaveDelay?: number;
  getPopupContainer?: () => void;
  arrowPointAtCenter?: boolean;
  autoAdjustOverflow?: boolean | object;
  destroyTooltipOnHide?: boolean;
  align?: object;
  builtinPlacements?: object;
  children?: any[];
  onVisibleChange?: () => void;
};

export type TooltipProps = {
  title?: any;
} & abstractTooltipProps;

export type SpinProps = {
  prefixCls?: string;
  spinning?: boolean;
  size?: 'small' | 'default' | 'large';
  wrapperClassName?: string;
  tip?: string;
  delay?: number;
  indicator?: any;
};

export type WrapperTooltipProps = TooltipProps & {
  icon?: VueElement;
};

export type ProSchemaValueEnumType = {
  /** @name 演示的文案 */
  text: VueNode;

  /** @name 预定的颜色 */
  status: string;
  /** @name 自定义的颜色 */
  color?: string;
  /** @name 是否禁用 */
  disabled?: boolean;
};

export type LabelTooltipType = WrapperTooltipProps | VueNode;

export type ProSchemaValueEnumObj = Record<string, ProSchemaValueEnumType | VueNode>;

export type ProFieldTextType = VueNode | VueNode[] | Dayjs | Dayjs[];

export type SearchTransformKeyFn = (
  value: any,
  field: string,
  object: any
) => string | RecordType;

export type ProSchemaValueEnumMap = Map<string | number, ProSchemaValueEnumType | VueNode>;

export type ProTableEditableFnType<T> = (_: any, record: T, index: number) => boolean;

/**
 * @param textarea 文本框
 * @param password 密码框
 * @param money 金额 option 操作 需要返回一个数组
 * @param date 日期 YYYY-MM-DD
 * @param dateWeek 周选择器
 * @param dateMonth 月选择器
 * @param dateQuarter 季度选择器
 * @param dateYear 年选择器
 * @param dateRange 日期范围 YYYY-MM-DD[]
 * @param dateTime 日期和时间 YYYY-MM-DD HH:mm:ss
 * @param dateTimeRange 范围日期和时间 YYYY-MM-DD HH:mm:ss[]
 * @param time: 时间 HH:mm:ss
 * @param timeRange: 时间区间 HH:mm:ss[]
 * @param index：序列
 * @param indexBorder：序列
 * @param progress: 进度条
 * @param percent: 百分比
 * @param digit 数值
 * @param second 秒速
 * @param fromNow 相对于当前时间
 * @param avatar 头像
 * @param code 代码块
 * @param image 图片设置
 * @param jsonCode Json 的代码块，格式化了一下
 * @param color 颜色选择器
 */
export type ProFieldValueType =
  | 'text'
  | 'password'
  | 'money'
  | 'textarea'
  | 'option'
  | 'date'
  | 'dateWeek'
  | 'dateMonth'
  | 'dateQuarter'
  | 'dateYear'
  | 'dateRange'
  | 'dateTimeRange'
  | 'dateTime'
  | 'time'
  | 'timeRange'
  | 'select'
  | 'checkbox'
  | 'rate'
  | 'radio'
  | 'radioButton'
  | 'index'
  | 'indexBorder'
  | 'progress'
  | 'percent'
  | 'digit'
  | 'second'
  | 'avatar'
  | 'code'
  | 'switch'
  | 'fromNow'
  | 'image'
  | 'jsonCode'
  | 'cascader'
  | 'color';

/** 操作类型 */
export type ProCoreActionType<T = {}> = () => {
  /** @name 刷新 */
  reload: (resetPageIndex?: boolean) => Promise<void>;
  /** @name 刷新并清空，只清空页面，不包括表单 */
  reloadAndRest?: () => Promise<void>;
  /** @name 重置任何输入项，包括表单 */
  reset?: () => void;
} & T;

export type RequestOptionsType = {
  label?: VueNode;
  value?: string | number;
  /** 渲染的节点类型 */
  optionType?: 'optGroup' | 'option';
  options?: Omit<RequestOptionsType, 'children' | 'optionType'>[];
  [key: string]: any;
};

export type ProFieldRequestData<U = any> = (params: U) => Promise<RequestOptionsType[]>;

export type ProFieldValueEnumType = ProSchemaValueEnumMap | ProSchemaValueEnumObj;

// function return type
export type ProFieldValueObjectType = {
  type: 'progress' | 'money' | 'percent' | 'image';
  status?: 'normal' | 'active' | 'success' | 'exception' | undefined;
  locale?: string;
  /** Percent */
  showSymbol?: ((value: any) => boolean) | boolean;
  showColor?: boolean;
  precision?: number;
  moneySymbol?: boolean;
  request?: ProFieldRequestData;
  /** Image */
  width?: number;
};

export type ProSchemaValueType<ValueType> =
  | (ValueType | ProFieldValueType)
  | ProFieldValueObjectType;

// 支持的变形，还未完全支持完毕
/** 支持的变形，还未完全支持完毕 */
export type ProSchemaComponentTypes =
  | 'form'
  | 'list'
  | 'descriptions'
  | 'table'
  | 'cardList'
  | undefined;

/** 各个组件公共支持的 render */
export type ProSchema<Entity = RecordType,
  ExtraProps = unknown,
  ComponentsType = ProSchemaComponentTypes,
  ValueType = 'text',
  > = {
  /** @name 确定这个列的唯一值,一般用于 dataIndex 重复的情况 */
  key?: string | any;
  /**
   * 支持一个数字，[a,b] 会转化为 obj.a.b
   *
   * @name 与实体映射的key
   */
  dataIndex?: string | number | (string | number)[];

  /** 选择如何渲染相应的模式 */
  valueType?:
    | ((entity: Entity, type: ComponentsType) => ProSchemaValueType<ValueType>)
    | ProSchemaValueType<ValueType>;

  /**
   * 支持 ReactNode 和 方法
   *
   * @name 标题
   */
  title?:
    | ((
    schema: Omit<ProSchema<Entity, ExtraProps>, 'render' | 'renderFormItem'>,
    type: ComponentsType,
    dom: VueNode
  ) => VueNode)
    | VueNode;

  /** @name 展示一个 icon，hover 是展示一些提示信息 */
  tooltip?: LabelTooltipType | string;

  /** @deprecated 你可以使用 tooltip，这个更改是为了与 antd 统一 */
  tip?: string;

  /**
   * 支持 object 和Map，Map 是支持其他基础类型作为 key
   *
   * @name 映射值的类型
   */
  valueEnum?:
    | ((row: Entity) => ProSchemaValueEnumObj | ProSchemaValueEnumMap)
    | ProSchemaValueEnumObj
    | ProSchemaValueEnumMap;

  /**
   * 修改的数据是会被 valueType 消费
   *
   * @name 自定义 render 内容
   */
  renderText?: (text: any, record: Entity, index: number, action: ProCoreActionType) => any;
  /**
   * Render 方法只管理的只读模式，编辑模式需要使用 renderFormItem
   *
   * @name 自定义只读模式的dom
   */
  render?: (
    dom: VueNode,
    entity: Entity,
    index: number,
    action: ProCoreActionType | undefined,
    schema: ProSchema<Entity, ExtraProps, ComponentsType, ValueType> & {
      isEditable?: boolean;
      type: ComponentsType;
    }
  ) => VueNode;

  /**
   * 返回一个 ReactNode，会自动包裹 value 和 onChange
   *
   * @name 自定义编辑模式
   */
  renderFormItem?: (
    schema: ProSchema<Entity, ExtraProps, ComponentsType, ValueType> & {
      isEditable?: boolean;
      index?: number;
      type: ComponentsType;
      originProps?: any;
    },
    config: {
      onSelect?: (value: any) => void;
      onChange?: <T = any>(value: T) => void;
      value?: any;
      type: ComponentsType;
      recordKey?: string | number | (string | number)[];
      record?: Entity;
      isEditable?: boolean;
      defaultRender: (
        newItem: ProSchema<Entity, ExtraProps, ComponentsType, ValueType>
      ) => JSX.Element | null;
    },
    form: FormInstance
  ) => VueNode;

  /** 可编辑表格是否可编辑 */
  editable?: false | ProTableEditableFnType<Entity>;

  /** @name 从服务器请求枚举 */
  request?: ProFieldRequestData;
  /** @name 从服务器请求的参数，改变了会触发 reload */
  params?: RecordType;
  /** @name 依赖字段的name，暂时只在拥有 request 的项目中生效，会自动注入到 params 中 */
  dependencies?: NamePath[];

  /** @name 在 descriptions 隐藏 */
  hideInDescriptions?: boolean;
  /** @name 在 Form 中隐藏 */
  hideInForm?: boolean;
  /** @name 在 table 中隐藏 */
  hideInTable?: boolean;
  /** @name 在 table的查询表单 中隐藏 */
  hideInSearch?: boolean;
  /** 设置到 ProField 上面的 Props，内部属性 */
  proFieldProps?: ProFieldProps;
} & ExtraProps;

export interface ProFieldProps {
  light?: boolean;
  emptyText?: VueNode;
  label?: VueNode;
  mode?: 'read' | 'edit';
  /** 这个属性可以设置useSwr的key */
  proFieldKey?: string;
  render?: any;
}

export type OnUpdateValue = (value: string & null) => void

export type OnUpdateValueImpl = (value: string | null) => void

export type ExtractPublicPropTypes<T> = Omit<
  Partial<ExtractPropTypes<T>>,
  | Extract<keyof T, `internal${string}`>
  >

export type ExtractInternalPropTypes<T> = Partial<ExtractPropTypes<T>>
