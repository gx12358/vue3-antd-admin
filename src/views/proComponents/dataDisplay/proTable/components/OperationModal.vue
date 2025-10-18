<script setup lang="ts">
import type { MockTableRecord, SearchParams } from '../typings'
import { useProTable } from '@gx-admin/hooks/web'
import { deepCopy } from '@gx-design-vue/pro-utils'
import { reactive, ref } from 'vue'
import { useDict, useUpdateTableSearch } from '@/hooks/system'
import { getTableList } from '@/services/tableCenter'
import { operationModal } from '../utils/columns'

const { getDict } = useDict('sys_common_status')

const tableRef = ref()
const visible = ref(false)
const isFail = ref(false)
const spinning = ref(false)
const waitRequest = ref(true)
const skeletonLoading = ref(false)

const params = reactive({
  adress: '',
  age: ''
})

const { tableState, updateSearchMap } = useProTable<TableRecord<MockTableRecord>, SearchParams>(tableRef, {
  state: {
    rowKey: 'id',
    options: false,
    modalScroll: true,
    searchMap: [
      {
        name: 'status',
        valueType: 'select',
        placeholder: '请选择操作状态',
        loading: false,
        initialValue: '0',
        valueEnum: []
      },
      {
        name: 'date',
        valueType: 'date',
        placeholder: '请选择'
      }
    ],
    columns: operationModal
  },
  request: async (params) => {
    const response = await getTableList<PageResult<TableRecord<MockTableRecord>>>(params)
    return {
      data: deepCopy(response?.data?.list || []),
      success: !!response,
      total: response.data?.totalCount || 0
    }
  }
})

useUpdateTableSearch('sys_common_status', {
  key: 'status',
  callback: updateSearchMap
})

const resetModalState = () => {
  visible.value = false
  isFail.value = false
  spinning.value = false
  skeletonLoading.value = false
}

const open = () => {
  getDict(true)
  visible.value = true
  setTimeout(() => {
    waitRequest.value = false
  }, 200)
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
      v-bind="tableState"
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
