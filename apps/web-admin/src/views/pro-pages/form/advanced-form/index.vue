<script setup lang="ts">
import type { FormState } from './typings'
import type { FomeType } from '@/services/demo/form'
import { app } from '@gx-config'
import { handleOffsetTop } from '@gx-core/shared/utils'
import { useProConfigContext, useProForm } from '@gx-design-vue/pro-provider'
import { forInObject, handleEmptyField, scrollTo } from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { reactive, ref } from 'vue'
import { useProPageTable } from '@/hooks/web'
import { createList, deleteList, getForm, getList, updateList } from '@/services/demo'
import { columns } from './utils/columns'
import { fieldLabels, rules } from './utils/config'

const { viewScrollRoot } = app.system

interface ErrorField {
  name: string
  errors: string[]
}

const { token } = useProConfigContext()

const tableRef = ref()

const [
  {
    dataSource,
    setDataValue,
    reload,
    setLoading,
    tableState
  }
] = useProPageTable<TableRecord<FormState>, FormState>(
  tableRef,
  {
    state: {
      showLoading: false,
      rowKey: 'id',
      showIndex: false,
      pagination: false,
      columns
    },
    request: getList
  }
)

const state = reactive({
  editableData: {} as TableRecord<FormState>,
  errorFields: [] as ErrorField[]
})

const formState = reactive<FormState>({
  name: '',
  url: '',
  owner: undefined,
  approver: undefined,
  dateRange: [],
  type: undefined,
  name2: '',
  url2: '',
  owner2: undefined,
  approver2: undefined,
  dateTime: undefined,
  type2: undefined
})

const { validate, validateInfos, resetFields } = useProForm<FormState>(formState, reactive(rules))

const { loading } = useRequest<FormState, { type: FomeType; }>(getForm, {
  params: {
    type: 'advanced'
  },
  onSuccess: (data) => {
    tableState.showLoading = true
    forInObject(formState, (key) => {
      switch (key) {
        case 'dateRange':
          formState[key] = data[key] ? [ dayjs(data[key][0]), dayjs(data[key][1]) ] : undefined
          break
        case 'dateTime':
          formState[key] = data[key] ? dayjs(data[key]) : undefined
          break
        default :
          formState[key] = handleEmptyField(data[key], '').value
      }
    })
  }
})

const handelEdit = (key) => {
  state.editableData[key] = cloneDeep(dataSource.value.find(item => key === item.id))
}

const handleSave = async (record: TableRecord<FormState>) => {
  try {
    const requestFn = record.isMock ? createList : updateList
    await requestFn(record)
    message.success('操作成功')
    await reload?.({ immediate: true })
    record.id && (delete state.editableData[record.id])
  } catch {}
}

const handleCancel = (key: number) => {
  delete state.editableData[key]
}

const handleDelete = async (key: number) => {
  if (state.editableData[key]?.isMock) {
    setDataValue({ value: key, type: 'delete' })
    delete state.editableData[key]
  } else {
    setLoading(true)
    try {
      await deleteList({ id: key })
      message.success('操作成功')
      await reload({ immediate: true })
      delete state.editableData[key]
    } catch {}
    setLoading(false)
  }
}

const handelTableAdd = () => {
  const key = dataSource.value.length + 1
  setDataValue({
    type: 'push',
    row: {
      id: key,
      workId: '',
      name: '',
      department: '',
      isMock: true,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    }
  })
  nextTick(() => {
    state.editableData[key] = cloneDeep(dataSource.value.find(item => key === item.id))
  })
}

const scrollToField = (fieldKey: string) => {
  const labelNode = document.documentElement.querySelector(
    `label[title="${fieldLabels[fieldKey]}"]`
  ) as HTMLElement
  if (labelNode) {
    scrollTo(handleOffsetTop(labelNode).top - 46 - 62, {
      getContainer: () => document.querySelector(viewScrollRoot) as HTMLInputElement,
      duration: 450
    })
  }
}

const submitForm = () => {
  validate()
    .then(() => {
      state.errorFields = []
      const parames = {
        ...formState,
        member: cloneDeep(dataSource.value)
      }
      console.log(parames)
    })
    .catch(({ errorFields }) => {
      state.errorFields = errorFields
      scrollToField(state.errorFields?.[0]?.name)
    })
}

const resetForm = () => {
  resetFields()
  state.errorFields = []
}
</script>

