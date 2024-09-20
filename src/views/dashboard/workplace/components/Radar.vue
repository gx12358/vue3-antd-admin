<script lang="ts">
import * as echarts from 'echarts'
import { defineComponent, watch } from 'vue'

export default defineComponent({
  name: 'Radar',
  props: {
    data: {
      type: Array as VuePropType<any[]>,
      default: () => {
        return []
      }
    },
    max: {
      type: Number,
      default: 10
    }
  },
  setup(props) {
    const initRadar = (indicator) => {
      const chartDom = document.getElementById('radar-container')
      const myChart = echarts.init(chartDom)
      const option = {
        legend: {
          data: ['个人', '团队', '部门']
        },
        radar: {
          indicator
        },
        series: [
          {
            type: 'radar',
            data: props.data
          }
        ]
      }

      option && myChart.setOption(option)
    }
    watch(
      () => props.data,
      (val) => {
        let indicator = val[0]?.label || []
        indicator = indicator.map((item: string) => {
          return {
            name: item,
            max: props.max
          }
        })
        setTimeout(() => {
          indicator && indicator.length > 0 && initRadar(indicator)
        }, 200)
      },
      {
        deep: true,
        immediate: true
      }
    )
  }
})
</script>

<template>
  <div id="radar-container" style="width: 100%; min-height: 400px" />
</template>
