<script setup lang="ts">
import ProTable from './components/Table/index.vue'
</script>

<template>
  <g-pro-page-container :content-style="{ position: 'relative' }">
    <a-typography id="g-pro-table">
      <a-typography-title :level="2" :style="{ color: '#454d64' }">
        ProTable - 高级表格
      </a-typography-title>
    </a-typography>
    <ProTable />
  </g-pro-page-container>
</template>
