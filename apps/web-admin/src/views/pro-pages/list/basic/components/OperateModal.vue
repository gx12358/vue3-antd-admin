<script setup lang="ts">
import type { Dayjs } from 'dayjs'
import type { MockTableRecord, UpdateMockTableRecord } from '@/services/demo/table'
import { useProForm } from '@gx-design-vue/pro-provider'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { reactive } from 'vue'
import { getInfo, updateList } from '@/services/demo'

type FormState = Partial<UpdateMockTableRecord> & {
  owner?: string;
  createTimeDay?: Dayjs | null;
}

const emit = defineEmits<{
  (e: 'ok'): void
}>()

const open = ref(false)
const spinning = ref(false)
const skeletonLoading = ref(false)

const useWaitFetch = ref(true)

const formState = reactive<FormState>({
  title: '',
  createTime: null,
  createTimeDay: null,
  owner: undefined,
  description: ''
})

const ruleState = reactive<RulesState<FormState>>({
  title: [ { required: true, message: '请输入任务名称' } ],
  createTimeDay: [ { required: true, message: '请输入开始时间' } ],
  owner: [ { required: true, message: '请选择任务负责人' } ]
})

const { validate, validateInfos, resetFields } = useProForm(formState, ruleState)

const handleCancel = () => {
  resetFields()
  spinning.value = false
  useWaitFetch.value = true
  skeletonLoading.value = false
  open.value = false
}

const handleOk = () => {
  validate().then(async (_) => {
    spinning.value = true
    const response = await updateList(omit({
      ...toRaw(formState),
      createTime: dayjs(formState.createTimeDay).format('YYYY-MM-DD HH:mm:ss'),
    }, 'createTimeDay'))

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
    useWaitFetch.value = false
    if (id) {
      try {
        skeletonLoading.value = true
        const result = await getInfo<MockTableRecord>({ id })
        forInObject(formState, (key, value) => {
          switch (key) {
            case 'createTimeDay':
              formState[key] = dayjs(result?.createTime)
              break
            default:
              formState[key] = handleEmptyField(value, '').value
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
    :width="640"
    :open="open"
    :spinning="spinning"
    :skeleton-loading="skeletonLoading"
    :title="formState.id ? '任务编辑' : '任务新增'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :colon="false" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }">
      <a-form-item label="任务名称" v-bind="validateInfos.title">
        <a-input
          v-model:value="formState.title"
          allow-clear
          placeholder="请输入任务名称"
        />
      </a-form-item>
      <a-form-item label="任务名称" v-bind="validateInfos.createTimeDay">
        <a-date-picker v-model:value="formState.createTimeDay as any" style="width: 100%" show-time />
      </a-form-item>
      <a-form-item label="任务负责人" v-bind="validateInfos.owner">
        <a-select
          v-model:value="formState.owner"
          placeholder="请选择任务负责人"
          allow-clear
          :options="['付小小', '周毛毛'].map(item => ({ label: item, value: item }))"
        />
      </a-form-item>
      <a-form-item label="产品描述" v-bind="validateInfos.description" class="!mb-0">
        <a-textarea
          v-model:value="formState.description"
          :auto-size="{ minRows: 5 }"
          placeholder="请输入产品描述"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">
</style>
