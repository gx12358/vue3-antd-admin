<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import { cloneDeep, treeData } from '@gx-design-vue/pro-utils'
import { useDict } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteMenu, getMenuList } from '@/services/system/menu'
import Form from './components/Form/index.vue'
import MenuIcon from './components/MenuIcon'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict([ 'common_status', 'system_menu_type' ])

const menus = ref<SystemMenuItem[]>([])
const expand = ref(false)

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const [
  tableRef,
  { tableState, reload },
  actions
] = useProPageTable<SystemMenuItem, any>({
  state: {
    headerTitle: '菜单列表',
    columns,
    expandedRowKeys: [],
    cardBordered: true,
    fitPage: true,
    rowKey: 'id',
    pagination: false,
    postData: (data) => {
      menus.value = cloneDeep(data)
      const treeList = treeData(cloneDeep(data || []), {
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
  onSuccess: ({ list }) => {
    if (tableState.expandedRowKeys?.length === 0) onExpand(list)
  },
  request: getMenuList,
  deleteProps: {
    requestFn: deleteMenu
  }
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增菜单',
    type: 'create',
    auth: 'system:menu:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
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

function renderActions(row: SystemMenuItem) {
  return [
    {
      label: '新增下级',
      type: 'create',
      auth: 'system:menu:create',
      onClick: () => formRef.value?.open({ parentId: row.id })
    },
    {
      label: '编辑',
      type: 'update',
      auth: 'system:menu:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:menu:delete',
      onClick: () => actions.remove(row.id)
    }
  ]
}

function onExpand(list?: SystemMenuItem[]) {
  tableState.expandedRowKeys = expand.value ? (list || menus.value).map(item => item.id) : []
}
</script>

<template>
  <g-pro-page-container height="fit" :use-page-card="false">
    <Form ref="formRef" @ok="reload" />
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #actions>
        <g-table-actions :actions="toolsActions" />
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemMenuItem>">
        <template v-if="column.dataIndex === 'name'">
          <div class="flex items-center gap-4px">
            <MenuIcon :class-names="{ icon: 'text-16px' }" :src="record.icon" />
            <span>{{ record.name }}</span>
          </div>
        </template>
        <template v-if="column.dataIndex === 'type'">
          <a-tag>{{ findDict('system_menu_type', record.type)?.label }}</a-tag>
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
