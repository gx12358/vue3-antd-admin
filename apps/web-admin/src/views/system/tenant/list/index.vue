<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemTenantApi } from '@/services/system/tenant'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteTenantList, exportTenant, getTenantPage } from '@/services/system/tenant'
import Form from './components/Form/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict(['common_status'])

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const [
  tableRef,
  { selectedKeys, tableState, reload, updateSearchMap },
  actions
] = useProPageTable<SystemTenantApi.TenantTableRecord, SystemTenantApi.SearchConfig>({
  state: {
    headerTitle: '角色列表',
    columns,
    cardBordered: true,
    fitPage: true,
    rowKey: 'id',
    pagination: {
      pageSize: 20
    },
    searchMap: [
      {
        name: 'status',
        order: 4,
        loading: true,
        valueType: 'select',
        placeholder: '请选择状态'
      }
    ],
    rowSelection: {}
  },
  request: getTenantPage,
  deleteProps: {
    requestFn: deleteTenantList
  }
})

useUpdateTableSearchMap<keyof SystemTenantApi.TenantTableRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增租户',
    type: 'create',
    auth: 'system:tenant:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
  },
  {
    label: '导出',
    type: 'export',
    auth: 'system:tenant:export',
    buttonProps: {
      type: 'primary'
    },
    onClick: async () => {
      try {
        const data = await exportTenant(actions.getForm())
        downloadFileFromBlobPart({ fileName: '租户数据.xls', source: data })
      } catch {}
    }
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:tenant:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemTenantApi.TenantTableRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:tenant:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:tenant:delete',
      onClick: () => actions.remove([ row.id ])
    },
  ]
}
</script>

<template>
  <g-pro-page-container height="fit" :use-page-card="false">
    <Form ref="formRef" @ok="reload" />
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #actions>
        <g-table-actions :actions="toolsActions" />
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemTenantApi.TenantTableRecord>">
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getDictTagStatus('common_status', record.status)">
            {{ findDict('common_status', record.status)?.label }}
          </a-tag>
        </template>
        <template v-if="column.dataIndex === 'action'">
          <g-table-actions :actions="renderActions(record)" />
        </template>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>

<style scoped lang="less">
</style>
