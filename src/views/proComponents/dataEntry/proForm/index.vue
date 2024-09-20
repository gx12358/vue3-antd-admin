<script setup lang="ts">
import type { ProFormRef } from '@gx-design-vue/pro-form'
import type { PublicFormState } from '@gx-mock/config/form'
import { getFormDetails } from '@/services/formCenter'
import { MailTwoTone } from '@ant-design/icons-vue'
import {
  GProForm,
  GProFormCaptcha,
  GProFormCascader,
  GProFormDateRangePicker,
  GProFormDigit,
  GProFormGroup,
  GProFormMoney,
  GProFormSelect,
  GProFormText
} from '@gx-design-vue/pro-form'
import { message } from 'ant-design-vue'
import { h, reactive, ref } from 'vue'

const formRef = ref<ProFormRef>()

const initValues = reactive<PublicFormState>({
  name: '',
  company: '',
  count: null,
  contract: '',
  createTime: [],
  useMode: undefined,
  unusedMode: undefined,
  phone: '',
  captcha: '',
  id: null,
  project: '',
  mangerName: '',
  area: [ 'zhejiang', 'hangzhou', 'xihu' ]
})

const rules = reactive({
  name: [ { required: true, message: '这是必填项' } ],
  useMode: [ { required: true, message: '请选择合同约定生效方式' } ],
  phone: [ { required: true, message: '这是必填项' } ],
  captcha: [ { required: true, message: '请输入验证码' } ]
})

const waitTime = (time = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true)
    }, time)
  })
}

const queryForm: () => Promise<Partial<PublicFormState>> = async () => {
  const response: ResponseResult<PublicFormState> = await getFormDetails()
  return {
    ...response?.data || {},
    useMode: 'chapter'
  }
}

const handleGetCaptcha = async (phone) => {
  await waitTime(1000)
  message.success(`手机号 ${phone} 验证码发送成功!`)
}

const handleFinish = async (values: any) => {
  await waitTime(2000)
  console.log(values)
  const val1 = await formRef.value?.formRef()?.modelRef
  console.log('validateFields:', val1)
  const val2 = await formRef.value?.formRef()?.validateFieldsReturnFormatValue?.()
  console.log('validateFieldsReturnFormatValue:', val2)
  message.success('提交成功')
}
</script>

<template>
  <g-pro-page-container>
    <a-typography id="g-pro-form">
      <a-typography-title :level="2" :style="{ color: '#454d64' }">
        ProForm 高级表单
      </a-typography-title>
      <p style="font-size: 15px">
        ProForm 在原来的 Form
        的基础上增加一些语法糖和更多的布局设置，帮助我们快速的开发一个表单。同时添加一些默认行为，让我们的表单默认好用。
      </p>
      <p style="font-size: 15px">
        分步表单，Modal 表单，Drawer 表单，查询表单，轻量筛选等多种 layout
        可以覆盖大部分的使用场景，脱离复杂而且繁琐的表单布局工作，更少的代码完成更多的功能。
      </p>
      <p>
        ProForm 没有黑科技，只是 antd 的 Form 的封装，如果要使用自定义的组件可以用 Form.Item
        包裹后使用，支持混用。（
        <a-typography-text type="danger" code style="font-size: 14px">
          ProForm
        </a-typography-text>
        表单项的
        <a-typography-text type="danger" code style="font-size: 14px">
          name
        </a-typography-text>
        值必须要传，否则报错！）
      </p>
    </a-typography>
    <GProForm
      ref="formRef"
      :model="initValues"
      :rules="rules"
      :params="{ id: '100' }"
      :request="queryForm"
      @submit="handleFinish"
    >
      <GProFormGroup>
        <GProFormText width="md" name="name" tooltip="最长为 24 位" placeholder="请输入名称">
          <template #label>
            <span>签约客户名称</span>
          </template>
          <template #addonItemBefore>
            <a>客户名称应该怎么获得？</a>
          </template>
          <template #addonItemAfter>
            <a>客户名称应该怎么获得？</a>
          </template>
        </GProFormText>
        <GProFormText
          width="md"
          name="company"
          label="我方公司名称"
          placeholder="请输入名称"
        />
      </GProFormGroup>
      <GProFormGroup>
        <GProFormDigit name="count" label="人数" width="lg" />
      </GProFormGroup>
      <GProFormGroup>
        <GProFormText width="md" name="contract" label="合同名称" placeholder="请输入名称" />
        <GProFormDateRangePicker width="md" name="createTime" label="合同生效时间" />
      </GProFormGroup>
      <GProFormGroup>
        <GProFormText width="md" name="phone" label="手机号" placeholder="请输入手机号" />
      </GProFormGroup>
      <GProFormGroup>
        <GProFormSelect
          width="xs"
          name="useMode"
          label="合同约定生效方式"
          readonly
          bordered
          :options="[
            {
              value: 'chapter',
              label: '盖章后生效',
            },
          ]"
        />
        <GProFormSelect
          width="xs"
          name="unusedMode"
          label="合同约定失效方式"
          :options="[
            {
              value: 'time',
              label: '履行完终止',
            },
          ]"
        />
        <GProFormMoney width="md" name="money" label="合同约定金额" />
      </GProFormGroup>
      <GProFormText width="sm" name="id" label="主合同编号" />
      <GProFormText width="md" disabled name="project" label="项目名称" />
      <GProFormText width="xs" disabled name="mangerName" label="商务经理" />
      <GProFormCascader
        width="md"
        :request="
          async () => [
            {
              value: 'zhejiang',
              label: 'Zhejiang',
              children: [
                {
                  value: 'hangzhou',
                  label: 'Hangzhou',
                  children: [
                    {
                      value: 'xihu',
                      label: 'West Lake',
                    },
                  ],
                },
              ],
            },
            {
              value: 'jiangsu',
              label: 'Jiangsu',
              children: [
                {
                  value: 'nanjing',
                  label: 'Nanjing',
                  children: [
                    {
                      value: 'zhonghuamen',
                      label: 'Zhong Hua Men',
                    },
                  ],
                },
              ],
            },
          ]
        "
        name="area"
        label="区域"
      />
      <GProFormGroup>
        <GProFormCaptcha
          :field-props="{
            size: 'large',
            prefix: h(MailTwoTone),
          } as any"
          label="验证码"
          :captcha-props="{ size: 'large' }"
          phone-name="phone"
          name="captcha"
          placeholder="请输入验证码"
          @get-captcha="handleGetCaptcha"
        />
      </GProFormGroup>
    </GProForm>
  </g-pro-page-container>
</template>
