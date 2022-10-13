<template>
  <a-typography id="g-pro-skeleton-descriptions" style="margin-top: 15px">
    <a-typography-title :level="3" :style="{ color: '#454d64' }">详情页</a-typography-title>
  </a-typography>
  <div
    style="
      padding: 40px 20px;
      background-color: #ffffff;
      border: 1px solid #ebedf1;
      border-radius: 1px;
    "
  >
    <div style="padding: 24px; background: #ffffff">
      <div style="padding: 24px; background: rgb(250, 250, 250)">
        <g-pro-skeleton type="descriptions" />
      </div>
    </div>
  </div>
  <a-typography id="w-pro-skeleton-api" style="margin-top: 30px">
    <a-typography-title :level="2" :style="{ color: '#454d64' }">API</a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="proSkelecton"
    :dataSource="proSkelectonData"
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
      proSkelecton: columns.proSkelecton,
      proSkelectonData: config.proSkelectonData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
