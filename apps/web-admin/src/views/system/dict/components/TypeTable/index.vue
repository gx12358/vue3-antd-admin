<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemDictTypeApi } from '@/services/system/dict'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteDictTypeList, exportDictType, getDictTypePage } from '@/services/system/dict'
import { useDictContext } from '../../context'
import FormType from './components/Form/index.vue'
import { columns } from './utils/columns'

const { findDict, getDictTagStatus } = useDict(['common_status'])

const formTypeRef = useTemplateRef<InstanceType<typeof FormType>>('formTypeRef')

const { rowSelect } = useDictContext()

const [
  tableRef,
  { selectedKeys, tableState, updateSearchMap },
  actions
] = useProPageTable<SystemDictTypeApi.DictTypeTableRecord, SystemDictTypeApi.SearchConfig>({
  state: {
    headerTitle: '字典类型列表',
    columns,
    cardBordered: true,
    fitPage: true,
    rowKey: 'id',
    pagination: {
      pageSize: 20
    },
    form: {
      span: {
        xxl: 4,
        xl: 3,
        lg: 2,
        md: 1,
        sm: 1,
        xs: 1
      },
    },
    scroll: {
      x: 1100
    },
    searchMap: [
      {
        name: 'status',
        order: 3,
        loading: true,
        valueType: 'select',
        placeholder: '请选择状态'
      }
    ],
    rowSelection: {},
    customRow: (record) => {
      return {
        onClick: () => rowSelect.value = record
      }
    }
  },
  onSuccess: ({ list }) => {
    if (!rowSelect.value) rowSelect.value = list[0]
  },
  request: getDictTypePage,
  deleteProps: {
    requestFn: deleteDictTypeList
  }
})

useUpdateTableSearchMap<keyof SystemDictTypeApi.DictTypeTableRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增字典类型',
    type: 'create',
    auth: 'system:dict:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formTypeRef.value?.open()
  },
  {
    label: '导出',
    type: 'export',
    auth: 'system:dict:export',
    buttonProps: {
      type: 'primary'
    },
    onClick: async () => {
      try {
        const data = await exportDictType(actions.getForm())
        downloadFileFromBlobPart({ fileName: '角色数据.xls', source: data })
      } catch {}
    }
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:dict:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemDictTypeApi.DictTypeTableRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:dict:update',
      onClick: () => formTypeRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:dict:delete',
      onClick: () => actions.remove([ row.id ])
    },
  ]
}
</script>

<template>
  <FormType ref="formTypeRef" />
  <g-pro-table ref="tableRef" v-bind="tableState">
    <template #actions>
      <g-table-actions :actions="toolsActions" />
    </template>
    <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemDictTypeApi.DictTypeTableRecord>">
      <template v-if="column.dataIndex === 'name'">
        <div class="flex items-center gap-4px cursor-pointer" :class="rowSelect?.id === record.id ? 'text-success' : 'text-primary'">
          <check-circle-outlined v-if="rowSelect?.id === record.id" />
          <span>{{ record.name }}</span>
        </div>
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
</template>

<style scoped lang="less">
</style>
