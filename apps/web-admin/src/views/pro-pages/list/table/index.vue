<script setup lang="ts" name="TableList">
import type { MockTableRecord } from '@/services/demo/table'
import { setAlpha, useProConfigContext } from '@gx-design-vue/pro-provider'
import { useProPageTable } from '@/hooks/web'
import { deleteList, getList } from '@/services/demo'
import OperateModal from './components/OperateModal.vue'
import PreviewDrawer from './components/PreviewDrawer.vue'
import { columns } from './utils/columns'

const { token } = useProConfigContext()

const operate = ref()
const preview = ref()

const [
  tableRef,
  { selectedKeys, reload, tableState },
  actions
] = useProPageTable<MockTableRecord>({
  state: {
    fitPage: true,
    headerTitle: '查询表格',
    columns,
    rowKey: 'id',
    pagination: {
      pageSize: 20
    },
    rowSelection: {
      selectedRowKeys: []
    }
  },
  request: getList,
  onBefore: ({ sorter }) => {
    return {
      sortOrders: sorter.map(item => item.order).join(),
      sortFields: sorter.map(item => item.columnKey).join(),
    }
  },
  deleteProps: {
    requestFn: deleteList
  }
})

onActivated(() => {
  reload?.()
})
</script>

<template>
  <g-pro-page-container height="fit">
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #actions>
        <a-button type="primary" @click="operate?.open('add')">
          <template #icon>
            <plus-outlined />
          </template>
          新建
        </a-button>
      </template>
      <template v-if="selectedKeys.length" #listToolAfter>
        <div
          class="px-24px py-12px rd-6px flex items-center justify-between"
          :style="{ background: setAlpha(token.colorTextBase, 0.2) }"
        >
          <div class="flex gap-8px text-tertiary">
            <span>已选择</span>
            <span>{{ selectedKeys.length }}</span>
            <span>项</span>
          </div>
          <a class="text-tertiary" @click="tableState.rowSelection && (tableState.rowSelection.selectedRowKeys = [])">取消选择</a>
        </div>
      </template>
      <template #headerCell="{ column }: ProTableBodyCellProps<MockTableRecord>">
        <template v-if="column.dataIndex === 'name'">
          规则名称
          <a-tooltip title="规则名称是唯一的 key">
            <info-circle-outlined />
          </a-tooltip>
        </template>
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<MockTableRecord>">
        <template v-if="column.dataIndex === 'name'">
          <a v-if="record.name" @click="preview?.open(record)">{{ record.name }}</a>
          <template v-else>
            -
          </template>
        </template>
        <template v-if="column.dataIndex === 'callNo'">
          {{ record.callNo && record.callNo > 0 ? `${record.callNo}万` : record.callNo }}
        </template>
        <template v-if="column.dataIndex === 'status1'">
          <a-badge v-if="record.status1 === 0" status="default" text="关闭" />
          <a-badge v-if="record.status1 === 1" status="processing" text="运行中" />
          <a-badge v-if="record.status1 === 2" status="success" text="已上线" />
          <a-badge v-if="record.status1 === 3" status="error" text="异常" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <div class="gx-pro-actions">
            <div key="config" class="gx-pro-actions-item" @click="operate?.open('update', record)">
              配置
            </div>
            <a-popconfirm title="确定要删除吗?" @confirm="actions.remove([record.id])">
              <div key="delete" class="gx-pro-actions-item danger">
                删除
              </div>
            </a-popconfirm>
            <a key="subscribeAlert" class="gx-pro-actions-item" href="https://procomponents.ant.design/" target="_blank">
              订阅警报
            </a>
          </div>
        </template>
      </template>
    </g-pro-table>
    <OperateModal ref="operate" @ok="reload" />
    <PreviewDrawer ref="preview" @update="state => operate?.open('update', state)" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
</style>
