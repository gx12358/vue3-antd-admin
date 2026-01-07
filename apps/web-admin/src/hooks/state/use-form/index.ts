import type { RuleItem } from '@gx-design-vue/pro-provider'
import type { Fn } from '@gx/types'
import type { FieldValues, FormItemDependencies, UseFormProps } from './types'
import { useProForm } from '@gx-design-vue/pro-provider'
import { cloneDeep, forInObject, isString } from '@gx-design-vue/pro-utils'
import { reactive, ref, toRaw, watch } from 'vue'
import { z } from 'zod'

function isZodSchema(val: unknown): val is z.ZodTypeAny {
  return val instanceof z.ZodType
}

export default function <TFieldValues extends FieldValues = FieldValues>(
  props: UseFormProps<TFieldValues> = {}
) {
  const loading = ref(false)

  const formState = reactive<TFieldValues>(cloneDeep(props.values || {}) as TFieldValues)
  const errors = reactive<Partial<Record<keyof TFieldValues, string | undefined>>>(errorsValue())

  function errorsValue() {
    const value: Partial<Record<keyof TFieldValues, any>> = {}
    forInObject<Record<keyof TFieldValues, any>>(
      props.values || {} as any,
      (key: keyof TFieldValues) => {
        value[key] = undefined
      }
    )

    return value
  }

  function rulesValue() {
    const value: any = {}
    if (props.dependencies) {
      forInObject(props.dependencies, (key) => {
        const dependencies = props.dependencies?.[key] as FormItemDependencies<TFieldValues, keyof TFieldValues>
        value[key] = [
          {
            required: dependencies?.required ?? true,
            trigger: dependencies?.trigger,
            validator: (_, value: unknown) => {
              const show = dependencies?.show
              let schema = dependencies?.zod
              const rules = dependencies?.rules
              const pattern = dependencies?.pattern
              const defaultMessages = `'${key as any} is required'`
              const messages = typeof dependencies?.messages === 'function'
                ? dependencies?.messages(value)
                : dependencies?.messages

              if (show && !show(toRaw(formState) as TFieldValues)) return Promise.resolve()

              if (rules) {
                const result = rules(toRaw(formState) as TFieldValues, dependencies)
                if (result === true) {
                  return Promise.resolve()
                }
                if (result === false || isString(result)) {
                  return Promise.reject(result ?? messages ?? defaultMessages)
                }
                if (isZodSchema(result)) {
                  schema = result
                }
              }

              if (schema) {
                const result = schema.safeParse(value)

                if (result.success) {
                  return Promise.resolve()
                }

                // 取第一条错误信息
                const message = messages ?? result.error.issues[0]?.message ?? defaultMessages
                return Promise.reject(message)
              }

              if (pattern && isString(value)) {
                if (pattern.test(value)) {
                  return Promise.resolve()
                } else {
                  return Promise.reject(messages ?? defaultMessages)
                }
              }
              return Promise.resolve()
            }
          }
        ] as RuleItem<TFieldValues>[]
      })
    }
    return value
  }

  const { validate, validateInfos, resetFields, clearValidate, validateField } = useProForm(formState, rulesValue())

  function watchsValue() {
    const trigger: { field: Fn[]; callback: Fn; }[] = []
    if (props.dependencies) {
      forInObject(props.dependencies, (key) => {
        const dependencies = props.dependencies?.[key] as FormItemDependencies<TFieldValues, keyof TFieldValues>
        if (dependencies?.triggerFields) {
          trigger.push({
            field: dependencies.triggerFields.map((key) => {
              return () => formState[key as any]
            }),
            callback: () => validate([ key as any ]).then(() => {}).catch(() => {})
          })
        }
      })
    }

    return { trigger }
  }

  const { trigger } = watchsValue()

  if (trigger.length) {
    trigger.forEach((item) => {
      watch(item.field, () => item.callback())
    })
  }

  const onChange = (e: any, name: keyof TFieldValues) => {
    let value: any = e
    const target = e.target
    if (target) {
      value = target.type === 'checkbox' ? target.checked : target.value
    }
    // @ts-ignore
    formState[name] = value
  }

  const register = (name: keyof TFieldValues, native?: boolean) => {
    const nativeProps = native ? {
      onInput: (e: any) => onChange(e, name),
      onChange: (e: any) => onChange(e, name)
    } : {}
    return {
      // @ts-ignore
      ...validateInfos[name],
      ...nativeProps
    }
  }

  const handleSubmit = async (callback?: (data: TFieldValues) => void) => {
    try {
      await validate()
      await callback?.(cloneDeep(toRaw(formState)) as TFieldValues)
    } catch {}
    loading.value = false
  }

  return {
    loading,
    formState,
    errors,
    validate,
    validateField,
    clearValidate,
    resetFields,
    handleSubmit,
    register
  }
}
