export interface BasicOption {
  label: string;
  value: string | number;
  children?: BasicOption[]
}

export type SelectOption<T = undefined> = T extends undefined ? BasicOption : BasicOption & T
