<script setup lang="ts">
import type { BasicOption } from '@gx/types'
import type { AnalysisOverviewItem } from './typing'
import {
  GCountToAnimator,
  GIconIfy,
  SvgBellIcon,
  SvgCakeIcon,
  SvgCardIcon,
  SvgDownloadIcon
} from '@gx/design'
import AnalysisChartsTabs from './components/analysis-charts-tabs.vue'
import AnalyticsTrends from './components/analytics-trends.vue'
import AnalyticsVisitsData from './components/analytics-visits-data.vue'
import AnalyticsVisitsSales from './components/analytics-visits-sales.vue'
import AnalyticsVisitsSource from './components/analytics-visits-source.vue'
import AnalyticsVisits from './components/analytics-visits.vue'

const overviewItems: AnalysisOverviewItem[] = [
  {
    icon: SvgCardIcon,
    title: '用户量',
    totalTitle: '总用户量',
    totalValue: 120_000,
    value: 2000,
  },
  {
    icon: SvgCakeIcon,
    title: '访问量',
    totalTitle: '总访问量',
    totalValue: 500_000,
    value: 20_000,
  },
  {
    icon: SvgDownloadIcon,
    title: '下载量',
    totalTitle: '总下载量',
    totalValue: 120_000,
    value: 8000,
  },
  {
    icon: SvgBellIcon,
    title: '使用量',
    totalTitle: '总使用量',
    totalValue: 50_000,
    value: 5000,
  },
]

const chartTabs: BasicOption[] = [
  {
    label: '流量趋势',
    value: 'trends',
  },
  {
    label: '月访问量',
    value: 'visits',
  },
]
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <a-card v-for="(item, index) in overviewItems" :key="index" :title="item.title">
        <div class="pb-6 flex items-center justify-between">
          <GCountToAnimator
            :end-val="item.value"
            :start-val="1"
            class="text-xl"
            prefix=""
          />
          <GIconIfy :icon="item.icon" class="size-8 flex-shrink-0" />
        </div>
        <div class="flex items-center justify-between">
          <span>{{ item.totalTitle }}</span>
          <GCountToAnimator
            :end-val="item.totalValue"
            :start-val="1"
            prefix=""
          />
        </div>
      </a-card>
    </div>
    <AnalysisChartsTabs :tabs="chartTabs" class="mt-5">
      <template #trends>
        <AnalyticsTrends />
      </template>
      <template #visits>
        <AnalyticsVisits />
      </template>
    </AnalysisChartsTabs>

    <div class="mt-5 w-full md:flex">
      <a-card class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问数量">
        <AnalyticsVisitsData />
      </a-card>
      <a-card class="mt-5 md:mr-4 md:mt-0 md:w-1/3" title="访问来源">
        <AnalyticsVisitsSource />
      </a-card>
      <a-card class="mt-5 md:mt-0 md:w-1/3" title="访问来源">
        <AnalyticsVisitsSales />
      </a-card>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
&:deep(.ant-card-head-title) {
  --at-apply: text-xl font-600 tracking-tight;
}

&:deep(.ant-card-head) {
  --at-apply: border-0;
}
</style>
