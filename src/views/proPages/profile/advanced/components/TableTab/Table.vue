<script setup lang="ts">
import type { ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { AdvancedTableRecord } from '@gx-mock/datasSource/profile/advanced'
import type { ListSearchParams } from '@gx-mock/util/table'
import type { TabPaneStateRecord, TabsStateActiveKey } from './utile/config'
import { useTable } from '@gx-design-vue/pro-table'
import { useAdvancedContext } from '../../context'
import { columns, defaultTableState, statusState } from './utile/config'

const props = withDefaults(defineProps<{
  type: TabsStateActiveKey;
  request: TabPaneStateRecord['request']
}>(), {
  type: 'table1' as TabsStateActiveKey,
  request: undefined
})

const { showTableLoading } = useAdvancedContext()

const tableRef = ref<ProTableRef>()

const { reload } = useTable(tableRef)

const getTableData: RequsetFunction<AdvancedTableRecord, ListSearchParams> = async (params) => {
  const response = await props.request<PageResult<AdvancedTableRecord>>?.(params)

  return {
    success: !!response,
    data: response?.data?.list || [],
    total: response?.data?.totalCount || 0
  }
}

defineExpose({
  reload
})
</script>

<template>
  <g-pro-table ref="tableRef" :request="getTableData" :columns="columns" :show-loading="showTableLoading" v-bind="defaultTableState">
    <template #bodyCell="{ column, text }">
      <template v-if="column.dataIndex === 'status'">
        <a-badge :status="statusState[text as AdvancedTableRecord['status']].status" :text="statusState[text as AdvancedTableRecord['status']].text" />
      </template>
    </template>
  </g-pro-table>
</template>

<style scoped lang="less">

</style>
