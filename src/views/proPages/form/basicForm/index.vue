<script setup lang="ts">
import type { ProFormRef } from '@gx-design-vue/pro-form'
import type { BasicFormState } from '@gx-mock/datasSource/form'
import type { RangePickerProps } from 'ant-design-vue/es/date-picker/dayjs'
import type { Dayjs } from 'dayjs'
import { submitForm } from '@/services/formCenter'
import {
  GProForm,
  GProFormDateRangePicker,
  GProFormDigit,
  GProFormRadioGroup,
  GProFormText,
  GProFormTextArea,
} from '@gx-design-vue/pro-form'
import { useProConfigContext } from '@gx-design-vue/pro-provider'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { omit } from 'lodash-es'
import { reactive } from 'vue'

type FormState = BasicFormState & {
  timeRange: Dayjs[]
}

const optionList = [
  {
    value: 1,
    label: '公开'
  },
  {
    value: 2,
    label: '部分公开'
  },
  {
    value: 3,
    label: '不公开'
  }
]

const { token } = useProConfigContext()

const proFormRef = ref<ProFormRef>()

const formState = reactive<FormState>({
  title: '',
  timeRange: [],
  startTime: '',
  endTime: '',
  target: 1,
  clientName: '',
  summary: '',
  metrics: '',
  inviter: '',
  weight: 0
})

const rules = reactive({
  title: [ { required: true, message: '请输入标题' } ],
  timeRange: [ { required: true, message: '请输入起止日期' } ],
  summary: [ { required: true, message: '请输入目标描述' } ],
  metrics: [ { required: true, message: '请输入衡量标准' } ]
})

const handleFinish = async (params: FormState) => {
  const response = await submitForm({
    startTime: params.timeRange?.[0] ? dayjs(params.timeRange?.[0]).format('YYYY-MM-DD') : '',
    endTime: params.timeRange?.[1] ? dayjs(params.timeRange?.[1]).format('YYYY-MM-DD') : '',
    ...omit(params, 'timeRange')
  } as BasicFormState)
  
  if (response) {
    message.success('操作成功')
    
    nextTick(() => proFormRef.value?.formRef()?.resetFields())
  }
}
</script>

<template>
  <g-pro-page-container>
    <div class="flex items-center justify-center">
      <GProForm ref="proFormRef" :model="formState" :rules="rules" @submit="handleFinish">
        <GProFormText width="md" label="标题" name="title" :field-props="{ placeholder: '给目标起个名字' }" />
        <GProFormDateRangePicker width="md" label="起止日期" name="timeRange" :field-props="{ allowClear: true } as RangePickerProps" />
        <GProFormTextArea width="lg" label="目标描述" name="summary" :field-props="{ placeholder: '请输入你的阶段性工作目标' }" />
        <GProFormTextArea width="lg" label="衡量标准" name="metrics" :field-props="{ placeholder: '请输入衡量标准' }" />
        <GProFormText width="md" name="clientName" :field-props="{ placeholder: '请描述你服务的客户，内部客户直接 @姓名／工号' }">
          <template #label>
            <div class="flex items-center gap-2px">
              <span>客户</span>
              <span :style="{ color: token.colorTextTertiary }">
                （选填）
                <a-tooltip title="目标的服务对象">
                  <question-circle-outlined class="ml-4px" />
                </a-tooltip>
              </span>
            </div>
          </template>
        </GProFormText>
        <GProFormText width="md" name="inviter" :field-props="{ placeholder: '请直接 @姓名／工号，最多可邀请 5 人' }">
          <template #label>
            <div class="flex items-center gap-2px">
              <span>邀评人</span>
              <span :style="{ color: token.colorTextTertiary }">
                （选填）
              </span>
            </div>
          </template>
        </GProFormText>
        <GProFormDigit
          name="weight"
          :min="0"
          :max="100"
          :field-props="{ formatter: (value) => `${value}%`, parser: (value) => value.replace('%', '') }"
        >
          <template #label>
            <div class="flex items-center gap-2px">
              <span>权重</span>
              <span :style="{ color: token.colorTextTertiary }">
                （选填）
              </span>
            </div>
          </template>
        </GProFormDigit>
        <GProFormRadioGroup
          name="target"
          label="目标公开"
          :options="optionList"
        />
      </GProForm>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>

</style>
