<script lang="ts" setup>
import type { AnalysisOverviewItem } from '../typing'
import { useEchart } from '@gx/hooks'

defineOptions({
  name: 'Radar'
})

const props = defineProps<{
  data: Record<string, AnalysisOverviewItem[]>
}>()

const radarMap = {
  personal: '个人',
  team: '团队',
  dept: '部门'
}

const colors = [ '#217afd', '#e48146', '#41bfc2' ]

watch(() => props.data, (val) => {
  if (val) {
    const indicator = val.personal ? val.personal.map(item => ({ name: item.name })) : []
    useEchart('radar-container', {
      legend: {
        bottom: 0,
        data: Object.values(radarMap).map((name, index) => ({
          name,
          itemStyle: {
            color: colors[index]
          }
        }))
      },
      radar: {
        indicator,
        radius: '60%',
        shape: 'circle',
        splitNumber: 8,
      },
      series: [
        {
          type: 'radar',
          symbolSize: 0,
          lineStyle: {
            width: 0
          },
          data: Object.keys(radarMap).map((item, index) => {
            return {
              name: radarMap[item],
              value: val[item] ? val[item].map(item => item.value) : [],
              areaStyle: {
                color: colors[index],
              }
            }
          })
        }
      ]
    })
  }
}, { immediate: true, deep: true })
</script>

<template>
  <div id="radar-container" style="width: 100%; min-height: 400px" />
</template>
