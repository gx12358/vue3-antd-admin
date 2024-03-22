<template>
  <div style="width: 100%; min-height: 400px" id="radar-container"></div>
</template>

<script lang="ts">
import { defineComponent, watch } from 'vue'
import * as echarts from 'echarts'

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
      var chartDom = document.getElementById('radar-container')
      var myChart = echarts.init(chartDom)
      var option

      option = {
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
