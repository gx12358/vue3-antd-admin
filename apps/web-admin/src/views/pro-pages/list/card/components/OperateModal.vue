<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { MockTableRecord, UpdateMockTableRecord } from '@/services/demo/table'
import { handleRandomImage } from '@gx-core/shared/utils'
import { useProForm } from '@gx-design-vue/pro-provider'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { reactive } from 'vue'
import { createList, getInfo, updateList } from '@/services/demo'

type FormState = UpdateMockTableRecord<{
  createTimeDay: Dayjs | null
}>

const emit = defineEmits<{
  (e: 'ok'): void
}>()

const open = ref(false)
const spinning = ref(false)
const skeletonLoading = ref(false)

const userReadyFetch = ref(false)

const formState = reactive<FormState>({
  id: undefined,
  title: '',
  logo: '',
  description: '',
  createTimeDay: null
})

const { validate, validateInfos, resetFields } = useProForm(formState, {
  title: [ { required: true, message: '请输入' } ],
  logo: [ { required: true, message: '请上传' } ],
  description: [ { required: true, message: '请输入' } ]
})

const handleChange = (url: string[]) => {
  formState.logo = url.join()
}

const handleCancel = () => {
  resetFields()
  spinning.value = false
  userReadyFetch.value = false
  skeletonLoading.value = false
  open.value = false
}

const handleOk = () => {
  validate().then(async (_) => {
    spinning.value = true
    const requestFn = formState.id ? updateList : createList
    try {
      await requestFn({ ...toRaw(formState), avatar: handleRandomImage(100, 100) })
      message.success('操作成功')
      emit('ok')
      handleCancel()
    } catch {}

    spinning.value = false
  })
}

defineExpose({
  open: async (id?: number) => {
    open.value = true
    userReadyFetch.value = true
    if (id) {
      skeletonLoading.value = true
      try {
        const result = await getInfo<MockTableRecord>({ id })
        forInObject(formState, (key) => {
          switch (key) {
            case 'createTimeDay':
              formState[key] = result?.createTime ? dayjs(result?.createTime) : null
              break
            default:
              formState[key] = handleEmptyField(result[key], '').value
              break
          }
        })
      } catch {}
      skeletonLoading.value = false
    }
  }
})
</script>

<template>
  <g-pro-modal
    full-spin
    type="normal"
    :width="520"
    :open="open"
    :spinning="spinning"
    :skeleton-loading="skeletonLoading"
    :title="formState.id ? '任务编辑' : '任务新增'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :colon="false" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }">
      <a-form-item label="名称" v-bind="validateInfos.title">
        <a-input v-model:value="formState.title" allow-clear placeholder="请输入" />
      </a-form-item>
      <a-form-item v-bind="validateInfos.logo">
        <template #label>
          Logo
          <a-tooltip title="这里上传是模拟">
            <info-circle-outlined class="ml-4px relative top-[0.5px] text-rgba-[0-0-0-0.45]" />
          </a-tooltip>
        </template>
        <g-admin-upload
          :progress="false"
          :list="[formState.logo]"
          :max-count="1"
          :disabled="false"
          :trigger-style="{ overflow: 'hidden', borderRadius: '4px' }"
          :card-item-style="{ overflow: 'hidden', borderRadius: '4px' }"
          @change="handleChange"
        />
      </a-form-item>
      <a-form-item class="!mb-0" label="描述" v-bind="validateInfos.description">
        <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 5 }" placeholder="请输入" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">
</style>
