<template>
  <g-pro-page-container :contentStyle="{ position: 'relative' }">
    <g-doc ref="doc" :anchorLinks="config.anchorLinks">
      <a-typography id="g-pro-table">
        <a-typography-title :level="2" :style="{ color: '#454d64' }">
          ProTable - 高级表格
        </a-typography-title>
      </a-typography>
      <ProTable />
      <ProTableApi @targetTo="targetTo" />
      <ProTableSearch @targetTo="targetTo" />
      <ProTableColums />
    </g-doc>
    <g-back-top />
  </g-pro-page-container>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ProTable from './components/ProTable/index.vue'
import ProTableApi from './components/ProTableApi.vue'
import ProTableSearch from './components/ProTableSearch.vue'
import ProTableColums from './components/ProTableColums.vue'
import config from './utils/config'

const doc = ref()

const targetTo = (selector) => {
  console.log(selector)
  doc.value?.anchor?.goAnchor(selector)
}
</script>
