import { useDict } from './useDict'
import useForm, { type RulesState } from './useForm'
import { useOss } from './useOss'
import { usePermissions } from './usePermissions'
import { useUpload } from './useUpload'

export * from './useListUpload'

export type {
  RulesState
}

export {
  useDict,
  useForm,
  useOss,
  usePermissions,
  useUpload
}