<template>
  <g-pro-page-container :use-page-card="false" :loading="loading">
    <a-form layout="vertical">
      <div class="flex flex-col gap-24px">
        <a-card title="仓库管理" class="card" :body-style="{ width: '100%', display: 'block' }">
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.name" v-bind="validateInfos.name">
                <a-input v-model:value="formState.name" placeholder="请输入仓库名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.url" v-bind="validateInfos.url">
                <a-input
                  v-model:value="formState.url"
                  style="width: 100%"
                  addon-before="Http://"
                  addon-after=".com"
                  placeholder="请输入"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.owner" v-bind="validateInfos.owner">
                <a-select
                  v-model:value="formState.owner"
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao',
                    },
                    {
                      label: '周毛毛',
                      value: 'mao',
                    },
                  ]"
                  placeholder="请选择管理员"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.approver" v-bind="validateInfos.approver">
                <a-select
                  v-model:value="formState.approver"
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao',
                    },
                    {
                      label: '周毛毛',
                      value: 'mao',
                    },
                  ]"
                  placeholder="请选择审批员"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.dateRange" v-bind="validateInfos.dateRange">
                <a-range-picker v-model:value="formState.dateRange" style="width: 100%" />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.type" v-bind="validateInfos.type">
                <a-select
                  v-model:value="formState.type"
                  :options="[
                    {
                      label: '私密',
                      value: 'private',
                    },
                    {
                      label: '公开',
                      value: 'public',
                    },
                  ]"
                  placeholder="请选择仓库类型"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <GProCard title="任务管理" header-bordered class="card" :body-style="{ width: '100%', display: 'block' }">
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.name2" v-bind="validateInfos.name2">
                <a-input v-model:value="formState.name2" placeholder="请输入任务名" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.url2" v-bind="validateInfos.url2">
                <a-input v-model:value="formState.url2" placeholder="请输入任务描述" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.owner2" v-bind="validateInfos.owner2">
                <a-select
                  v-model:value="formState.owner2"
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao',
                    },
                    {
                      label: '周毛毛',
                      value: 'mao',
                    },
                  ]"
                  placeholder="请选择执行人"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.approver2" v-bind="validateInfos.approver2">
                <a-select
                  v-model:value="formState.approver2"
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao',
                    },
                    {
                      label: '周毛毛',
                      value: 'mao',
                    },
                  ]"
                  placeholder="请选择责任人"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.dateTime" v-bind="validateInfos.dateTime">
                <a-time-picker
                  v-model:value="formState.dateTime"
                  style="width: 100%"
                  placeholder="提醒时间"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.type2" v-bind="validateInfos.type2">
                <a-select
                  v-model:value="formState.type2"
                  :options="[
                    {
                      label: '私密',
                      value: 'private',
                    },
                    {
                      label: '公开',
                      value: 'public',
                    },
                  ]"
                  placeholder="请选择仓库类型"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </GProCard>
        <GProCard title="成员管理" header-bordered class="card" :body-style="{ width: '100%', display: 'block' }">
          <g-pro-table ref="tableRef" v-bind="tableState">
            <template #bodyCell="{ column, record, text }: ProTableBodyCellProps<TableRecord<FormState>>">
              <template v-if="[ 'name', 'workId', 'department' ].includes(column.dataIndex as string)">
                <div>
                  <a-input
                    v-if="state.editableData[record.id]"
                    v-model:value="state.editableData[record.id][column.dataIndex]"
                    style="margin: -5px 0"
                    placeholder="请输入"
                  />
                  <template v-else>
                    {{ text || '-' }}
                  </template>
                </div>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <template v-if="state.editableData[record.id]">
                  <a-space align="center">
                    <a @click="handleSave(state.editableData[record.id])">保存</a>
                    <a-popconfirm title="确定要删除吗?" @confirm="handleDelete(record.id)">
                      <a>删除</a>
                    </a-popconfirm>
                    <a-popconfirm title="确定要取消吗?" @confirm="handleCancel(record.id)">
                      <a>取消</a>
                    </a-popconfirm>
                  </a-space>
                </template>
                <a v-else @click="handelEdit(record.id)">编辑</a>
              </template>
            </template>
          </g-pro-table>
          <a-button type="dashed" block class="mt-10px" @click="handelTableAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            添加一行数据
          </a-button>
        </GProCard>
      </div>
    </a-form>
    <template #footer>
      <div class="flex items-center h-64px">
        <div
          v-if="state.errorFields.length > 0 && state.errorFields.filter((item) => item.errors.length > 0).length > 0"
          class="errorIcon"
        >
          <a-popover
            title="表单校验信息"
            overlay-class-name="errorPopover"
            trigger="click"
            :get-popup-container="trigger => trigger?.parentNode as HTMLElement"
          >
            <template #content>
              <li
                v-for="err in state.errorFields"
                :key="err.name"
                class="errorListItem"
                @click="scrollToField(err.name)"
              >
                <close-circle-outlined class="errorIcon" :style="{ color: token.colorError }" />
                <div class="errorMessage">
                  {{ err.errors[0] }}
                </div>
                <div class="errorField">
                  {{ fieldLabels[err.name] }}
                </div>
              </li>
            </template>
            <div :style="{ color: token.colorError }">
              <close-circle-outlined />
              {{ state.errorFields.filter((item) => item.errors.length > 0).length }}
            </div>
          </a-popover>
        </div>
        <a-button class="mr-8px" @click="resetForm">
          重置
        </a-button>
        <a-button type="primary" @click="submitForm">
          提交
        </a-button>
      </div>
    </template>
  </g-pro-page-container>
</template>

<style lang="less">
.errorPopover {
  .ant-popover-inner-content {
    min-width: 256px;
    max-height: 290px;
    padding: 0;
    overflow: auto;
  }
}
</style>

<style lang="less" scoped>
@import "./style";
</style>
