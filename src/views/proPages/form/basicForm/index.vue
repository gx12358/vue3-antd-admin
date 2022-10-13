<template>
  <g-pro-page-container>
    <a-form style="max-width: 600px; margin: 8px auto auto" :model="formState" layout="vertical">
      <a-form-item label="标题" v-bind="validateInfos.title">
        <a-input
          style="width: 328px"
          v-model:value="formState.title"
          placeholder="给目标起个名字"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="起止日期" v-bind="validateInfos.date">
        <a-range-picker show-time style="width: 328px" v-model:value="formState.date" />
      </a-form-item>
      <a-form-item label="目标描述" v-bind="validateInfos.goal">
        <a-textarea
          v-model:value="formState.goal"
          :auto-size="{ minRows: 3 }"
          placeholder="请输入你的阶段性工作目标"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="衡量标准" v-bind="validateInfos.standard">
        <a-textarea
          v-model:value="formState.standard"
          :auto-size="{ minRows: 3 }"
          placeholder="请输入衡量标准"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <template #label>
          <span>
            客户
            <em :class="$style.optional">（选填）</em>
            <a-tooltip title="目标的服务对象">
              <QuestionCircleOutlined :class="$style['gx-form-item-tooltip']" />
            </a-tooltip>
          </span>
        </template>
        <a-input
          style="width: 328px"
          v-model:value="formState.client"
          placeholder="请描述你服务的客户，内部客户直接 @姓名／工号"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <template #label>
          <span>
            邀评人
            <em :class="$style.optional">（选填）</em>
          </span>
        </template>
        <a-input
          style="width: 328px"
          v-model:value="formState.invites"
          placeholder="请直接 @姓名／工号，最多可邀请 5 人"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <template #label>
          <span>
            权重
            <em :class="$style.optional">（选填）</em>
          </span>
        </template>
        <a-input-number
          v-model:value="formState.weight"
          placeholder="请输入"
          :min="0"
          :max="100"
          :formatter="(value) => `${value}%`"
          :parser="(value) => value.replace('%', '')"
        />
      </a-form-item>
      <a-form-item label="目标公开">
        <template #extra> 客户、邀评人默认被分享 </template>
        <a-radio-group
          :options="[
            {
              value: '1',
              label: '公开'
            },
            {
              value: '2',
              label: '部分公开'
            },
            {
              value: '3',
              label: '不公开'
            }
          ]"
          v-model:value="formState.publicType"
        />
      </a-form-item>
      <a-form-item v-if="formState.publicType === '2'">
        <a-select
          style="width: 328px"
          :options="[
            {
              value: '1',
              label: '同事甲'
            },
            {
              value: '2',
              label: '同事乙'
            },
            {
              value: '3',
              label: '同事丙'
            }
          ]"
          placeholder="请选择"
          v-model:value="formState.publicUsers"
          allow-clear
        />
      </a-form-item>
      <a-form-item>
        <a-button type="primary" @click="onSubmit">提交</a-button>
        <a-button style="margin-left: 10px" @click="resetFields">重置</a-button>
      </a-form-item>
    </a-form>
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, toRaw } from 'vue'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { Form } from 'ant-design-vue'
import { QuestionCircleOutlined } from '@ant-design/icons-vue'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import { getBasicForm } from '@/services/form/basic'
import { hanndleField } from '@/utils/util'

const useForm = Form.useForm

interface basicFormModel {
  title: string
  date: Dayjs[]
  goal: string
  standard: string
  client: string
  weight: number
  publicType: string
  publicUsers: string | undefined
}

export default defineComponent({
  components: { QuestionCircleOutlined },
  setup() {
    const state = reactive({
      formState: {
        title: '',
        date: [],
        goal: '',
        standard: '',
        client: '',
        weight: 0,
        publicType: '',
        publicUsers: undefined
      } as basicFormModel
    })
    const rulesRef = reactive({
      title: [
        {
          required: true,
          message: '请输入标题'
        }
      ],
      date: [
        {
          required: true,
          message: '请选择起止日期'
        }
      ],
      goal: [
        {
          required: true,
          message: '请输入目标描述'
        }
      ],
      standard: [
        {
          required: true,
          message: '请输入衡量标准'
        }
      ]
    })
    onMountedOrActivated(async () => {
      const response: any = await getBasicForm()
      if (response) {
        for (let i in response.data) {
          switch (i) {
            case 'weight':
              state.formState[i] = response.data[i] || 0
              break
            case 'publicUsers':
              state.formState[i] = response.data[i] || undefined
              break
            default:
              state.formState[i] = hanndleField(response.data[i], '').value
              break
          }
        }
        state.formState.date = response.data.startTime
          ? [
              dayjs(response.data.startTime, 'YYYY-MM-DD HH:mm:ss'),
              dayjs(response.data.endTime, 'YYYY-MM-DD HH:mm:ss')
            ]
          : []
      }
    })
    const { resetFields, validate, validateInfos } = useForm(state.formState, rulesRef)
    const onSubmit = () => {
      validate()
        .then(() => {
          console.log(toRaw(state.formState))
        })
        .catch((err) => {
          console.log('error', err)
        })
    }
    return {
      ...toRefs(state),
      resetFields,
      validateInfos,
      onSubmit
    }
  }
})
</script>

<style lang="less" module>
.optional {
  font-style: normal;
  color: @text-color-secondary;
}

.gx-form-item-tooltip {
  margin-inline-start: 4px;
  color: #00000073;
  cursor: help;
  writing-mode: horizontal-tb;
}
</style>
