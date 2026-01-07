<script setup lang="ts">
import type { SearchConfig } from './utils/columns'
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemDictTypeApi } from '@/services/system/dict'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useRequest } from '@gx/hooks'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteDictDataList, exportDictData, getDictDataPage, getSimpleDictTypeList } from '@/services/system/dict'
import { useDictContext } from '../../context'
import FormData from './components/Form/index.vue'
import { columns } from './utils/columns'

const { rowSelect } = useDictContext()
const { findDict, getDictTagStatus } = useDict(['common_status'])

const { data: dictTypeList } = useRequest<SystemDictTypeApi.DictTypeTableRecord[]>(getSimpleDictTypeList, {
  defaultData: []
})

const formDataRef = useTemplateRef<InstanceType<typeof FormData>>('formDataRef')

const [
  tableRef,
  { selectedKeys, tableState, updateSearchMap, reload },
  actions
] = useProPageTable<DictRecord, SearchConfig>({
  state: {
    columns,
    cardBordered: true,
    fitPage: true,
    waitRequest: true,
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
    rowSelection: {}
  },
  request: getDictDataPage,
  deleteProps: {
    requestFn: deleteDictDataList
  }
})

useUpdateTableSearchMap<keyof DictRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

watchEffect(() => {
  if (rowSelect.value) {
    tableState.params.dictType = rowSelect.value.type
    tableState.waitRequest = false
    tableState.headerTitle = `${rowSelect.value.name} - 字典数据列表`
  }
})

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增字典数据',
    type: 'create',
    auth: 'system:dict:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => formDataRef.value?.open({ dictType: rowSelect.value?.type as DictType })
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
        const data = await exportDictData(actions.getForm())
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

function renderActions(row: DictRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:dict:update',
      onClick: () => formDataRef.value?.open(row)
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:dict:delete',
      onClick: () => actions.remove([ row.id ])
    },
  ]
}

function onChangeType(value) {
  rowSelect.value = dictTypeList.value.find(item => item.type === value)
}
</script>

<template>
  <FormData ref="formDataRef" @ok="reload" />
  <g-pro-table ref="tableRef" v-bind="tableState">
    <template #actions>
      <g-table-actions :actions="toolsActions" />
    </template>
    <template #form>
      <a-select v-model:value="tableState.params.dictType" order="1" style="width: 100%;" @change="onChangeType">
        <a-select-option v-for="item in dictTypeList" :key="item.id" :value="item.type">
          {{ item.name }}
        </a-select-option>
      </a-select>
    </template>
    <template #bodyCell="{ column, record }: ProTableBodyCellProps<DictRecord>">
      <template v-if="column.dataIndex === 'colorType'">
        <a-tag v-if="record.colorType" :color="record.colorType ?? 'default'">
          {{ record.colorType }}
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
</template>

<style scoped lang="less">
</style>
