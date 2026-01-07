<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemTenantPackageApi } from '@/services/system/tenant-package'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteTenantPackageList, getTenantPackagePage } from '@/services/system/tenant-package'
import Form from './components/Form/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict(['common_status'])

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const [
  tableRef,
  { selectedKeys, tableState, reload, updateSearchMap },
  actions
] = useProPageTable<SystemTenantPackageApi.TenantPackageTable, SystemTenantPackageApi.SearchConfig>({
  state: {
    headerTitle: '租户套餐列表',
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
  request: getTenantPackagePage,
  deleteProps: {
    requestFn: deleteTenantPackageList
  }
})

useUpdateTableSearchMap<keyof SystemTenantPackageApi.TenantPackageTable>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增套餐',
    type: 'create',
    auth: 'system:tenant-package:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:tenant-package:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemTenantPackageApi.TenantPackageTable) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:tenant-package:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:tenant-package:delete',
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
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemTenantPackageApi.TenantPackageTable>">
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
