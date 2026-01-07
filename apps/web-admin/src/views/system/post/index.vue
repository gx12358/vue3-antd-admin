<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemPostApi } from '@/services/system/post'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deletePostList, exportPost, getPostPage } from '@/services/system/post'
import Form from './components/Form/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict(['common_status'])

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const [
  tableRef,
  { selectedKeys, tableState, reload, updateSearchMap },
  actions
] = useProPageTable<SystemPostApi.PostTableRecord, SystemPostApi.SearchConfig>({
  state: {
    headerTitle: '岗位列表',
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
        placeholder: '请选择岗位状态'
      }
    ],
    rowSelection: {}
  },
  request: getPostPage,
  deleteProps: {
    requestFn: deletePostList
  }
})

useUpdateTableSearchMap<keyof SystemPostApi.PostTableRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增岗位',
    type: 'create',
    auth: 'system:post:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formRef.value?.open()
  },
  {
    label: '导出',
    type: 'export',
    auth: 'system:post:export',
    buttonProps: {
      type: 'primary'
    },
    onClick: async () => {
      try {
        const data = await exportPost(actions.getForm())
        downloadFileFromBlobPart({ fileName: '岗位数据.xls', source: data })
      } catch {}
    }
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:post:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemPostApi.PostTableRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:post:update',
      onClick: () => formRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:post:delete',
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
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemPostApi.PostTableRecord>">
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
