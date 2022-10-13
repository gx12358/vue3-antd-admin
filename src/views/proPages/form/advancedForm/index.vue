<template>
  <g-pro-page-container>
    <div style="padding: 24px; background: #f0f2f5">
      <a-form
        :class="$style['advance-form-block']"
        :model="formState"
        layout="vertical"
        :scrollToFirstError="true"
      >
        <a-card title="仓库管理" :class="$style.card" :bordered="false">
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.name" v-bind="validateInfos.name">
                <a-input v-model:value="formState.name" placeholder="请输入仓库名称" allow-clear />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.url" v-bind="validateInfos.url">
                <a-input
                  style="width: 100%"
                  v-model:value="formState.url"
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
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao'
                    },
                    {
                      label: '周毛毛',
                      value: 'mao'
                    }
                  ]"
                  placeholder="请选择管理员"
                  v-model:value="formState.owner"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.approver" v-bind="validateInfos.approver">
                <a-select
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao'
                    },
                    {
                      label: '周毛毛',
                      value: 'mao'
                    }
                  ]"
                  placeholder="请选择审批员"
                  v-model:value="formState.approver"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.dateRange" v-bind="validateInfos.dateRange">
                <a-range-picker style="width: 100%" v-model:value="formState.dateRange" />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.type" v-bind="validateInfos.type">
                <a-select
                  :options="[
                    {
                      label: '私密',
                      value: 'private'
                    },
                    {
                      label: '公开',
                      value: 'public'
                    }
                  ]"
                  placeholder="请选择仓库类型"
                  v-model:value="formState.type"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card id="sdad" title="任务管理" :class="$style.card" :bordered="false">
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
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao'
                    },
                    {
                      label: '周毛毛',
                      value: 'mao'
                    }
                  ]"
                  placeholder="请选择执行人"
                  v-model:value="formState.owner2"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
          <a-row :gutter="16">
            <a-col :lg="6" :md="12" :sm="24">
              <a-form-item :label="fieldLabels.approver2" v-bind="validateInfos.approver2">
                <a-select
                  :options="[
                    {
                      label: '付晓晓',
                      value: 'xiao'
                    },
                    {
                      label: '周毛毛',
                      value: 'mao'
                    }
                  ]"
                  placeholder="请选择责任人"
                  v-model:value="formState.approver2"
                  allow-clear
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 6, offset: 2 }" :lg="{ span: 8 }" :md="{ span: 12 }" :sm="24">
              <a-form-item :label="fieldLabels.dateRange2" v-bind="validateInfos.dateRange2">
                <a-time-picker
                  style="width: 100%"
                  v-model:value="formState.dateRange2"
                  placeholder="提醒时间"
                />
              </a-form-item>
            </a-col>
            <a-col :xl="{ span: 8, offset: 2 }" :lg="{ span: 10 }" :md="{ span: 24 }" :sm="24">
              <a-form-item :label="fieldLabels.type2" v-bind="validateInfos.type2">
                <a-select
                  :options="[
                    {
                      label: '私密',
                      value: 'private'
                    },
                    {
                      label: '公开',
                      value: 'public'
                    }
                  ]"
                  placeholder="请选择仓库类型"
                  v-model:value="formState.type2"
                  allow-clear
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-card>
        <a-card title="成员管理" :bordered="false">
          <g-pro-table
            :columns="columns"
            :row-key="(record) => record.key"
            :loading="tableLoading"
            :dataSource="tableData"
            :pagination="pageConfig"
            @refresh="getTableData"
          >
            <template #bodyCell="{ column, record, text }">
              <template
                v-if="
                  column.dataIndex === 'name' ||
                  column.dataIndex === 'workId' ||
                  column.dataIndex === 'department'
                "
              >
                <div>
                  <a-input
                    v-if="editableData[record.key]"
                    v-model:value="editableData[record.key][column.dataIndex]"
                    style="margin: -5px 0"
                    placeholder="请输入"
                  />
                  <template v-else>
                    {{ text || '-' }}
                  </template>
                </div>
              </template>
              <template v-if="column.dataIndex === 'action'">
                <template v-if="editableData[record.key]">
                  <a-space align="center">
                    <a @click="handleSave(record.key)">保存</a>
                    <a-popconfirm title="确定要删除吗?" @confirm="handleDelete(record.key)">
                      <a>删除</a>
                    </a-popconfirm>
                    <a-popconfirm title="确定要取消吗?" @confirm="handleCancel(record.key)">
                      <a>取消</a>
                    </a-popconfirm>
                  </a-space>
                </template>
                <a v-else @click="handelEdit(record.key)">编辑</a>
              </template>
            </template>
          </g-pro-table>
          <a-button type="dashed" block @click="handelTableAdd">
            <template #icon>
              <PlusOutlined />
            </template>
            添加一行数据
          </a-button>
        </a-card>
      </a-form>
    </div>
    <div :class="$style['footer-bar']" style="width: calc(100% - 208px)">
      <div :class="$style['footer-bar-left']"></div>
      <div :class="$style['footer-bar-right']">
        <span
          v-if="
            errorFields.length > 0 &&
            errorFields.filter((item) => item.errors.length > 0).length > 0
          "
          :class="$style.errorIcon"
        >
          <Popover
            title="表单校验信息"
            :overlayClassName="$style.errorPopover"
            trigger="click"
            :getPopupContainer="
              (trigger) => {
                if (trigger && trigger.parentNode) {
                  return trigger.parentNode
                }
                return trigger
              }
            "
          >
            <template #content>
              <li
                v-for="err in errorFields"
                :key="err.name"
                :class="$style.errorListItem"
                @click="scrollToField(err.name)"
              >
                <CloseCircleOutlined :class="$style.errorIcon" />
                <div :class="$style.errorMessage">{{ err.errors[0] }}</div>
                <div :class="$style.errorField">{{ fieldLabels[err.name] }}</div>
              </li>
            </template>
            <CloseCircleOutlined />
            {{ errorFields.filter((item) => item.errors.length > 0).length }}
          </Popover>
        </span>
        <a-button @click="resetForm">重置</a-button>
        <a-button type="primary" @click="submitForm">提交</a-button>
      </div>
    </div>
    <g-back-top />
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, onActivated, computed } from 'vue'
import { useStore } from '@gx-vuex'
import { cloneDeep } from 'lodash-es'
import { Form, Popover } from 'ant-design-vue'
import { PlusOutlined, CloseCircleOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { getAdvancedForm, getAdvancedFormTable } from '@/services/form/advanced'
import { scrollTo } from '@gx-design/utils'
import { handleOffsetTop, hanndleField } from '@/utils/util'
import type { TableFormDateType } from './typings'
import columns from './utils/columns'
import { fieldLabels, rules } from './utils/config'

const { viewScrollRoot } = config.defaultSettings

interface advanceState {
  columns: any
  errorFields: ErrorField[]
  tableData: TableFormDateType[]
  addTableData: TableFormDateType[]
  editableData: TableFormDateType
  tableLoading: boolean
  errorVisible: boolean
  pageConfig: any
  fieldLabels: any
  formState: any
}

interface ErrorField {
  name: string
  errors: string[]
}

const useForm = Form.useForm

export default defineComponent({
  components: { PlusOutlined, CloseCircleOutlined, Popover },
  setup() {
    const store = useStore()
    const state: advanceState = reactive({
      columns: columns.index,
      tableData: [],
      addTableData: [],
      editableData: {},
      tableLoading: false,
      errorVisible: false,
      pageConfig: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      fieldLabels,
      errorFields: [],
      formState: {
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
      }
    })
    const rulesRef = reactive({ ...rules })
    const userInfo = computed(() => store.user.userInfo)
    onActivated(async () => {
      const response = await getAdvancedForm({
        userId: userInfo.value.userId
      })
      if (response) {
        const formState = cloneDeep(response.data || {})
        for (let i in state.formState) {
          switch (i) {
            case 'owner':
              state.formState[i] = formState[i] || undefined
              break
            case 'approver':
              state.formState[i] = formState[i] || undefined
              break
            case 'type':
              state.formState[i] = formState[i] || undefined
              break
            case 'dateRange':
              state.formState[i] = formState[i] || []
              break
            case 'owner2':
              state.formState[i] = formState[i] || undefined
              break
            case 'approver2':
              state.formState[i] = formState[i] || undefined
              break
            case 'dateRange2':
              state.formState[i] = formState[i] || null
              break
            case 'type2':
              state.formState[i] = formState[i] || undefined
              break
            default:
              state.formState[i] = hanndleField(formState[i], '').value
              break
          }
        }
      }
      getTableData()
    })
    const getTableData = async () => {
      state.tableLoading = true
      const response: any = await getAdvancedFormTable({
        userId: userInfo.value.userId,
        pageNum: state.pageConfig.current,
        pageSize: state.pageConfig.pageSize
      })
      if (response) {
        state.tableData = cloneDeep(response?.data || [])
        state.pageConfig.total = state.tableData.length
      }
      state.tableLoading = false
    }
    const { resetFields, validate, validateInfos } = useForm(state.formState, rulesRef)
    const handelEdit = (key) => {
      state.editableData[key] = cloneDeep(
        state.tableData.filter((item: any) => key === item.key)[0]
      )
    }
    const handelTableAdd = () => {
      const key = String(state.tableData.length + 1)
      const tableItem = {
        key: key,
        workId: '',
        name: '',
        department: ''
      }
      state.tableData.push(tableItem)
      state.addTableData.push(tableItem)
      state.editableData[key] = cloneDeep(
        state.tableData.filter((item: any) => key === item.key)[0]
      )
    }
    const handleSave = (key: string) => {
      Object.assign(
        state.tableData.filter((item: any) => key === item.key)[0],
        state.editableData[key]
      )
      delete state.editableData[key]
    }
    const handleCancel = (key: string) => {
      delete state.editableData[key]
    }
    const handleDelete = (key: string) => {
      delete state.editableData[key]
      state.tableData = state.tableData.filter((item: any) => key !== item.key)
      if (state.addTableData.some((item) => item.key === key)) {
        state.addTableData = state.addTableData.filter((item: any) => key !== item.key)
      }
    }
    const scrollToField = (fieldKey: string) => {
      const labelNode = document.documentElement.querySelector(
        `label[title="${state.fieldLabels[fieldKey]}"]`
      ) as HTMLInputElement
      if (labelNode) {
        scrollTo(handleOffsetTop(labelNode).top - 48 - 62, {
          getContainer: () => document.querySelector(viewScrollRoot) as HTMLInputElement,
          duration: 450
        })
      }
    }
    const submitForm = () => {
      validate()
        .then(() => {
          const parames = {
            ...state.formState,
            member: cloneDeep(state.tableData)
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
    return {
      ...toRefs(state),
      validateInfos,
      resetForm,
      handelEdit,
      handleSave,
      handleDelete,
      handleCancel,
      getTableData,
      submitForm,
      handelTableAdd,
      scrollToField
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
