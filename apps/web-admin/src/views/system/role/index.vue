<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemRoleApi } from '@/services/system/role'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteRoleList, exportRole, getRolePage } from '@/services/system/role'
import DataForm from './components/DataForm/index.vue'
import Form from './components/Form/index.vue'
import MenuForm from './components/MenuForm/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict(['common_status', 'system_role_type', 'system_data_scope'])

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const dataFormRef = useTemplateRef<InstanceType<typeof DataForm>>('dataFormRef')
const menuFormRef = useTemplateRef<InstanceType<typeof MenuForm>>('menuFormRef')

const [
  tableRef,
  { selectedKeys, tableState, reload, updateSearchMap },
  actions
] = useProPageTable<SystemRoleApi.RoleTableRecord, SystemRoleApi.SearchConfig>({
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
        order: 3,
        loading: true,
        valueType: 'select',
        placeholder: '请选择角色状态'
      }
    ],
    rowSelection: {}
  },
  request: getRolePage,
  deleteProps: {
    requestFn: deleteRoleList
  }
})

useUpdateTableSearchMap<keyof SystemRoleApi.RoleTableRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增角色',
    type: 'create',
    auth: 'system:role:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
  },
  {
    label: '导出',
    type: 'export',
    auth: 'system:role:export',
    buttonProps: {
      type: 'primary'
    },
    onClick: async () => {
      try {
        const data = await exportRole(actions.getForm())
        downloadFileFromBlobPart({ fileName: '角色数据.xls', source: data })
      } catch {}
    }
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:role:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemRoleApi.RoleTableRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:role:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:role:delete',
      onClick: () => actions.remove([ row.id ])
    },
    {
      label: '更多',
      children: [
        {
          label: '数据权限',
          auth: 'system:permission:assign-role-data-scope',
          onClick: () => dataFormRef.value?.open(row)
        },
        {
          label: '菜单权限',
          auth: 'system:permission:assign-role-menu',
          onClick: () => menuFormRef.value?.open(row)
        }
      ]
    }
  ]
}
</script>

<template>
  <g-pro-page-container height="fit" :use-page-card="false">
    <Form ref="formRef" @ok="reload" />
    <DataForm ref="dataFormRef" @ok="reload" />
    <MenuForm ref="menuFormRef" @ok="reload" />
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #actions>
        <g-table-actions :actions="toolsActions" />
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemRoleApi.RoleTableRecord>">
        <template v-if="column.dataIndex === 'type'">
          <a-tag :color="getDictTagStatus('system_role_type', record.type)">
            {{ findDict('system_role_type', record.type)?.label }}
          </a-tag>
        </template>
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
