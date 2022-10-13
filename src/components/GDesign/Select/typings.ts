import type { LabeledValue, SelectValue } from 'ant-design-vue/lib/select'

export type { SelectProps } from 'ant-design-vue'

export type RequestOptionsType = {
  label?: VueNode;
  value?: string | number;
  /** 渲染的节点类型 */
  optionType?: 'optGroup' | 'option';
  options?: Omit<RequestOptionsType, 'children' | 'optionType'>[];
  [key: string]: any;
};

// 支持 key, value, label，兼容 UserSearch 中只填写了 key 的情况。
export type KeyLabel = Partial<LabeledValue> & RequestOptionsType & SelectValue;
