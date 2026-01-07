<script setup lang="ts">
import type { TabPaneStateRecord, TabsStateActiveKey } from './utile/config'
import type { MockTableRecord } from '@/services/demo/table'
import { useProPageTable } from '@/hooks/web'
import { columns, statusState } from './utile/config'

const props = withDefaults(defineProps<{
  type?: TabsStateActiveKey;
  request?: TabPaneStateRecord['request']
}>(), {
  type: 'table1' as TabsStateActiveKey,
  request: undefined
})

const [
  tableRef,
  { reload, tableState }
] = useProPageTable<MockTableRecord>({
  state: computed(() => {
    return {
      columns,
      params: {
        type: props.type
      },
      pagination: { pageSize: 5 }
    }
  }),
  request: props.request as any
})

defineExpose({
  reload
})
</script>

<template>
  <g-pro-table ref="tableRef" v-bind="tableState">
    <template #bodyCell="{ record, column }: ProTableBodyCellProps<MockTableRecord>">
      <template v-if="column.dataIndex === 'status'">
        <a-badge :status="record.status" :text="statusState[record.status as any]" />
      </template>
    </template>
  </g-pro-table>
</template>

<style scoped lang="less">

</style>
