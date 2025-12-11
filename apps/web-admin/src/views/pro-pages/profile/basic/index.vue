<script setup lang="ts">
import type { BasicGood, BasicProgress } from './typings'
import { cloneDeep } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'
import { useProTable } from '@/hooks/web'
import { goodsColumns, progressColumns } from './utils/columns'
import { basicDetails, basicGoods, basicProgress, descriptionsState } from './utils/config'

const goodTable = ref()
const progressTable = ref()
const basicGoodsList = ref<BasicGood[]>([])

const goodTableState = useProTable<BasicGood>(goodTable, {
  state: {
    rowKey: 'id',
    headerTitle: '退货商品',
    pagination: false,
    options: false,
  },
  request: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        let num = 0
        let amount = 0
        let goodsData: any[] = []
        basicGoodsList.value = cloneDeep(basicGoods)
        basicGoods.forEach((item) => {
          num += Number(item.num)
          amount += Number(item.amount)
        })
        goodsData = basicGoods.concat({
          id: '总计',
          num,
          amount,
        } as any)
        resolve({
          data: goodsData,
          success: true
        })
      }, 200)
    })
  }
})

const progressTableState = useProTable<BasicProgress>(progressTable, {
  state: {
    rowKey: 'id',
    headerTitle: '退货进度',
    columns: progressColumns,
    pagination: false,
    options: false,
  },
  request: () => {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: basicProgress,
          success: true
        })
      }, 200)
    })
  }
})

const goodColumns = computed(() => {
  return [
    {
      title: '商品编号',
      dataIndex: 'id',
      key: 'id',
      customCell: (_, index) => {
        if (index === basicGoodsList.value.length) {
          return { colSpan: 4 }
        }
      },
    },
    {
      title: '商品名称',
      dataIndex: 'name',
      key: 'name',
      customCell: renderContent,
    },
    {
      title: '商品条码',
      dataIndex: 'barcode',
      key: 'barcode',
      customCell: renderContent,
    },
    {
      title: '单价',
      dataIndex: 'price',
      key: 'price',
      align: 'right',
      customCell: renderContent,
    },
    ...goodsColumns
  ] as ProColumnsType<BasicProgress>
})

function renderContent(_, rowIndex: number) {
  if (rowIndex === basicGoodsList.value.length) {
    return { colSpan: 0 }
  }
}
</script>

<template>
  <g-pro-page-container>
    <template v-for="item in descriptionsState" :key="item.name">
      <a-descriptions :title="item.name" class="mb-32px">
        <a-descriptions-item v-for="el in Object.keys(item.data)" :key="el" :label="item.data[el]">
          {{ basicDetails[el] }}
        </a-descriptions-item>
      </a-descriptions>
      <a-divider class="mb-32px" />
    </template>
    <g-pro-table ref="goodTable" v-bind="goodTableState.tableState" :columns="goodColumns" class="mb-32px">
      <template #bodyCell="{ column, text, index }: ProTableBodyCellProps<BasicGood>">
        <template v-if="column.dataIndex === 'num' || column.dataIndex === 'amount'">
          <span :style="{ fontWeight: index < basicGoodsList.length ? undefined : 600 }">
            {{ text }}
          </span>
        </template>
        <template v-if="column.dataIndex === 'id'">
          <span>{{ index < basicGoodsList.length ? text : '总计' }}</span>
        </template>
      </template>
    </g-pro-table>
    <g-pro-table ref="progressTable" v-bind="progressTableState.tableState">
      <template #bodyCell="{ column, text, record }: ProTableBodyCellProps<BasicProgress>">
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
</style>
