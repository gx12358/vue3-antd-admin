<script setup lang="ts">
import type { RulesState } from '@gx-admin/hooks/system'
import { getStepForm } from '@/services/formCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { useForm } from '@gx-admin/hooks/system'
import { hanndleField } from '@gx-design-vue/pro-utils'

interface FormState {
  payAccount: string;
  receiverAccount: string;
  receiverName: string;
  amount: string;
  receiverMode: string;
  password: string;
}

const steps = [ '填写转账信息', '确认转账信息', '完成' ]

const { user } = useStore()

const current = ref(0)

const formState = reactive<FormState>({
  payAccount: '',
  receiverAccount: '',
  receiverName: '',
  amount: '',
  receiverMode: '',
  password: ''
})

const rulesRef = reactive<Partial<RulesState<FormState>>>({
  payAccount: [ { required: true, message: '请选择付款账户' } ],
  receiverMode: [ { required: true, message: '请选择付款账户' } ],
  receiverAccount: [
    { required: true, message: '请输入收款人账户' },
    { type: 'email', message: '账户名应为邮箱格式' }
  ],
  receiverName: [ { required: true, message: '请输入收款人姓名' } ],
  amount: [
    { required: true, message: '请输入转账金额' },
    { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' }
  ],
  password: [
    {
      required: true,
      validator: (_, value) => {
        if (current.value === 1) {
          if (!value) {
            return Promise.reject('需要支付密码才能进行支付！')
          }
        }
        
        return Promise.resolve()
      }
    }
  ]
})

const { validate, validateInfos, resetFields } = useForm<FormState>(formState, rulesRef)

const { loading } = useRequest<FormState, { userId: number; }>(getStepForm, {
  params: {
    userId: user.userInfo.userId
  },
  onSuccess: (data) => {
    for (const i in formState) {
      switch (i) {
        case 'payAccount':
          formState[i] = data[i] || undefined
          break
        default:
          formState[i] = hanndleField(data[i], '').value
          break
      }
    }
  }
})

const handleNext = () => {
  validate().then(() => {
    current.value += 1
  }).catch(() => {})
}

const onFinish = () => {
  current.value = 0
  resetFields()
}
</script>

<template>
  <g-pro-page-container :loading="loading">
    <div class="steps-form">
      <div class="steps-form-steps-container">
        <a-steps v-model:current="current">
          <a-step v-for="item in steps" :key="item" :title="item" />
        </a-steps>
      </div>
      <div class="steps-form-container lt-sm:!min-w-full">
        <div v-show="current === 0" class="steps-form-step">
          <a-form layout="vertical">
            <a-form-item label="付款账户" v-bind="validateInfos.payAccount">
              <a-select
                v-model:value="formState.payAccount"
                style="width: 328px"
                :options="[
                  {
                    value: 'ant-design@alipay.com',
                    label: 'ant-design@alipay.com',
                  },
                ]"
                placeholder="请选择付款账户"
                allow-clear
              />
            </a-form-item>
            <div class="mb-24px font-blod">
              收款账户
            </div>
            <div class="flex items-center gap-8px">
              <a-form-item v-bind="validateInfos.receiverMode">
                <a-select
                  v-model:value="formState.receiverMode"
                  style="width: 100px"
                  :options="[
                    {
                      value: 'alipay',
                      label: '支付宝',
                    },
                    {
                      value: 'bank',
                      label: '银行账户',
                    },
                  ]"
                  placeholder="请选择付款账户"
                  allow-clear
                />
              </a-form-item>
              <a-form-item v-bind="validateInfos.receiverAccount">
                <a-input
                  v-model:value="formState.receiverAccount"
                  placeholder="请输入收款人账户"
                  allow-clear
                />
              </a-form-item>
            </div>
            <a-form-item label="收款人姓名" v-bind="validateInfos.receiverName">
              <a-input
                v-model:value="formState.receiverName"
                style="width: 328px"
                placeholder="请输入收款人姓名"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="转账金额" v-bind="validateInfos.amount">
              <a-input-number
                v-model:value="formState.amount"
                style="width: 328px"
                placeholder="请输入金额"
              />
            </a-form-item>
          </a-form>
        </div>
        <div v-show="current === 1" class="steps-form-step">
          <div class="result">
            <a-alert
              closable
              show-icon
              message="确认转账后，资金将直接打入对方账户，无法退回。"
              style="margin-bottom: 24px"
            />
            <a-descriptions :column="1" bordered>
              <a-descriptions-item label="付款账户">
                {{ formState.payAccount || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="收款账户">
                {{ formState.receiverAccount || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="收款人姓名">
                {{ formState.receiverName || '-' }}
              </a-descriptions-item>
              <a-descriptions-item label="转账金额">
                <a-statistic :value="formState.amount" :precision="2">
                  <template #suffix>
                    <span class="!text-14px">元</span>
                  </template>
                </a-statistic>
              </a-descriptions-item>
            </a-descriptions>
            <a-divider style="margin: 24px 0" />
            <a-form layout="vertical">
              <a-form-item label="支付密码" v-bind="validateInfos.password">
                <a-input-password
                  v-model:value="formState.password"
                  style="width: 328px"
                  placeholder="请输入支付密码"
                />
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div v-show="current === 2" class="steps-form-step">
          <div class="result">
            <a-result status="success" title="操作成功" sub-title="预计两小时内到账">
              <template #extra>
                <a-button type="primary" @click="onFinish">
                  再转一笔
                </a-button>
                <a-button>查看账单</a-button>
              </template>
              <a-descriptions :column="1">
                <a-descriptions-item label="付款账户">
                  {{ formState.payAccount || '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="收款账户">
                  {{ formState.receiverAccount || '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="收款人姓名">
                  {{ formState.receiverName || '-' }}
                </a-descriptions-item>
                <a-descriptions-item label="转账金额">
                  <a-statistic :value="formState.amount" :precision="2">
                    <template #suffix>
                      <span class="!text-14px">元</span>
                    </template>
                  </a-statistic>
                </a-descriptions-item>
              </a-descriptions>
            </a-result>
          </div>
        </div>
        <div class="flex gap-8px">
          <a-button v-if="current > 0 && current < 2" @click="current -= 1">
            上一步
          </a-button>
          <a-button v-if="current < 2" type="primary" @click="handleNext">
            下一步
          </a-button>
        </div>
      </div>
      <a-divider style="margin: 40px 0 24px" />
      <div class="desc">
        <h3>说明</h3>
        <h4>转账到支付宝账户</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
        <h4>转账到银行卡</h4>
        <p>
          如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。如果需要，这里可以放一些关于产品的常见问题说明。
        </p>
      </div>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
@import "./style";
</style>
