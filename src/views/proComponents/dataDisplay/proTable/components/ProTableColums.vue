<template>
  <a-typography id="columns-api" style="margin-top: 12px">
    <a-typography-title style="margin-top: 12px" :level="3" :style="{ color: '#454d64' }">
      Columns 列定义（继承antd属性，这里列举新增的属性）
    </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="columnsConfig"
    :dataSource="columnsTableData"
    row-key="attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      columnsConfig: columns.columnsConfig,
      columnsTableData: config.columnsTableData
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style scoped></style>
