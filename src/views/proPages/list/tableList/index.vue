<script setup lang="ts" name="TableList">
import type { RulesListItem } from '@gx-mock/routers/list/rule.fake'
import type { SorterResult } from 'ant-design-vue/es/table/interface'
import useProTable from '@/hooks/web/useProTable'
import { deleteRules, getRulesList } from '@/services/listCenter'
import { useMounted } from '@vueuse/core'
import { message } from 'ant-design-vue'
import OperateModal from './components/OperateModal.vue'
import PreviewDrawer from './components/PreviewDrawer.vue'
import { columns } from './utils/columns'

const isMounted = useMounted()

const operate = ref()
const preview = ref()
const tableRef = ref()

const { selectedKeys, setLoading, reload, tableState } = useProTable<RulesListItem>(tableRef, {
  state: {
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
  request: async (params, sorter: SorterResult) => {
    const response = await getRulesList<PageResult<RulesListItem>>({
      ...params,
      sortOrder: sorter?.order,
      sortField: sorter?.columnKey
    })
    
    return {
      success: !!response,
      total: response.data?.totalCount,
      data: response?.data?.list || []
    }
  }
})

onActivated(() => {
  reload?.()
})

const removeTableRule = async (id: number) => {
  setLoading(true)
  const response = await deleteRules({ id })
  if (response) {
    message.success('操作成功！')
    await reload({ immediate: true, removeKeys: [ id ] })
  }
  setLoading(false)
}
</script>

<template>
  <g-pro-page-container>
    <g-pro-table ref="tableRef" v-bind="tableState">
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'name'">
          规则名称
          <a-tooltip title="规则名称是唯一的 key">
            <info-circle-outlined />
          </a-tooltip>
        </template>
      </template>
      <template #optionsExtra>
        <a-button type="primary" @click="operate?.open('add')">
          <template #icon>
            <plus-outlined />
          </template>
          新建
        </a-button>
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<RulesListItem>">
        <template v-if="column.dataIndex === 'name'">
          <a v-if="record.name" @click="preview?.open(record)">{{ record.name }}</a>
          <template v-else>
            -
          </template>
        </template>
        <template v-if="column.dataIndex === 'callNo'">
          {{ record.callNo > 0 ? `${record.callNo}万` : record.callNo }}
        </template>
        <template v-if="column.dataIndex === 'status'">
          <a-badge v-if="record.status === '0'" status="default" text="关闭" />
          <a-badge v-if="record.status === '1'" status="processing" text="运行中" />
          <a-badge v-if="record.status === '2'" status="success" text="已上线" />
          <a-badge v-if="record.status === '3'" status="error" text="异常" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a key="config" class="mr-15px" @click="operate?.open('update', record)">配置</a>
          <a-popconfirm title="确定要删除吗?" @confirm="removeTableRule(record.id)">
            <a key="delete" class="mr-15px">删除</a>
          </a-popconfirm>
          <a key="subscribeAlert" href="https://procomponents.ant.design/" target="_blank">
            订阅警报
          </a>
        </template>
      </template>
    </g-pro-table>
    <Teleport v-if="isMounted && selectedKeys?.length" to=".gx-pro-table-list-toolbar">
      <div class="mb-16px px-24px py-12px bg-rgba-[0-0-0-0.02] rd-6px flex items-center justify-between">
        <div class="flex gap-8px text-rgba-[0-0-0-0.45]">
          <span>已选择</span>
          <span>{{ selectedKeys.length }}</span>
          <span>项</span>
        </div>
        <a @click="tableState.rowSelection && (tableState.rowSelection.selectedRowKeys = [])">取消选择</a>
      </div>
    </Teleport>
    <OperateModal ref="operate" @ok="reload" />
    <PreviewDrawer ref="preview" @update="state => operate?.open('update', state)" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>

</style>
