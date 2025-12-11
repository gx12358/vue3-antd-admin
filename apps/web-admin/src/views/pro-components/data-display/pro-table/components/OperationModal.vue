<script setup lang="ts">
import type { MockTableRecord, SearchConfig } from '@/services/demo/table'
import { reactive, ref } from 'vue'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { getList } from '@/services/demo'
import { operationModal } from '../utils/columns'

const { getDict } = useDict('common_status')

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

const [
  { tableState, updateSearchMap }
] = useProPageTable<TableRecord<MockTableRecord>, SearchConfig>(tableRef, {
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
        order: 2,
        initialValue: '0',
        valueEnum: []
      },
      {
        name: 'date',
        valueType: 'date',
        order: 3,
        placeholder: '请选择'
      }
    ],
    columns: operationModal
  },
  request: getList
})

useUpdateTableSearchMap('common_status', {
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
      <template #bodyCell="{ column }: ProTableBodyCellProps<MockTableRecord>">
        <template v-if="column.dataIndex === 'action'">
          <div class="flex items-center gap-16px">
            <a>编辑</a>
            <span class="text-btn-error">删除</span>
          </div>
        </template>
      </template>
    </g-pro-table>
  </g-pro-modal>
</template>
