import type { ProTableRef } from '@gx-design-vue/pro-table'
import type { RecordType } from '@gx-design-vue/pro-utils'
import { isArray } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { globalConfirm } from '@/components/layout/confirm'

export default function<T = RecordType, R = RecordType> (props: {
  remove?: {
    title?: string
    confirm?: boolean
    requestFn?: Fn
  }
  change?: {
    title?: string
    confirm?: boolean
    requestFn?: Fn
  }
}, tableRef: Ref<ProTableRef<T, R>>) {
  const remove = <T = any>(params?: T) => {
    if (!props.remove) return
    const { requestFn, title, confirm = true } = props.remove
    const action = tableRef.value.actionRef()

    async function fetch() {
      const ids = isArray(params) ? params.join() : params || undefined
      if (!ids) return
      action.setLoading(true)
      const response = await requestFn?.(ids)
      if (response) {
        message.success('操作成功！')
        action.rowsSelection?.clear()
        await action.reload({ immediate: true, removeKeys: isArray(params) ? params : [] })
      }
      action.setLoading(false)
    }

    if (confirm) {
      globalConfirm({
        title: '温馨提醒',
        iconProps: {
          style: {
            color: 'var(--gx-color-error)'
          }
        },
        content: title || '确定要删除吗?',
        onOk: () => fetch()
      })
    } else {
      fetch()
    }
  }

  const changeStatus = (key: keyof T, params?: Partial<T>, title?: string) => {
    if (!props.change) return
    const { requestFn, confirm = true } = props.change
    const action = tableRef.value.actionRef()
    const content = title || props.change?.title || `确认要${params?.[key] === '0' ? '启用' : '停用'}吗？`

    async function fetch() {
      action.setLoading(true)
      const response = await requestFn?.(params)
      if (response) {
        message.success('操作成功！')
        await action.reload({ immediate: true })
      }
      action.setLoading(false)
    }

    if (confirm) {
      globalConfirm({
        title: '温馨提醒',
        content,
        onOk: () => fetch()
      })
    } else {
      fetch()
    }
  }

  const change = (params?: Partial<T>, options?: { title?: string; callback?: Fn }) => {
    if (!props.change) return
    const { requestFn, confirm = true } = props.change
    const action = tableRef.value.actionRef()
    const content = props?.change?.title || options?.title

    async function fetch() {
      action.setLoading(true)
      const response = await requestFn?.(params)
      if (response) {
        options?.callback?.()
        message.success('操作成功！')
        await action.reload({ immediate: true })
      }
      action.setLoading(false)
    }

    if (confirm && content) {
      globalConfirm({
        title: '温馨提醒',
        content,
        onOk: () => fetch()
      })
    } else {
      fetch()
    }
  }

  return {
    remove,
    change,
    changeStatus
  }
}
