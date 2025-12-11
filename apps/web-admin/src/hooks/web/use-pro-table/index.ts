import type {
  BaseTableState,
  ProTableRef,
  RequestConfig,
  RequestFunction,
  UseTableReturn
} from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'
import type { Fn } from '@gx/types'
import type { PageResult } from '@gx/types/request'
import type { MaybeRef, Ref } from 'vue'
import { useTable } from '@gx-design-vue/pro-table'
import { deepMerge } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { table } from '@/common'
import { globalConfirm } from '@/components/layout/confirm'

const { defaultProps } = table

export function useProTable<T extends object = RecordType, R extends object = RecordType>(
  tableRef: Ref<ProTableRef<T> | undefined>,
  options?: {
    request?: RequestFunction<T, R>;
    state?: MaybeRef<BaseTableState<T, R>>;
  }
) {
  return useTable<T, R>(tableRef, {
    state: computed(() => {
      if (options?.state) {
        return deepMerge(defaultProps, options.state && isRef(options.state) ? options.state.value : options.state)
      }
      return defaultProps as BaseTableState<T, R>
    }),
    request: options?.request
  })
}

export function useProPageTable<T extends object = RecordType, R extends object = RecordType>(
  tableRef: Ref<ProTableRef<T> | undefined>,
  options: {
    request: any;
    state?: MaybeRef<BaseTableState<T, R>>;
    onBefore?: (props: RequestConfig<R>) => Promise<R> | R;
    onSuccess?: (result: PageResult<T>, props: RequestConfig<R>) => void;
    changeProps?: {
      title?: string
      confirm?: boolean
      requestFn: any
    },
    deleteProps?: {
      title?: string
      confirm?: boolean
      requestFn: any
    },
  }
): [
  UseTableReturn<T, R>,
  {
    remove: (params: any[], props?: { title?: string; confirm?: boolean }) => void
    change: (
      params?: Partial<T>,
      props?: { title?: string; confirm?: boolean; callback?: Fn }
    ) => void
  }
] {
  return [
    useTable<T, R>(tableRef, {
      state: computed(() => {
        if (options.state) {
          return deepMerge(defaultProps, options.state && isRef(options.state) ? options.state.value : options.state)
        }
        return defaultProps as BaseTableState<T, R>
      }),
      request: async (props) => {
        const newParams = await options.onBefore?.(props)
        const newProps = deepMerge(props, {
          params: newParams || {}
        })
        const { list = [], total = 0 }: PageResult<T> = await options.request(newProps.params)
        options.onSuccess && options.onSuccess({ list, total }, newProps)
        return {
          data: list,
          success: true,
          total
        }
      }
    }),
    {
      remove: (params, props) => {
        const action = tableRef.value?.actionRef()
        if (!options.deleteProps || !action) return
        const { requestFn, confirm = true, title } = options.deleteProps

        const fetch = async () => {
          action.setLoading(true)
          try {
            await requestFn({ ids: params.join() })
            message.success('操作成功')
            action.rowsSelection?.clear()
            await action.reload({ immediate: true, removeKeys: params })
          } catch {}
          action.setLoading(false)
        }

        if (props?.confirm ?? confirm) {
          globalConfirm({
            title: '温馨提醒',
            iconProps: {
              style: {
                color: 'var(--gx-color-error)'
              }
            },
            content: (props?.title || title) || '确定要删除吗？',
            onOk: () => fetch()
          })
        } else {
          fetch()
        }
      },
      change: (params, props) => {
        const action = tableRef.value?.actionRef()
        if (!options.changeProps || !action) return
        const { requestFn, confirm = true, title } = options.changeProps
        const content = props?.title || title

        const fetch = async () => {
          action.setLoading(true)
          try {
            await requestFn(params)
            props?.callback?.()
            message.success('操作成功')
            action.rowsSelection?.clear()
            await action.reload({ immediate: true })
          } catch {}
          action.setLoading(false)
        }

        if ((props?.confirm ?? confirm) && content) {
          globalConfirm({
            title: '温馨提醒',
            content,
            onOk: () => fetch()
          })
        } else {
          fetch()
        }
      }
    }
  ]
}
