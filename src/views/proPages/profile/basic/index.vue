<script setup lang="ts">
import type { ProTableProps } from '@gx-design-vue/pro-table'
import type {
  BasicDetails,
  CommodityRecord,
  ScheduleRecord
} from '@gx-mock/datasSource/profile/basic'
import { getBasic, getBasicTable } from '@/services/profileCenter'
import { useRequest } from '@gx-admin/hooks/core'
import dayjs from 'dayjs'
import { goodsColumns, scheduleColumns } from './utils/columns'
import { defaultSTableState, descriptionsState, statusState } from './utils/config'

const { data: basicData, loading } = useRequest<Partial<BasicDetails>>(getBasic, {
  defaultData: {}
})

const commodityState = reactive<ProTableProps<Partial<CommodityRecord>>>({
  ...defaultSTableState,
  headerTitle: '退货商品',
  loading: true,
  dataSource: []
})

const scheduleState = reactive<ProTableProps<Partial<ScheduleRecord>>>({
  ...defaultSTableState,
  headerTitle: '退货进度',
  dataSource: [],
  loading: true,
  columns: scheduleColumns
})

const { loading: tableLoading } = useRequest<{
  schedule: ScheduleRecord[];
  commodity: CommodityRecord[];
}>(getBasicTable, {
  onSuccess: (data) => {
    const { schedule, commodity } = data
    scheduleState.loading = false
    scheduleState.dataSource = schedule
    commodityState.loading = false
    commodityState.dataSource = commodity

    if (commodity.length) {
      let num = 0
      let amount = 0
      commodityState.dataSource.forEach((item) => {
        num += Number(item.num)
        amount += Number(item.amount)
      })
      commodityState.dataSource = commodityState.dataSource.concat({
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
        if (rowIndex >= scheduleState.dataSource.length)
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
  ] as ProColumnType[]
})

function renderContent(_, rowIndex) {
  if (rowIndex === scheduleState.dataSource.length) {
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
            {{ statusState[basicData[el]] }}
          </template>
          <template v-else>
            {{ basicData[el] }}
          </template>
        </a-descriptions-item>
      </a-descriptions>
      <a-divider class="mb-32px" />
    </template>
    <g-pro-table v-bind="commodityState" :columns="commodityColumns" class="mb-32px">
      <template #bodyCell="{ column, text, index }: { column: ProColumnType; text: string; index: number; }">
        <template v-if="column.dataIndex === 'key' || column.dataIndex === 'num' || column.dataIndex === 'amount'">
          <span :style="{ fontWeight: index < (commodityState.dataSource.length - 1) ? undefined : 600 }">
            {{ text }}
          </span>
        </template>
      </template>
    </g-pro-table>
    <g-pro-table v-bind="scheduleState">
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
