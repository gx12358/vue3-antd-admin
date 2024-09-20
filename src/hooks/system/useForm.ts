import type { RuleError } from 'ant-design-vue/es/form/interface'
import type { Props, ValidateInfo, validateOptions } from 'ant-design-vue/es/form/useForm'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm

export type RulesState<D> = Partial<Record<keyof D, {
  required?: boolean;
  message?: string;
  pattern?: any;
  type?: 'email';
  validator?: (_: any, value: D[keyof D]) => Promise<any>;
}[]>>

export default function <D = undefined>(formState: D, ruleState?: Partial<RulesState<D>>) {
  const {
    validate,
    validateInfos,
    resetFields,
    validateField,
    clearValidate,
    mergeValidateInfo
  } = useForm(formState, ruleState)

  return {
    validate,
    validateInfos,
    resetFields,
    validateField,
    clearValidate,
    mergeValidateInfo
  } as {
    resetFields: (newValues?: Props) => void;
    validate: <T = any>(names?: string | string[], option?: validateOptions) => Promise<T>;
    validateField: (
      name?: string,
      value?: any,
      rules?: [ Record<string, unknown> ],
      option?: validateOptions
    ) => Promise<RuleError[]>;
    validateInfos: Partial<Record<D extends undefined ? typeof formState : keyof D, ValidateInfo>>;
    clearValidate: (names?: string | string[]) => void;
    mergeValidateInfo: (items: ValidateInfo | ValidateInfo[]) => ValidateInfo;
  }
}
