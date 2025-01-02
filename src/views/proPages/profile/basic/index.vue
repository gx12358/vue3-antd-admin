<script setup lang="ts">
import type {
  BasicDetails,
  CommodityRecord,
  ScheduleRecord
} from '@gx-mock/routers/profile/basic.fake'
import useProTabel from '@/hooks/web/useProTabel'
import { getBasic, getBasicTable } from '@/services/profileCenter'
import { useRequest } from '@gx-admin/hooks/core'
import dayjs from 'dayjs'
import { goodsColumns, scheduleColumns } from './utils/columns'
import { defaultSTableState, descriptionsState, statusState } from './utils/config'

const { data: basicData, loading } = useRequest<Partial<BasicDetails>>(getBasic, {
  defaultData: {}
})

const scheduleRef = ref()
const commodityRef = ref()

const commodityState = useProTabel<Partial<CommodityRecord>>(commodityRef, {
  state: {
    ...defaultSTableState as any,
    headerTitle: '退货商品',
    loading: true,
    dataSource: []
  }
})

const scheduleState = useProTabel<Partial<ScheduleRecord>>(scheduleRef, {
  state: {
    ...defaultSTableState as any,
    headerTitle: '退货进度',
    dataSource: [],
    loading: true,
    columns: scheduleColumns
  }
})

const { loading: tableLoading } = useRequest<{
  schedule: ScheduleRecord[];
  commodity: CommodityRecord[];
}>(getBasicTable, {
  onSuccess: (data) => {
    const { schedule, commodity } = data
    scheduleState.tableState.loading = false
    scheduleState.tableState.dataSource = schedule
    commodityState.tableState.loading = false
    commodityState.tableState.dataSource = commodity
    
    if (commodity.length) {
      let num = 0
      let amount = 0
      commodityState.tableState.dataSource.forEach((item) => {
        num += Number(item.num)
        amount += Number(item.amount)
      })
      commodityState.tableState.dataSource = commodityState.tableState.dataSource.concat({
        key: '总计',
        num,
        amount
      } as Partial<CommodityRecord>)
    }
  }
})

const commodityColumns = computed(() => {
  return [
    {
      title: '商品编号',
      dataIndex: 'key',
      key: 'key',
      customCell: (_, rowIndex) => {
        if (rowIndex && rowIndex >= scheduleState.tableState.dataSource?.length)
          return { colSpan: 4 }
      }
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      customCell: renderContent
    },
    {
      title: '商品条码',
      dataIndex: 'barcode',
      key: 'barcode',
      customCell: renderContent
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      customCell: renderContent
    },
    ...goodsColumns
  ] as ProColumnsType<Partial<CommodityRecord>>
})

function renderContent(_, rowIndex: number) {
  if (rowIndex === scheduleState.tableState.dataSource.length) {
    return { colSpan: 0 }
  }
}
</script>

<template>
  <g-pro-page-container :loading="loading && tableLoading">
    <template v-for="item in descriptionsState" :key="item.name">
      <a-descriptions :title="item.name" class="mb-32px">
        <a-descriptions-item v-for="el in Object.keys(item.data)" :key="el" :label="item.data[el]">
          <template v-if="el === 'status'">
            {{ statusState[(basicData as any)[el]] }}
          </template>
          <template v-else>
            {{ basicData[el] }}
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider class="mb-32px" />
    </template>
    <g-pro-table ref="commodityRef" v-bind="commodityState.tableState" :columns="commodityColumns" class="mb-32px">
      <template #bodyCell="{ column, text, index }: ProTableBodyCellProps<CommodityRecord>">
        <template v-if="column.dataIndex === 'key' || column.dataIndex === 'num' || column.dataIndex === 'amount'">
          <span :style="{ fontWeight: index < (commodityState.tableState.dataSource.length - 1) ? undefined : 600 }">
            {{ text }}
          </span>
        </template>
      </template>
    </g-pro-table>
    <g-pro-table ref="scheduleRef" v-bind="scheduleState.tableState">
      <template #bodyCell="{ column, text, record }: { column: ProColumnType; text: string; record: ScheduleRecord; }">
        <template v-if="column.dataIndex === 'status'">
          <a-badge :status="text === 'success' ? 'success' : 'processing'" :text="text === 'success' ? '成功' : '进行中'" />
        </template>
        <template v-if="column.dataIndex === 'cost'">
          {{ dayjs(record.time).fromNow() }}
        </template>
      </template>
    </g-pro-table>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
&:deep(.ant-descriptions-item-label) {
  color: rgba(0, 0, 0, 0.45)
}
</style>
