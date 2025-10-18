<script setup lang="ts">
import type { ProTableBodyCellProps } from '@gx-design-vue/pro-table'
import type { SearchConfig } from './utils/columns'
import { treeData } from '@gx-design-vue/pro-utils'
import useProTable from '@/hooks/web/useProTable'
import { getRouters } from '@/services/systemCenter'
import { columns } from './utils/columns'

const state = reactive({
  menuTypeList: {
    M: '目录',
    F: '按钮',
    C: '菜单'
  }
})

const tableRef = ref()

const { tableState } = useProTable<SystemMenuItem, SearchConfig>(tableRef, {
  state: {
    columns,
    rowKey: 'menuId',
    rowSelection: undefined,
  },
  request: async () => {
    const response = await getRouters<SystemMenuItem[], { total: number }>()
    
    return {
      success: !!response,
      data: treeData(response.data || [], { id: 'menuId' }),
      total: response?.total || 0
    }
  }
})
</script>

<template>
  <g-pro-page-container>
    <g-pro-table v-bind="tableState" ref="tableRef">
      <template #bodyCell="{ column, text, record }: ProTableBodyCellProps<SystemMenuItem>">
        <template v-if="column.dataIndex === 'menuType'">
          {{ state.menuTypeList[text] || '-' }}
        </template>
        <template v-if="column.dataIndex === 'hidden'">
          {{ record.meta?.hidden ? '隐藏' : '显示' }}
        </template>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>
