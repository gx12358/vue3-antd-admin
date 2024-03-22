<template>
  <g-pro-page-container>
    <a-typography>
      <a-typography-title :level="2">
        ProField
      </a-typography-title>
      <a-typography-paragraph>
        <a-typography-text type="secondary">该组件为内部组件，请勿直接使用。</a-typography-text>
        <div class="mt-10px">原子信息组件，统一 ProForm等组件里面的字段定义。</div>
      </a-typography-paragraph>
      <a-typography-title :level="3">
        Demo
      </a-typography-title>
      <a-space>
        <a-radio-group v-model:value="state">
          <a-radio value="read">只读</a-radio>
          <a-radio value="edit">编辑</a-radio>
        </a-radio-group>
        简约模式
        <a-switch v-model:checked="plain" />
      </a-space>
      <a-descriptions style="margin-top: 15px" :column="2">
        <a-descriptions-item label="空字符串">
          <GProField text="" mode="read" />
        </a-descriptions-item>
        <a-descriptions-item label="头像">
          <GProField
            text="https://avatars2.githubusercontent.com/u/8186664?s=60&v=4"
            mode="read"
            valueType="avatar"
          />
        </a-descriptions-item>
        <a-descriptions-item label="文本">
          <GProField text="这是一段文本" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="图片">
          <GProField
            text="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
            valueType="image"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="金额">
          <GProField text="100" valueType="money" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="颜色">
          <GProField text="#1099aa" valueType="color" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="数字">
          <GProField text="19897979797979" valueType="digit" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="秒格式化">
          <GProField text="2000000" valueType="second" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="百分比">
          <GProField text="100" valueType="percent" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="评分">
          <GProField text="3.5" valueType="rate" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="选择框">
          <GProField
            light
            text="open"
            :mode="state"
            :valueEnum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error'
              },
              closed: {
                text: '已解决',
                status: 'Success'
              },
              processing: {
                text: '解决中',
                status: 'Processing'
              }
            }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="多选">
          <GProField
            :text="['open', 'closed']"
            :mode="state"
            valueType="checkbox"
            :valueEnum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error'
              },
              closed: {
                text: '已解决',
                status: 'Success'
              },
              processing: {
                text: '解决中',
                status: 'Processing'
              }
            }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="多选 labelInValue">
          <GProField
            :text="[
              {
                value: 'open1',
                label: '打开'
              },
              {
                value: 'closed2',
                label: '关闭'
              }
            ]"
            :mode="state"
            valueType="checkbox"
            :valueEnum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error'
              },
              closed: {
                text: '已解决',
                status: 'Success'
              },
              processing: {
                text: '解决中',
                status: 'Processing'
              }
            }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="单选">
          <GProField
            text="open"
            :mode="state"
            valueType="radio"
            :valueEnum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error'
              },
              closed: {
                text: '已解决',
                status: 'Success'
              },
              processing: {
                text: '解决中',
                status: 'Processing'
              }
            }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="单选按钮">
          <GProField
            text="open"
            :mode="state"
            valueType="radioButton"
            :valueEnum="{
              all: { text: '全部', disabled: true, status: 'Default' },
              open: {
                text: '未解决',
                status: 'Error'
              },
              closed: {
                text: '已解决',
                status: 'Success'
              },
              processing: {
                text: '解决中',
                status: 'Processing'
              }
            }"
          />
        </a-descriptions-item>
        <a-descriptions-item label="远程选择框">
          <GProField
            text="open"
            valueType="select"
            :mode="state"
            :request="async () => [
              { label: '全部', value: 'all' },
              { label: '未解决', value: 'open' },
              { label: '已解决', value: 'closed' },
              { label: '解决中', value: 'processing' },
              {
                label: '特殊选项',
                value: 'optGroup',
                optionType: 'optGroup',
                options: [
                  { label: '不解决', value: 'no' },
                  { label: '已废弃', value: 'clear' }
                ]
              }
            ]"
          />
        </a-descriptions-item>
        <a-descriptions-item label="级联选择框">
          <GProField
            :text="['zhejiang', 'hangzhou', 'xihu']"
            valueType="cascader"
            :mode="state"
            :request="async () => [
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
                        label: 'West Lake'
                      }
                    ]
                  }
                ]
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
                        label: 'Zhong Hua Men'
                      }
                    ]
                  }
                ]
              }
            ]"
          />
        </a-descriptions-item>
        <a-descriptions-item label="进度条">
          <GProField text="40" valueType="progress" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="百分比">
          <a-space>
            <GProField
              :text="10"
              :valueType="{
                type: 'percent',
                showSymbol: true,
                showColor: true
              }"
              mode="read"
            />
            <GProField
              :text="0"
              :valueType="{
                type: 'percent',
                showSymbol: true,
                showColor: true
              }"
              mode="read"
            />
            <GProField
              :text="-10"
              :valueType="{
                type: 'percent',
                showSymbol: true,
                showColor: true
              }"
              mode="read"
            />
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="日期时间">
          <GProField :text="dateTime" valueType="dateTime" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="相对于当前时间">
          <a-space>
            <GProField :text="dateTime" valueType="fromNow" :mode="state" :plain="plain" />
            <GProField
              :text="dayjs('2013-11-16 12:50:26').valueOf()"
              valueType="fromNow"
              :mode="state"
              :plain="plain"
            />
          </a-space>
        </a-descriptions-item>
        <a-descriptions-item label="日期">
          <GProField :text="dateTime" valueType="date" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="日期:周">
          <GProField :text="dateTime" valueType="dateWeek" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="日期:月">
          <GProField :text="dateTime" valueType="dateMonth" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="日期:季度">
          <GProField
            :text="dayjs().valueOf()"
            valueType="dateQuarter"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="日期:年">
          <GProField :text="dayjs().valueOf()" valueType="dateYear" :mode="state" :plain="plain" />
        </a-descriptions-item>
        <a-descriptions-item label="日期区间">
          <GProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf()
            ]"
            valueType="dateRange"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="日期时间区间">
          <GProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf()
            ]"
            valueType="dateTimeRange"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="时间">
          <GProField
            :text="dayjs('2019-11-16 12:50:26').valueOf()"
            valueType="time"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="时间区间">
          <GProField
            :text="[
              dayjs('2019-11-16 12:50:26').add(-1, 'd').valueOf(),
              dayjs('2019-11-16 12:50:26').valueOf(),
            ]"
            valueType="timeRange"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="代码块">
          <GProField
            :text="code"
            valueType="code"
            :mode="state"
            :plain="plain"
          />
        </a-descriptions-item>
        <a-descriptions-item label="代码块">
          <GProField :text="jsonCode" valueType="jsonCode" :mode="state" :plain="plain" />
        </a-descriptions-item>
      </a-descriptions>
    </a-typography>
  </g-pro-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import dayjs from 'dayjs'
import { GProField, type ProFieldFCMode } from '@gx-design-vue/pro-field'

const state = ref<ProFieldFCMode>('read')
const plain = ref(false)
const dateTime = ref(dayjs('2019-11-16 12:50:26').valueOf())
const code = ref(`yarn run v1.22.0
$ eslint --format=pretty ./packages
Done in 9.70s.`)
const jsonCode = ref(`{
  "compilerOptions": {
    "target": "esnext",
    "moduleResolution": "node",
    "jsx": "preserve",
    "esModuleInterop": true,
    "experimentalDecorators": true,
    "strict": true,
    "forceConsistentCasingInFileNames": true,
    "noImplicitReturns": true,
    "suppressImplicitAnyIndexErrors": true,
    "declaration": true,
    "skipLibCheck": true
  },
  "include": ["**/src", "**/docs", "scripts", "**/demo", ".eslintrc.js"]
}
`)
</script>

<style lang="less" scoped>
&:deep(pre) {
  white-space: revert;
}
</style>
