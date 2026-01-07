import type { RecordType } from '@gx-design-vue/pro-utils'

export type FieldValues = RecordType

export interface FormItemDependencies<TFieldValues, Key = any> {
  required?: boolean;
  show?: (formValues: TFieldValues) => boolean;
  trigger?: 'blur' | 'change' | ['change', 'blur'];
  transform?: (value: unknown) => any;
  triggerFields?: Key[];
  watchs?: {
    key: Key,
    callback: (value: unknown, formValues: TFieldValues) => void;
  }[];
  zod?: any;
  messages?: string | ((value: unknown) => string);
  pattern?: RegExp;
  rules?: (value: TFieldValues, dependencies: FormItemDependencies<TFieldValues, Key>) => any;
}

export type UseFormProps<
  TFieldValues extends FieldValues = FieldValues,
> = Partial<{
  values: TFieldValues;
  dependencies?: Partial<Record<keyof TFieldValues, FormItemDependencies<TFieldValues, keyof TFieldValues>>>;
}>
