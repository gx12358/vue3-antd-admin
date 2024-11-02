<script setup lang="ts">
import type { ProSearchMap } from '@gx-design-vue/pro-table'
import type { TableRecord } from '@gx-mock/datasSource/table'
import type { SearchParams } from '../typings'
import { getTableList } from '@/services/tableCenter'
import { useDict } from '@gx-admin/hooks/system'
import { useTable } from '@gx-design-vue/pro-table'
import { deepCopy } from '@gx-design-vue/pro-utils'
import { reactive, ref, watch } from 'vue'
import { operationModal } from '../utils/columns'

const [ dictState, getDict ] = useDict('sys_common_status')

const tableRef = ref()
const visible = ref(false)
const isFail = ref(false)
const spinning = ref(false)
const waitRequest = ref(true)
const skeletonLoading = ref(false)
const searchMap = ref<ProSearchMap[]>([
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
])

const params = reactive({
  adress: '',
  age: ''
})

const { tableState } = useTable<TableRecord, SearchParams>(tableRef, {
  state: {
    options: false,
    modalScroll: true,
    columns: operationModal
  },
  request: async (params) => {
    const response = await getTableList<PageResult<TableRecord>>(params)
    return {
      data: deepCopy(response?.data?.list || []),
      success: !!response,
      total: response.data?.totalCount || 0
    }
  }
})

watch(
  () => dictState.value.sys_common_status,
  (val) => {
    if (searchMap.value) {
      const loading = val.loading
      searchMap.value[0].loading = loading
      searchMap.value[0].valueEnum = loading ? [] : val.data.map((item) => {
        return {
          text: item.dictLabel,
          value: item.dictValue
        }
      })
    }
  },
  {
    deep: true,
    immediate: true
  }
)

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
      :search-map="searchMap"
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
