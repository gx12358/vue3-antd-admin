<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { MaterialListItem, UploadExpose } from '@gx/design'
import { DeleteOutlined, LinkOutlined } from '@ant-design/icons-vue'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { GUpload } from '@gx/design'
import { message } from 'ant-design-vue'
import { h, reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { importUser, importUserTemplate } from '@/services/system/user'

interface FormState {
  file?: File;
  updateSupport?: boolean;
}

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { state, resetState } = useModalState({
  upload: null as UploadExpose | null,
  files: [] as MaterialListItem[]
})

const modalState = reactive<ProModalProps>({
  width: 450,
  open: false
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit
} = useForm<FormState>({
  values: {
    file: undefined,
    updateSupport: false
  },
  dependencies: {
    file: {
      zod: z.file({ message: '请上传用户数据' })
    },
  },
})

async function onOk(values: FormState) {
  // 提交表单
  try {
    loading.value = true
    await importUser(values)
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

function onChangeFile(_, rows: MaterialListItem[]) {
  const row = rows[0]
  formState.file = row?.file
  state.files = rows || []
}

/** 下载模版 */
async function handleDownload() {
  try {
    const data = await importUserTemplate()
    downloadFileFromBlobPart({ fileName: '用户导入模板.xls', source: data })
  } catch {}
}

defineExpose({
  open: () => modalState.open = true
})
</script>

<template>
  <g-pro-modal
    v-bind="modalState"
    :spinning="loading"
    @ok="handleSubmit(onOk)"
    @cancel="onClose"
  >
    <template #title>
      <span class="mr-12px">导入用户</span>
      <a-button @click="handleDownload">
        下载导入模板
      </a-button>
    </template>
    <a-form class="gx-pro-form" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
      <a-form-item v-bind="register('file')">
        <template #label>
          <span class="mr-4px">用户数据</span>
          <a-tooltip title="仅允许导入 xls、xlsx 格式文件">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <div class="flex flex-col gap-12px">
          <GUpload ref="upload" :list="state.files" accept=".xls,.xlsx" :max-count="1" list-type="default" :request="false" @change="onChangeFile">
            <a-button type="primary">
              选择 Excel 文件
            </a-button>
          </GUpload>
          <div v-for="item in state.files" :key="item.id" class="flex justify-between">
            <div class="flex items-center">
              <LinkOutlined />
              <span class="ml-8px">{{ item.name }}</span>
            </div>
            <a-button class="flex items-center" type="link" danger :icon="h(DeleteOutlined)" @click="state.upload?.onDelete(item)">
              删除
            </a-button>
          </div>
        </div>
      </a-form-item>
      <a-form-item>
        <template #label>
          <span class="mr-4px">是否覆盖</span>
          <a-tooltip title="是否更新已经存在的用户数据">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <a-switch v-model:checked="formState.updateSupport" checked-children="是" un-checked-children="否" />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
