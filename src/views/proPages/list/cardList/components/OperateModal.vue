<script setup lang="ts">
import type { RulesState } from '@gx-admin/hooks/system'
import type { CardListItemDataType } from '@gx-mock/datasSource/list/card'
import GUpload from '@/components/GDesign/Upload'
import { cardListOperate, getCardListDetails } from '@/services/listCenter'
import { useForm } from '@gx-admin/hooks/system'
import { hanndleField } from '@gx-design-vue/pro-utils'
import { handleRandomImage } from '@gx-mock/util/utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { reactive } from 'vue'

type FormState = Partial<CardListItemDataType>

const emit = defineEmits<{
  (e: 'ok'): void
}>()

const open = ref(false)
const spinning = ref(false)
const skeletonLoading = ref(false)

const userReadyFetch = ref(false)

const formState = reactive<FormState>({
  id: null,
  title: '',
  avatar: '',
  description: ''
})

const ruleState = reactive<RulesState<FormState>>({
  title: [{ required: true, message: '请输入' }],
  avatar: [{ required: true, message: '请上传' }],
  description: [{ required: true, message: '请输入' }]
})

const { validate, validateInfos, resetFields } = useForm(formState, ruleState)

const handleChange = (url: string[]) => {
  formState.avatar = url.join()
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
    const response = await cardListOperate(omit(
      { ...formState, avatar: handleRandomImage(100, 100) },
      [formState?.id ? '' : 'id']
    ))

    if (response) {
      message.success('操作成功')
      emit('ok')
      handleCancel()
    }

    spinning.value = false
  })
}

defineExpose({
  open: async (id?: number) => {
    open.value = true
    userReadyFetch.value = true
    if (id) {
      skeletonLoading.value = true
      const response = await getCardListDetails<CardListItemDataType>({ id })
      if (response) {
        for (const key in formState) {
          switch (key) {
            case 'createTimeDay':
              formState[key] = dayjs(response.data?.createTime)
              break
            default:
              formState[key] = hanndleField(response?.data?.[key], '').value
              break
          }
        }
      }
      skeletonLoading.value = false
    }
  }
})
</script>

<template>
  <g-pro-modal
    full-spin type="normal" :width="640" :open="open" :spinning="spinning"
    :skeleton-loading="skeletonLoading" :title="formState.id ? '任务编辑' : '任务新增'" @ok="handleOk" @cancel="handleCancel"
  >
    <a-form :colon="false" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }">
      <a-form-item label="名称" v-bind="validateInfos.title">
        <a-input v-model:value="formState.title" allow-clear placeholder="请输入" />
      </a-form-item>
      <a-form-item v-bind="validateInfos.avatar">
        <template #label>
          Logo
          <a-tooltip title="这里上传是模拟">
            <info-circle-outlined class="ml-4px relative top-[0.5px] text-rgba-[0-0-0-0.45]" />
          </a-tooltip>
        </template>
        <GUpload
          :progress="false" :data-list="[{ url: formState.avatar, previewUrl: formState.avatar, type: '1' }]"
          :limit="1" :disabled="false" :trigger-style="{ overflow: 'hidden', borderRadius: '4px' }"
          :card-item-style="{ overflow: 'hidden', borderRadius: '4px' }" @change="handleChange"
        />
      </a-form-item>
      <a-form-item class="!mb-0" label="描述" v-bind="validateInfos.description">
        <a-textarea v-model:value="formState.description" :auto-size="{ minRows: 5 }" placeholder="请输入" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">
.spinner-icon {
  &:deep(.iconfont) {
    --at-apply: text-20px;
  }
}
</style>
