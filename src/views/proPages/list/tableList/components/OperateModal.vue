<script setup lang="ts">
import type { RulesState } from '@gx-admin/hooks/system'
import type { RulesListItem } from '@gx-mock/datasSource/list/rule'
import type { Dayjs } from 'dayjs'
import { addRules, updateRules } from '@/services/listCenter'
import { useForm } from '@gx-admin/hooks/system'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep, omit } from 'lodash-es'
import { defauleState } from '../utils/config'

interface FormState {
  id?: number;
  name: string;
  desc: string;
  target: '0' | '1'; // 监控对象 0 表一 1 表二
  template: '0' | '1'; // 规则模版 0 规则模板一 1 规则模板二
  type: '0' | '1'; // 规则类型 0 强 1 弱
  createTime: string;
  frequency: 'month' | 'week'; // month 月 week 周
  createTimeDay?: Dayjs;
}

const emit = defineEmits<{
  (e: 'ok'): void
}>()

const steps = [ '基本信息', '配置规则属性', '设定调度周期' ]

const open = ref(false)
const spinning = ref(false)
const current = ref(0)
const operateType = ref<'add' | 'update'>('add')

const formState = reactive<FormState>(cloneDeep(defauleState))

const ruleState = reactive<Partial<RulesState<FormState>>>({
  name: [
    {
      required: true,
      message: '请输入标题'
    }
  ],
  desc: [
    {
      required: true,
      message: '请选择起止日期'
    }
  ],
  createTimeDay: [
    {
      required: true,
      validator: (_, value: Dayjs) => {
        if (value || current.value !== 2)
          return Promise.resolve()
        
        return Promise.reject('请选择开始时间')
      }
    }
  ]
})

const { validateInfos, validate, resetFields, clearValidate } = useForm(formState, ruleState)

const changeStep = (type: 'next' | 'back') => {
  if (type === 'next') {
    validate().then((_) => {
      current.value += 1
    }).catch((_) => {})
  } else if (type === 'back') {
    clearValidate(Object.keys(ruleState))
    current.value -= 1
  }
}

const handleCancel = () => {
  open.value = false
  spinning.value = false
  current.value = 0
  resetFields()
}

const handleOk = () => {
  validate().then(async (_) => {
    spinning.value = true
    if (operateType.value === 'update') {
      formState.createTime = dayjs(formState.createTimeDay)
        .format('YYYY-MM-DD HH:mm:ss')
}
    const fetchFun = operateType.value === 'add' ? addRules : updateRules
    const response = await fetchFun({ ...omit(formState, 'createTimeDay') })
    
    if (response) {
      message.success('操作成功')
      emit('ok')
      handleCancel()
    }
    
    spinning.value = false
  }).catch((_) => {})
}

defineExpose({
  open: (type: 'add' | 'update', record?: RulesListItem) => {
    operateType.value = type
    
    if (record) {
      formState.id = record.id
      formState.name = record.name
      formState.desc = record.desc
    }
    
    open.value = true
  }
})
</script>

<template>
  <g-pro-modal
    type="normal"
    full-spin
    :width="operateType === 'add' ? 400 : 640"
    :open="open"
    :spinning="spinning"
    :title="operateType === 'add' ? '新建规则' : '规则配置'"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <a-steps v-if="operateType === 'update'" v-model:current="current" size="small">
      <a-step v-for="item in steps" :key="item" :title="item" />
    </a-steps>
    <div :class="operateType === 'update' ? 'w-60% m-auto mt-24px' : ''">
      <a-form v-show="current === 0" layout="vertical">
        <a-form-item v-bind="validateInfos.name" label="规则名称">
          <a-input v-model:value="formState.name" placeholder="请输入" allow-clear />
        </a-form-item>
        <a-form-item v-bind="validateInfos.desc" label="规则描述">
          <a-textarea v-model:value="formState.desc" placeholder="请输入" allow-clear :auto-size="{ minRows: 4 }" />
        </a-form-item>
      </a-form>
      <a-form v-show="current === 1" v-if="operateType === 'update'" layout="vertical">
        <a-form-item v-bind="validateInfos.target" label="监控对象">
          <a-select
            v-model:value="formState.target"
            style="width: 100%"
            :options="[
              {
                value: '0',
                label: '表一',
              },
              {
                value: '1',
                label: '表二',
              },
            ]"
            placeholder="请选择"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.template" label="规则模板">
          <a-select
            v-model:value="formState.template"
            style="width: 100%"
            :options="[
              {
                value: '0',
                label: '规则模板一',
              },
              {
                value: '1',
                label: '规则模板二',
              },
            ]"
            placeholder="请选择"
            allow-clear
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.type" label="规则类型">
          <a-radio-group
            v-model:value="formState.type"
            :options="[
              {
                value: '0',
                label: '强',
              },
              {
                value: '1',
                label: '弱',
              },
            ]"
          />
        </a-form-item>
      </a-form>
      <a-form v-show="current === 2" v-if="operateType === 'update'" layout="vertical">
        <a-form-item v-bind="validateInfos.createTimeDay" label="开始时间">
          <a-date-picker
            v-model:value="formState.createTimeDay"
            style="width: 100%"
            show-time
          />
        </a-form-item>
        <a-form-item v-bind="validateInfos.frequency" label="监控对象">
          <a-select
            v-model:value="formState.frequency"
            style="width: 100%"
            :options="[
              {
                value: 'month',
                label: '月',
              },
              {
                value: 'week',
                label: '周',
              },
            ]"
            placeholder="请选择"
            allow-clear
          />
        </a-form-item>
      </a-form>
    </div>
    <template v-if="operateType === 'update'" #footer>
      <a-button v-if="current > 0" @click="changeStep('back')">
        上一步
      </a-button>
      <a-button v-if="current < steps.length - 1" type="primary" @click="changeStep('next')">
        下一步
      </a-button>
      <a-button v-if="current === steps.length - 1" type="primary" @click="handleOk">
        提交
      </a-button>
    </template>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
