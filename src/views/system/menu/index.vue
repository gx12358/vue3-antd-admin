<template>
  <g-pro-page-container>
    <g-pro-table
      row-key="menuId"
      draggabled
      :showIndex="false"
      :columns="columns"
      :data-source="tableData"
      :pagination="pagination"
      :loading="loading"
    >
      <template #bodyCell="{ column, text }">
        <template v-if="column.dataIndex === 'menuType'">
          {{ menuTypeList[text] || '-' }}
        </template>
        <template v-if="column.dataIndex === 'visible'">
          {{ text === '0' ? '显示' : '隐藏' }}
        </template>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>
<script lang="ts">
import { defineComponent, reactive, toRefs, onMounted } from 'vue'
import { getRouterList } from '@/services/controller/router'
import { treeData } from '@/utils/util'
import columns from './utils/columns'

export default defineComponent({
  setup() {
    const state = reactive({
      tableData: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0
      },
      total: 0,
      loading: false,
      columns: columns.index,
      menuTypeList: {
        M: '目录',
        F: '按钮',
        C: '菜单'
      }
    })
    const getTableData = async () => {
      const response: any = await getRouterList()
      if (response && response.code === 200) {
        const tableData = treeData(response.data || [], 'menuId')
        state.tableData = tableData
        state.total = response.total || 0
      }
    }
    onMounted(() => {
      getTableData()
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
