<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemDeptApi } from '@/services/system/dept'
import type { SystemUserApi } from '@/services/system/user'
import { cloneDeep, treeData } from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { useDict } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteDeptList, getDeptList } from '@/services/system/dept'
import { getSimpleUserList } from '@/services/system/user'
import Form from './components/Form/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict([ 'common_status', 'system_menu_type' ])

const { data: userList } = useRequest<SystemUserApi.UserTableRecord[]>(getSimpleUserList, {
  defaultData: []
})

const expand = ref(true)
const depts = ref<SystemDeptApi.Dept[]>([])

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const [
  tableRef,
  { tableState, selectedKeys, reload },
  actions
] = useProPageTable<SystemDeptApi.Dept, any>({
  state: {
    headerTitle: '部门列表',
    columns,
    rowSelection: {},
    expandedRowKeys: [],
    cardBordered: true,
    fitPage: true,
    rowKey: 'id',
    pagination: false,
    postData: (data) => {
      depts.value = cloneDeep(data)
      const treeList = treeData(data || [], {
        emptyChildren: false,
        children: 'children',
      })
      return treeList
    },
    onExpand: (expanded, record) => {
      tableState.expandedRowKeys = tableState.expandedRowKeys ?? []
      if (expanded) {
        tableState.expandedRowKeys.push(record.id)
      } else {
        tableState.expandedRowKeys = tableState.expandedRowKeys.filter(item => item !== record.id)
      }
    }
  },
  onSuccess: ({ list }) => onExpand(list),
  request: getDeptList,
  deleteProps: {
    requestFn: deleteDeptList
  }
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增部门',
    type: 'create',
    auth: 'system:dept:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:dept:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  },
  {
    label: expand.value ? '收起' : '展开',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => {
      expand.value = !expand.value
      nextTick(onExpand)
    }
  }
])

function renderActions(row: SystemDeptApi.Dept) {
  return [
    {
      label: '新增下级',
      type: 'create',
      auth: 'system:dept:create',
      onClick: () => formRef.value?.open({ parentId: row.id })
    },
    {
      label: '编辑',
      type: 'update',
      auth: 'system:dept:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:dept:delete',
      onClick: () => actions.remove([ row.id ])
    }
  ]
}

function onExpand(list?: SystemDeptApi.Dept[]) {
  tableState.expandedRowKeys = expand.value ? (list || depts.value).map(item => item.id) : []
}
</script>

<template>
  <g-pro-page-container height="fit" :use-page-card="false">
    <Form ref="formRef" @ok="reload" />
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #actions>
        <g-table-actions :actions="toolsActions" />
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemDeptApi.Dept>">
        <template v-if="column.dataIndex === 'leaderUserId'">
          {{ userList.find(item => item.id === record.leaderUserId)?.nickname || '-' }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-tag :color="getDictTagStatus('common_status', `${record.status}`)">
            {{ findDict('common_status', `${record.status}`)?.label }}
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
