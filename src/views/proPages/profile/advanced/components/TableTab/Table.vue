<script setup lang="ts">
import type { ProTableRef } from '@gx-design-vue/pro-table'
import type { AdvancedTableRecord } from '@gx-mock/routers/profile/advanced.fake'
import type { ListSearchParams } from '@gx-mock/utils/table'
import type { TabPaneStateRecord, TabsStateActiveKey } from './utile/config'
import useProTabel from '@/hooks/web/useProTabel'
import { useAdvancedContext } from '../../context'
import { columns, statusState } from './utile/config'

const props = withDefaults(defineProps<{
  type: TabsStateActiveKey;
  request: TabPaneStateRecord['request']
}>(), {
  type: 'table1' as TabsStateActiveKey,
  request: undefined
})

const { showTableLoading } = useAdvancedContext()

const tableRef = ref<ProTableRef>()

const { reload, tableState } = useProTabel<AdvancedTableRecord, ListSearchParams>(tableRef, {
  state: {
    columns,
    pagination: { pageSize: 5 }
  },
  request: async (params) => {
    const response = await props.request<PageResult<AdvancedTableRecord>>?.(params)
    
    return {
      success: !!response,
      data: response?.data?.list || [],
      total: response?.data?.totalCount || 0
    }
  }
})

defineExpose({
  reload
})
</script>

<template>
  <g-pro-table ref="tableRef" v-bind="tableState" :show-loading="showTableLoading">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'status'">
        <a-badge :status="statusState[text as AdvancedTableRecord['status']].status" :text="statusState[text as AdvancedTableRecord['status']].text" />
      </template>
    </template>
  </g-pro-table>
</template>

<style scoped lang="less">

</style>
