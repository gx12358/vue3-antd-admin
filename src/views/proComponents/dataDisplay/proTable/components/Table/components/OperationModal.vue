<script setup lang="ts">
import type { ProSearchMap, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { TableRecord } from '@gx-mock/datasSource/table'
import { getTableList } from '@/services/tableCenter'
import { deepCopy } from '@gx-design-vue/pro-utils'
import { reactive, ref } from 'vue'
import columns from '../utils/columns'

const store = useStore()

const tableRef = ref<ProTableRef>()
const visible = ref(false)
const isFail = ref(false)
const spinning = ref(false)
const waitRequest = ref(true)
const skeletonLoading = ref(false)
const tableData = ref<TableRecord[]>([])
const searchMap = ref<ProSearchMap[]>([
  {
    name: 'status',
    valueType: 'select',
    placeholder: '请选择操作状态',
    loading: true,
    valueEnum: []
  },
  {
    name: 'date',
    valueType: 'date',
    placeholder: '请选择'
  }
])

const params = reactive({
  adress: '',
  age: ''
})

const getTableData: RequsetFunction<TableRecord> = async (params) => {
  const response = await getTableList<PageResult<TableRecord>>(params)
  tableData.value = deepCopy(response?.data?.list || [])
  return {
    data: deepCopy(response?.data?.list || []),
    success: !!response,
    total: response.data?.totalCount || 0
  }
}

const resetModalState = () => {
  visible.value = false
  isFail.value = false
  spinning.value = false
  skeletonLoading.value = false
}

const open = (type: string) => {
  visible.value = true
  searchMap.value[0].loading = true
  searchMap.value[0].valueEnum = store.dict.data[type].map((item) => {
    return {
      text: item.dictLabel,
      value: item.dictValue
    }
  })
  searchMap.value[0]['initialValue'] = '0'
  searchMap.value[0].loading = false
  setTimeout(() => {
    waitRequest.value = false
  }, 500)
}

const onReset = () => {
  params.age = ''
  params.adress = ''
}

const handleSubmit = () => {
  resetModalState()
}

const handleCancel = () => {
  resetModalState()
}

defineExpose({
  open
})
</script>

<template>
  <g-pro-modal
    title="ModalTable"
    type="normal"
    :width="900"
    :is-fail="isFail"
    :open="visible"
    :spinning="spinning"
    :skeleton-loading="skeletonLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <g-pro-table
      ref="tableRef"
      align="center"
      :options="false"
      modal-scroll
      :search-map="searchMap"
      :wait-request="waitRequest"
      :columns="columns.operationModal"
      :request="getTableData"
      @reset="onReset"
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'name'">
          FullName
        </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          这是高级列表的FullName的字段（测试溢出展示）：{{ record.title }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="flex gap-20px items-center justify-center">
            <a>编辑</a>
            <a>删除</a>
          </div>
        </template>
      </template>
    </g-pro-table>
  </g-pro-modal>
</template>
