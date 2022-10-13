import { CascaderOptionType, FieldNamesType, ShowSearchType } from 'ant-design-vue/lib/cascader'
import { PropTypes } from '@/utils'
import { tuple } from '@gx-design/utils'

export const cascaderProps = {
  /** 可选项数据源 */
  options: { type: Array as PropType<CascaderOptionType[]>, default: [] },
  /** 默认的选中项 */
  defaultValue: PropTypes.array,
  /** 指定选中项 */
  value: PropTypes.array,
  /** 选择完成后的回调 */
  // onChange?: (value: string[], selectedOptions?: CascaderOptionType[]) => void;
  /** 选择后展示的渲染函数 */
  displayRender: PropTypes.func,
  transitionName: PropTypes.string.def('slide-up'),
  popupStyle: PropTypes.object.def(() => ({})),
  /** 自定义浮层类名 */
  popupClassName: PropTypes.string,
  /** 浮层预设位置：`bottomLeft` `bottomRight` `topLeft` `topRight` */
  popupPlacement: PropTypes.oneOf(tuple('bottomLeft', 'bottomRight', 'topLeft', 'topRight')).def(
    'bottomLeft'
  ),
  /** 输入框占位文本*/
  placeholder: PropTypes.string.def('Please select'),
  /** 输入框大小，可选 `large` `default` `small` */
  size: PropTypes.oneOf(tuple('large', 'default', 'small')),
  /** 禁用*/
  disabled: PropTypes.looseBool.def(false),
  /** 是否支持清除*/
  allowClear: PropTypes.looseBool.def(true),
  showSearch: {
    type: [ Boolean, Object ] as PropType<boolean | ShowSearchType | undefined>,
    default: undefined as PropType<boolean | ShowSearchType | undefined>
  },
  notFoundContent: PropTypes.VueNode,
  loadData: PropTypes.func,
  /** 次级菜单的展开方式，可选 'click' 和 'hover' */
  expandTrigger: PropTypes.oneOf(tuple('click', 'hover')),
  /** 当此项为 true 时，点选每级菜单选项值都会发生变化 */
  changeOnSelect: PropTypes.looseBool,
  /** 浮层可见变化时回调 */
  // onPopupVisibleChange?: (popupVisible: boolean) => void;
  prefixCls: PropTypes.string,
  inputPrefixCls: PropTypes.string,
  getPopupContainer: PropTypes.func,
  popupVisible: PropTypes.looseBool,
  fieldNames: { type: Object as PropType<FieldNamesType> },
  autofocus: PropTypes.looseBool,
  suffixIcon: PropTypes.VueNode,
  showSearchRender: PropTypes.any,
  onChange: PropTypes.func,
  onPopupVisibleChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  onSearch: PropTypes.func,
  'onUpdate:value': PropTypes.func
}
