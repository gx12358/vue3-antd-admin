<template>
  <g-pro-page-container>
    <div :class="$style['steps-form']">
      <div :class="$style['steps-form-steps-container']" style="max-width: 960px">
        <Steps :current="current">
          <Step v-for="item in steps" :key="item" :title="item" />
        </Steps>
      </div>
      <div :class="$style['steps-form-container']">
        <div
          :class="{
            [`${$style['steps-form-step']}`]: true,
            [`${$style['steps-form-step-active']}`]: current === 0
          }"
          v-show="current === 0"
        >
          <a-form :model="stepData" layout="vertical" ref="setpOne">
            <a-form-item label="付款账户" v-bind="validateInfos.payAccount">
              <a-select
                style="width: 328px"
                :options="[
                  {
                    value: 'ant-design@alipay.com',
                    label: 'ant-design@alipay.com'
                  }
                ]"
                placeholder="请选择付款账户"
                v-model:value="stepData.payAccount"
                allow-clear
              />
            </a-form-item>
            <div :class="$style['form-group']">
              <div :class="$style['form-group-title']">收款账户</div>
              <a-space :class="$style['form-group-container']" align="center">
                <a-form-item v-bind="validateInfos.receiverMode">
                  <a-select
                    style="width: 100px"
                    :options="[
                      {
                        value: 'alipay',
                        label: '支付宝'
                      },
                      {
                        value: 'bank',
                        label: '银行账户'
                      }
                    ]"
                    placeholder="请选择付款账户"
                    v-model:value="stepData.receiverMode"
                    allow-clear
                  />
                </a-form-item>
                <a-form-item v-bind="validateInfos.receiverAccount">
                  <a-input
                    placeholder="请输入收款人账户"
                    v-model:value="stepData.receiverAccount"
                    allow-clear
                  />
                </a-form-item>
              </a-space>
            </div>
            <a-form-item label="收款人姓名" v-bind="validateInfos.receiverName">
              <a-input
                style="width: 328px"
                placeholder="请输入收款人姓名"
                v-model:value="stepData.receiverName"
                allow-clear
              />
            </a-form-item>
            <a-form-item label="转账金额" v-bind="validateInfos.amount">
              <a-input-number
                style="width: 328px"
                placeholder="请输入金额"
                v-model:value="stepData.amount"
              />
            </a-form-item>
          </a-form>
        </div>
        <div
          :class="{
            [`${$style['steps-form-step']}`]: true,
            [`${$style['steps-form-step-active']}`]: current === 1
          }"
          v-show="current === 1"
        >
          <div :class="$style.result">
            <Alert
              closable
              showIcon
              message="确认转账后，资金将直接打入对方账户，无法退回。"
              style="margin-bottom: 24px"
            />
            <Descriptions :column="1" bordered>
              <DescriptionsItem label="付款账户">
                {{ stepData.payAccount || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="收款账户">
                {{ stepData.receiverAccount || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="收款人姓名">
                {{ stepData.receiverName || '-' }}
              </DescriptionsItem>
              <DescriptionsItem label="转账金额">
                <Statistic :value="stepData.amount" :precision="2">
                  <template #suffix>
                    <span style="font-size: 14px">元</span>
                  </template>
                </Statistic>
              </DescriptionsItem>
            </Descriptions>
            <a-divider style="margin: 24px 0" />
            <a-form :model="stepTwoData" layout="vertical">
              <a-form-item label="支付密码" v-bind="stepTwoValidateInfos.password">
                <a-input-password
                  style="width: 328px"
                  placeholder="请输入支付密码"
                  v-model:value="stepTwoData.password"
                />
              </a-form-item>
            </a-form>
          </div>
        </div>
        <div
          :class="{
            [`${$style['steps-form-step']}`]: true,
            [`${$style['steps-form-step-active']}`]: current === 2
          }"
          v-show="current === 2"
        >
          <div :class="$style.result">
            <Result status="success" title="操作成功" sub-title="预计两小时内到账">
              <template #extra>
                <a-button type="primary" @click="onFinish"> 再转一笔 </a-button>
                <a-button>查看账单</a-button>
              </template>
              <Descriptions :column="1">
                <DescriptionsItem label="付款账户">
                  {{ stepData.payAccount || '-' }}
                </DescriptionsItem>
                <DescriptionsItem label="收款账户">
                  {{ stepData.receiverAccount || '-' }}
                </DescriptionsItem>
                <DescriptionsItem label="收款人姓名">
                  {{ stepData.receiverName || '-' }}
                </DescriptionsItem>
                <DescriptionsItem label="转账金额">
                  <Statistic :value="stepData.amount" :precision="2">
                    <template #suffix>
                      <span style="font-size: 14px">元</span>
                    </template>
                  </Statistic>
                </DescriptionsItem>
              </Descriptions>
            </Result>
          </div>
        </div>
        <a-space align="center">
          <a-button
            v-if="current > 0 && current < 2"
            @click="
              () => {
                current -= 1
              }
            "
          >
            上一步
          </a-button>
          <a-button v-if="current < 2" type="primary" @click="nextStep">下一步</a-button>
        </a-space>
      </div>
    </div>
    <a-divider style="margin: 40px 0 24px" />
    <div :class="$style.desc">
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
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onActivated, computed } from 'vue'
import { useStore } from '@gx-vuex'
import { cloneDeep } from 'lodash-es'
import { Form, Result, Steps, Statistic, Descriptions, Alert } from 'ant-design-vue'
import { getStepForm } from '@/services/form/step'
import { hanndleField } from '@/utils/util'

const useForm = Form.useForm

const DescriptionsItem = Descriptions.Item
const Step = Steps.Step

export default defineComponent({
  components: { Result, Step, Steps, Statistic, Descriptions, DescriptionsItem, Alert },
  setup() {
    const store = useStore()
    const state = reactive({
      current: 0,
      steps: ['填写转账信息', '确认转账信息', '完成'],
      stepData: {
        payAccount: 'ant-design@alipay.com',
        receiverAccount: 'test@example.com',
        receiverName: 'Alex',
        amount: '500',
        receiverMode: 'alipay'
      },
      stepTwoData: {
        password: ''
      }
    })
    const rulesRef = reactive({
      payAccount: [{ required: true, message: '请选择付款账户' }],
      receiverMode: [{ required: true, message: '请选择付款账户' }],
      receiverAccount: [
        { required: true, message: '请输入收款人账户' },
        { type: 'email', message: '账户名应为邮箱格式' }
      ],
      receiverName: [{ required: true, message: '请输入收款人姓名' }],
      amount: [
        { required: true, message: '请输入转账金额' },
        { pattern: /^(\d+)((?:\.\d+)?)$/, message: '请输入合法金额数字' }
      ]
    })
    const stepTwoRulesRef = reactive({
      password: [{ required: true, message: '需要支付密码才能进行支付' }]
    })
    const userInfo = computed(() => store.user.userInfo)
    onActivated(async () => {
      const response = await getStepForm({
        userId: userInfo.value.userId
      })
      if (response) {
        const parames = cloneDeep(response.data || {})
        for (let i in state.stepData) {
          switch (i) {
            case 'payAccount':
              state.stepData[i] = parames[i] || undefined
              break
            default:
              state.stepData[i] = hanndleField(parames[i], '').value
              break
          }
        }
      }
    })
    const { resetFields, validate, validateInfos } = useForm(state.stepData, rulesRef)
    const stepTwoUseForm = useForm(state.stepTwoData, stepTwoRulesRef)
    const nextStep = () => {
      if (state.current === 0) {
        validate()
          .then(() => {
            state.current += 1
          })
          .catch(() => {})
      }
      if (state.current > 0) {
        stepTwoUseForm
          .validate()
          .then(() => {
            state.current += 1
          })
          .catch(() => {})
      }
    }
    const onFinish = () => {
      state.current = 0
      resetFields()
      stepTwoUseForm.resetFields()
    }
    return {
      ...toRefs(state),
      validateInfos,
      stepTwoValidateInfos: stepTwoUseForm.validateInfos,
      nextStep,
      onFinish
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
