<script setup lang="ts">
import { reactive } from 'vue'
import { message } from 'ant-design-vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import type { BasicListItemDataType } from '@gx-mock/datasSource/list/basic'
import type { UserList } from '@gx-mock/config/user'
import { hanndleField } from '@gx-design-vue/pro-utils'
import { basicListOperate, getBasicListDetails } from '@/services/listCenter'
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import { getUserList } from '@/services/userCenter'
import { useRequest } from '@gx-admin/hooks/core'
import type { RulesState } from '@gx-admin/hooks/system'
import { useForm } from '@gx-admin/hooks/system'
import { omit } from 'lodash-es'

type FormState = Partial<BasicListItemDataType> & {
  ownerId?: number;
  createTimeDay?: Dayjs;
}

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
  createTime: null,
  createTimeDay: null,
  owner: '',
  ownerId: null,
  subDescription: ''
})

const ruleState = reactive<RulesState<FormState>>({
  title: [ { required: true, message: '请输入任务名称' } ],
  createTimeDay: [ { required: true, message: '请输入开始时间' } ],
  ownerId: [ { required: true, message: '请选择任务负责人' } ]
})

const { validate, validateInfos, resetFields } = useForm(formState, ruleState)

const { loading, data: userList } = useRequest<UserList[]>(getUserList, {
  manual: true,
  ready: userReadyFetch
})

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
    const response = await basicListOperate(omit({
      ...formState,
      createTime: dayjs(formState.createTimeDay).format('YYYY-MM-DD HH:mm:ss'),
      owner: userList.value.find(item => item.id === formState.ownerId)?.name
    }, [ formState?.id ? '' : 'id', 'createTimeDay' ]))
    
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
      const response = await getBasicListDetails<BasicListItemDataType>({ id })
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
    full-spin
    type="normal"
    :width="640"
    :open="open"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    :title="formState.id ? '任务编辑' : '任务新增'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-form :colon="false" :wrapper-col="{ span: 20 }" :label-col="{ span: 4 }">
      <a-form-item label="任务名称" v-bind="validateInfos.title">
        <a-input
          allow-clear
          placeholder="请输入任务名称"
          v-model:value="formState.title"
        />
      </a-form-item>
      <a-form-item label="任务名称" v-bind="validateInfos.createTimeDay">
        <a-date-picker style="width: 100%" showTime v-model:value="formState.createTimeDay" />
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
          <a-select-option :key="item" :value="item.id" v-for="item in userList">
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
