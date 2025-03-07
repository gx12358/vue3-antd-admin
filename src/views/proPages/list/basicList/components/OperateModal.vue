<script setup lang="ts">
import type { UserList } from '@gx-mock/config/user'
import type { BasicListItemDataType } from '@gx-mock/routers/list/basic.fake'
import type { Dayjs } from 'dayjs'
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import { basicListOperate, getBasicListDetails } from '@/services/listCenter'
import { getUserList } from '@/services/userCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { useProForm } from '@gx-design-vue/pro-provider'
import { handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { reactive } from 'vue'

type FormState = Partial<BasicListItemDataType> & {
  ownerId?: number;
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
  owner: '',
  ownerId: undefined,
  subDescription: ''
})

const ruleState = reactive<RulesState<FormState>>({
  title: [ { required: true, message: '请输入任务名称' } ],
  createTimeDay: [ { required: true, message: '请输入开始时间' } ],
  ownerId: [ { required: true, message: '请选择任务负责人' } ]
})

const { validate, validateInfos, resetFields } = useProForm(formState, ruleState)

const { loading, data: userList } = useRequest<UserList[]>(getUserList, {
  manual: useWaitFetch
})

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
    const response = await basicListOperate(omit({
      ...formState,
      createTime: dayjs(formState.createTimeDay).format('YYYY-MM-DD HH:mm:ss'),
      owner: userList.value.find(item => item.id === formState.ownerId)?.name
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
      skeletonLoading.value = true
      const response = await getBasicListDetails<BasicListItemDataType>({ id })
      if (response) {
        for (const key in formState) {
          switch (key) {
            case 'createTimeDay':
              formState[key] = dayjs(response.data?.createTime)
              break
            default:
              formState[key] = handleEmptyField(response?.data?.[key], '').value
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
      <a-form-item label="任务负责人" v-bind="validateInfos.ownerId">
        <a-select
          v-model:value="formState.ownerId"
          placeholder="请选择任务负责人"
          allow-clear
        >
          <template #notFoundContent>
            <g-spin v-if="loading" class="spinner-icon" />
            <Empty v-else :width="80" />
          </template>
          <a-select-option v-for="item in userList" :key="item" :value="item.id">
            {{ item.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="产品描述" v-bind="validateInfos.subDescription" class="!mb-0">
        <a-textarea
          v-model:value="formState.subDescription"
          :auto-size="{ minRows: 5 }"
          placeholder="请输入产品描述"
          allow-clear
        />
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
