<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemPostApi } from '@/services/system/post'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createPost, getPost, updatePost } from '@/services/system/post'
import { antOptionsValue } from '@/utils/util'

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

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
} = useForm<SystemPostApi.UpdatePostTableRecord>({
  values: {
    id: undefined,
    name: '',
    code: '',
    sort: undefined,
    status: 0,
    remark: ''
  },
  dependencies: {
    name: {
      zod: z.string().min(1, { message: '请输入岗位名称' })
    },
    code: {
      zod: z.string().min(1, { message: '请输入岗位编码' })
    },
    sort: {
      zod: z.number({ message: '请输入显示排序' })
    },
    status: {
      zod: z.number({ message: '请选择岗位状态' })
    },
  },
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: SystemPostApi.UpdatePostTableRecord) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updatePost(values) : createPost(values))
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
  open: async (row?: SystemPostApi.PostTableRecord) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    if (row) {
      loading.value = true
      try {
        const result = await getPost(row.id)
        forInObject(formState, (key) => {
          switch (key) {
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
      <a-form-item v-bind="register('name')" label="岗位名称">
        <a-input v-model:value="formState.name" placeholder="请输入岗位名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('code')" label="岗位编码">
        <a-input v-model:value="formState.code" placeholder="请输入岗位编码" allow-clear />
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
      <a-form-item label="岗位备注">
        <a-textarea v-model:value="formState.remark" :rows="2" placeholder="请输入岗位备注" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
