<script lang="ts" setup>
import { useEchart } from '@gx/hooks'

defineOptions({
  name: 'Radar'
})

const props = withDefaults(defineProps<{
  data?: any[]
  max?: number
}>(), {
  data: () => {
    return []
  },
  max: 10
})

watch(() => props.data, (val) => {
  if (val.length) {
    let indicator = val[0]?.label || []
    indicator = indicator.map((item: string) => {
      return {
        name: item,
      }
    })
    useEchart('radar-container', {
      legend: {
        bottom: 0,
        data: [ '个人', '团队', '部门' ]
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
          data: props.data.map((item) => {
            return {
              ...item,
              areaStyle: {}
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
