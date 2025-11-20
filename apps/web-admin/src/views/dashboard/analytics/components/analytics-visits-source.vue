<script lang="ts" setup>
import { useEchart } from '@gx/hooks'

useEchart('analytics-visits-source', {
  legend: {
    bottom: '2%',
    left: 'center',
  },
  series: [
    {
      animationDelay() {
        return Math.random() * 100
      },
      animationEasing: 'exponentialInOut',
      animationType: 'scale',
      avoidLabelOverlap: false,
      color: ['#5ab1ef', '#b6a2de', '#67e0e3', '#2ec7c9'],
      data: [
        { name: '搜索引擎', value: 1048 },
        { name: '直接访问', value: 735 },
        { name: '邮件营销', value: 580 },
        { name: '联盟广告', value: 484 },
      ],
      emphasis: {
        label: {
          fontSize: '12',
          fontWeight: 'bold',
          show: true,
        },
      },
      itemStyle: {
        // borderColor: '#fff',
        borderRadius: 10,
        borderWidth: 2,
      },
      label: {
        position: 'center',
        show: false,
      },
      labelLine: {
        show: false,
      },
      name: '访问来源',
      radius: ['40%', '65%'],
      type: 'pie',
    },
  ],
  tooltip: {
    trigger: 'item',
  },
})
</script>

<template>
  <div id="analytics-visits-source" class="w-full h-300px" />
</template>
