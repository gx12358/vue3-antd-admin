<script setup lang="ts">
import type { FormState } from './typings'
import { useProConfigContext, useProForm } from '@gx-design-vue/pro-provider'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep, omit } from 'lodash-es'
import { reactive } from 'vue'
import { createForm } from '@/services/demo'

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

const loading = ref(false)

const formState = reactive<FormState>({
  title: '',
  timeRange: undefined,
  startTime: '',
  endTime: '',
  target: 1,
  clientName: '',
  summary: '',
  metrics: '',
  inviter: '',
  weight: 0
})

const { validateInfos, validate, resetFields } = useProForm(formState, {
  title: [ { required: true, message: '请输入标题' } ],
  timeRange: [ { required: true, message: '请输入起止日期' } ],
  summary: [ { required: true, message: '请输入目标描述' } ],
  metrics: [ { required: true, message: '请输入衡量标准' } ]
})

const handleFinish = async () => {
  validate().then(async () => {
    loading.value = true
    const params = cloneDeep(formState)
    const startTime = params.timeRange?.[0] ? dayjs(params.timeRange?.[0]).format('YYYY-MM-DD') : ''
    const endTime = params.timeRange?.[1] ? dayjs(params.timeRange?.[1]).format('YYYY-MM-DD') : ''
    try {
      await createForm({
        ...omit(params, 'timeRange'),
        startTime,
        endTime
      })

      message.success('操作成功')

      nextTick(() => resetFields())
    } catch {}
    loading.value = false
  }).catch(() => {
    loading.value = false
  })
}
</script>

<template>
  <g-pro-page-container :loading="loading">
    <div class="mx-auto mt-8px max-w-600px">
      <a-form layout="vertical">
        <a-form-item label="标题" v-bind="validateInfos.title">
          <a-input v-model:value="formState.title" class="w-328px" placeholder="请输入标题" allow-clear />
        </a-form-item>
        <a-form-item label="起止日期" v-bind="validateInfos.timeRange">
          <a-range-picker v-model:value="formState.timeRange" class="w-328px" allow-clear />
        </a-form-item>
        <a-form-item label="目标描述" v-bind="validateInfos.summary">
          <a-textarea v-model:value="formState.summary" :rows="3" placeholder="请输入你的阶段性工作目标" allow-clear />
        </a-form-item>
        <a-form-item label="衡量标准" v-bind="validateInfos.metrics">
          <a-textarea v-model:value="formState.metrics" :rows="3" placeholder="请输入衡量标准" allow-clear />
        </a-form-item>
        <a-form-item v-bind="validateInfos.clientName">
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
          <a-input v-model:value="formState.clientName" class="w-328px" placeholder="请描述你服务的客户，内部客户直接 @姓名／工号" allow-clear />
        </a-form-item>
        <a-form-item v-bind="validateInfos.inviter">
          <template #label>
            <div class="flex items-center gap-2px">
              <span>邀评人</span>
              <span :style="{ color: token.colorTextTertiary }">
                （选填）
              </span>
            </div>
          </template>
          <a-input v-model:value="formState.inviter" class="w-328px" placeholder="请直接 @姓名／工号，最多可邀请 5 人" allow-clear />
        </a-form-item>
        <a-form-item v-bind="validateInfos.weight">
          <template #label>
            <div class="flex items-center gap-2px">
              <span>权重</span>
              <span :style="{ color: token.colorTextTertiary }">
                （选填）
              </span>
            </div>
          </template>
          <a-input-number
            v-model:value="formState.weight"
            class="w-104px"
            :min="0"
            :max="100"
            placeholder="请直接 @姓名／工号，最多可邀请 5 人"
            allow-clear
            :formatter="(value) => `${value}%`"
            :parser="(value) => value.replace('%', '')"
          />
        </a-form-item>
        <a-form-item label="目标公开" v-bind="validateInfos.target">
          <a-radio-group v-model:value="formState.target" :options="optionList" />
        </a-form-item>
        <a-form-item>
          <a-button @click="() => resetFields()">
            重置
          </a-button>
          <a-button type="primary" class="ml-16px" @click="handleFinish">
            提交
          </a-button>
        </a-form-item>
      </a-form>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>

</style>
