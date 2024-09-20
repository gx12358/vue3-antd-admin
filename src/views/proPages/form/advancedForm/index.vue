<script setup lang="ts">
import type { ProTableProps, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { TableRecord } from '@gx-mock/datasSource/form/advanced'
import {
  addAdvancedFormTable,
  deleteAdvancedFormTable,
  getAdvancedForm,
  getAdvancedFormTable,
  updateAdvancedFormTable
} from '@/services/formCenter'
import { handleOffsetTop } from '@/utils/util'
import { useRequest } from '@gx-admin/hooks/core'
import { useForm } from '@gx-admin/hooks/system'
import { defaultSettings } from '@gx-config'
import { GProCard } from '@gx-design-vue/pro-card'
import { useProConfigContext } from '@gx-design-vue/pro-provider'
import { useTable } from '@gx-design-vue/pro-table'
import { hanndleField, scrollTo } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { cloneDeep, omit } from 'lodash-es'
import { columns } from './utils/columns'
import { fieldLabels, rules } from './utils/config'

const { viewScrollRoot } = defaultSettings

interface ErrorField {
  name: string
  errors: string[]
}

interface FormState {
  name: string;
  url: string;
  owner?: any;
  approver?: any;
  dateRange: any;
  type?: any;
  name2: string;
  url2: string;
  owner2?: any;
  approver2?: any;
  dateRange2?: any;
  type2?: any;
}

const { user } = useStore()
const { token } = useProConfigContext()

const isMount = ref<boolean>(false)
const tableRef = ref<ProTableRef>()

const { dataSource, changeDataValue, reload, changeLoading } = useTable<TableRecord>(tableRef)

const state = reactive({
  editableData: {} as TableRecord,
  errorFields: [] as ErrorField[]
})
const tableState = reactive<ProTableProps>({
  bordered: false,
  options: false,
  showLoading: false,
  rowKey: 'id',
  showIndex: false,
  pagination: false
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
  dateRange2: null,
  type2: undefined
})

const rulesRef = reactive({ ...rules })

const { validate, validateInfos, resetFields } = useForm<FormState>(formState, rulesRef)

const { loading } = useRequest(getAdvancedForm, {
  params: {
    userId: user.userInfo.userId
  },
  onSuccess: (data) => {
    tableState.showLoading = true
    for (const i in formState) {
      switch (i) {
        case 'owner':
          formState[i] = data[i] || undefined
          break
        case 'approver':
          formState[i] = data[i] || undefined
          break
        case 'type':
          formState[i] = data[i] || undefined
          break
        case 'dateRange':
          formState[i] = data[i] || []
          break
        case 'owner2':
          formState[i] = data[i] || undefined
          break
        case 'approver2':
          formState[i] = data[i] || undefined
          break
        case 'dateRange2':
          formState[i] = data[i] || null
          break
        case 'type2':
          formState[i] = data[i] || undefined
          break
        default:
          formState[i] = hanndleField(data[i], '').value
          break
      }
    }
  }
})

onMounted(() => {
  isMount.value = true
})

const getTabelData: RequsetFunction<TableRecord> = async (params) => {
  const response = await getAdvancedFormTable<PageResult<TableRecord>>(params)
  return {
    success: !!response,
    total: response.data?.totalCount || 0,
    data: response?.data?.list || []
  }
}

const handelEdit = (key) => {
  state.editableData[key] = cloneDeep(dataSource.value.find(item => key === item.id))
}

const handleSave = async (record: TableRecord) => {
  const response = await record.isMock
    ? addAdvancedFormTable(omit(record, [ 'isMock', 'isUpdate' ]))
    : updateAdvancedFormTable(omit(record, [ 'isMock', 'isUpdate' ]))
  if (response) {
    message.success('操作成功')
    await reload({ immediate: true })
    delete state.editableData[record.id]
  }
}

const handleCancel = (key: number) => {
  delete state.editableData[key]
}

const handleDelete = async (key: number) => {
  if (state.editableData[key]?.isMock) {
    changeDataValue({ key: 'id', type: 'delete', params: { id: key } })
    delete state.editableData[key]
  } else {
    changeLoading(true)
    const response = await deleteAdvancedFormTable({ id: key })
    if (response) {
      message.success('操作成功')
      await reload({ immediate: true })
      delete state.editableData[key]
    }
    changeLoading(false)
  }
}

const handelTableAdd = () => {
  const key = dataSource.value.length + 1
  changeDataValue({
    key: 'id',
    params: {
      id: key,
      workId: '',
      name: '',
      department: '',
      isMock: true,
      createTime: dayjs().format('YYYY-MM-DD HH:mm:ss')
    },
    type: 'add'
  })
  nextTick(() => {
    state.editableData[key] = cloneDeep(dataSource.value.find(item => key === item.id))
  })
}

const scrollToField = (fieldKey: string) => {
  const labelNode = document.documentElement.querySelector(
    `label[title="${fieldLabels[fieldKey]}"]`
  ) as HTMLInputElement
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
      const parames = {
        ...formState,
        member: cloneDeep(dataSource.value)
      }
      console.log(parames)
    })
    .catch(({ errorFields }) => {
      state.errorFields = errorFields
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
        <GProCard title="仓库管理" header-bordered class="card" :body-style="{ width: '100%', display: 'block' }">
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
        </GProCard>
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
              <a-form-item :label="fieldLabels.dateRange2" v-bind="validateInfos.dateRange2">
                <a-time-picker
                  v-model:value="formState.dateRange2"
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
          <g-pro-table ref="tableRef" v-bind="tableState" :request="getTabelData" :columns="columns">
            <template #bodyCell="{ column, record, text }: { column: ProColumnType, record: TableRecord, text: string }">
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
    <Teleport v-if="isMount" to=".ant-layout-has-sider>.ant-layout">
      <div class="mt-32px h-49px" />
    </Teleport>
    <Teleport to="body">
      <div class="footer-bar">
        <div class="flex items-center">
          <span
            v-if="
              state.errorFields.length > 0 && state.errorFields.filter((item) => item.errors.length > 0).length > 0
            "
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
                  <div class="errorMessage">{{ err.errors[0] }}</div>
                  <div class="errorField">{{ fieldLabels[err.name] }}</div>
                </li>
              </template>
              <div :style="{ color: token.colorError }">
                <close-circle-outlined />
                {{ state.errorFields.filter((item) => item.errors.length > 0).length }}
              </div>
            </a-popover>
          </span>
          <a-button class="mr-8px" @click="resetForm">
            重置
          </a-button>
          <a-button type="primary" @click="submitForm">
            提交
          </a-button>
        </div>
      </div>
    </Teleport>
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
