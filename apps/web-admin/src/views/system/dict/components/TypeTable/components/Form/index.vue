<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemDictTypeApi } from '@/services/system/dict'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createDictType, getDictType, updateDictType } from '@/services/system/dict'
import { antOptionsValue } from '@/utils/util'

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '字典类型',
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
} = useForm<SystemDictTypeApi.UpdateDictTypeTableRecord>({
  values: {
    id: undefined,
    name: '',
    type: '',
    status: 0,
    remark: ''
  },
  dependencies: {
    name: {
      zod: z.string().min(1, { message: '请输入字典名称' })
    },
    type: {
      zod: z.string().min(1, { message: '请输入字典类型' })
    },
    status: {
      zod: z.number({ message: '请选择状态' })
    },
  },
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: SystemDictTypeApi.UpdateDictTypeTableRecord) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateDictType(values) : createDictType(values))
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
  open: async (row?: SystemDictTypeApi.DictTypeTableRecord) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    if (row) {
      loading.value = true
      try {
        const result = await getDictType(row.id)
        forInObject(formState, (key) => {
          switch (key) {
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
      <a-form-item v-bind="register('name')" label="字典名称">
        <a-input v-model:value="formState.name" placeholder="请输入字典名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('type')" label="字典类型">
        <a-input v-model:value="formState.type" placeholder="请输入字典类型" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('status')" label="状态" required>
        <a-radio-group
          v-model:value="formState.status"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.common_status.data)"
        />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="formState.remark" :rows="2" placeholder="请输入备注" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
