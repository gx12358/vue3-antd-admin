<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SelectOption } from '@gx/types'
import type { SystemDictTypeApi } from '@/services/system/dict'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createDictData, getDictData, getSimpleDictTypeList, updateDictData } from '@/services/system/dict'
import { antOptionsValue } from '@/utils/util'
import { colorOptions } from '../../utils/config'

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { data: dictTypeList, run } = useRequest<SelectOption[], any, SystemDictTypeApi.DictTypeTableRecord[]>(getSimpleDictTypeList, {
  manual: true,
  defaultData: [],
  onSuccess: data => data.map(item => ({ value: item.type, label: item.name }))
})

const { state, resetState } = useModalState({
  title: '岗位',
  type: 'add' as 'add' | 'edit',
})

const modalState = reactive<ProModalProps>({
  width: 600,
  open: false
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit
} = useForm<DictRecord>({
  values: {
    id: undefined,
    dictType: undefined,
    label: '',
    value: '',
    sort: undefined,
    colorType: undefined,
    status: 0,
    cssClass: '',
    remark: '',
  },
  dependencies: {
    label: {
      zod: z.string().min(1, { message: '请输入数据标签' })
    },
    value: {
      zod: z.string().min(1, { message: '请输入岗位编码' })
    },
    dictType: {
      zod: z.string().min(1, { message: '请选择字典类型' })
    },
    sort: {
      zod: z.number({ message: '请输入显示顺序' }).optional(),
    },
    status: {
      zod: z.number({ message: '请选择岗位状态' })
    },
  },
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: DictRecord) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateDictData(values) : createDictData(values))
    emits('ok')
    onClose()
    message.success('操作成功')
  } finally {
    loading.value = false
  }
}

function onClose() {
  resetFields()
  resetState()
  modalState.open = false
}

defineExpose({
  open: async (row?: Partial<DictRecord>) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    await run()
    formState.dictType = row?.dictType ?? undefined
    console.log(formState.dictType, dictTypeList.value)
    if (row?.id) {
      loading.value = true
      try {
        const result = await getDictData(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'dictType':
              formState[key] = result[key] ?? undefined
              break
            case 'colorType':
              formState[key] = result[key] ?? undefined
              break
            case 'sort':
              formState[key] = result[key] ?? undefined
              break
            case 'status':
              formState[key] = result[key] ?? 0
              break
            default:
              formState[key] = handleEmptyField(result[key], '').value
              break
          }
        })
      } catch {}
      loading.value = false
    }
  }
})
</script>

<template>
  <g-pro-modal
    v-bind="modalState"
    :spinning="loading"
    :title="title"
    @ok="handleSubmit(onOk)"
    @cancel="onClose"
  >
    <a-form class="gx-pro-form" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item v-bind="register('dictType')" label="字典类型">
        <a-select
          v-model:value="formState.dictType"
          placeholder="请选择字典类型"
          allow-clear
          :options="dictTypeList"
        />
      </a-form-item>
      <a-form-item v-bind="register('label')" label="数据标签">
        <a-input v-model:value="formState.label" placeholder="请输入数据标签" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('value')" label="数据键值">
        <a-input v-model:value="formState.value" placeholder="请输入数据键值" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('sort')" label="显示顺序">
        <a-input-number
          v-model:value="formState.sort"
          style="width: 100%"
          placeholder="请输入显示顺序"
          :min="0"
        />
      </a-form-item>
      <a-form-item v-bind="register('status')" label="岗位状态" required>
        <a-radio-group
          v-model:value="formState.status"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.common_status.data)"
        />
      </a-form-item>
      <a-form-item label="颜色类型">
        <a-select
          v-model:value="formState.colorType"
          placeholder="请选择颜色类型"
          allow-clear
          :options="colorOptions"
        />
      </a-form-item>
      <a-form-item>
        <template #label>
          <span class="mr-4px">CSS Class</span>
          <a-tooltip
            title="输入 hex 模式的颜色, 例如 #108ee9s"
            placement="top"
          >
            <question-circle-outlined />
          </a-tooltip>
        </template>
        <a-input v-model:value="formState.cssClass" placeholder="请输入CSS Class" allow-clear />
      </a-form-item>
      <a-form-item label="岗位备注">
        <a-textarea v-model:value="formState.remark" :rows="2" placeholder="请输入岗位备注" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
