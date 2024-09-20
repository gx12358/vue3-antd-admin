<script setup lang="ts">
import type { AppRouteModule } from '@gx-design-vue/pro-layout'
import type { RequsetFunction } from '@gx-design-vue/pro-table'
import { getMenuList } from '@/services/systemCenter'
import { treeData } from '@gx-design-vue/pro-utils'
import { columns } from './utils/columns'

const state = reactive({
  menuTypeList: {
    M: '目录',
    F: '按钮',
    C: '菜单'
  }
})

const getTableData: RequsetFunction<AppRouteModule, { title: string }> = async () => {
  const response = await getMenuList<AppRouteModule[], { total: number }>()

  return {
    success: !!response,
    data: treeData(response.data || [], 'menuId') as AppRouteModule[],
    total: response?.total || 0
  }
}
</script>

<template>
  <g-pro-page-container>
    <g-pro-table
      draggabled
      row-key="menuId"
      :options="false"
      :show-index="false"
      :columns="columns"
      :request="getTableData"
    >
      <template #bodyCell="{ column, text, record }: { column: ProColumnType; text: string; record: AppRouteModule }">
        <template v-if="column.dataIndex === 'menuType'">
          {{ state.menuTypeList[text] || '-' }}
        </template>
        <template v-if="column.dataIndex === 'hidden'">
          {{ record.hidden ? '隐藏' : '显示' }}
        </template>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>
