<template>
  <a-typography style="margin-top: 16px" id="proCardTabs">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> ProCardTabs </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="parameter"
    :dataSource="proCardTabsData"
    row-key="attributes"
  >
    <template #headerTitle>
      更多属性见 antd&nbsp;&nbsp;
      <a target="_blank" href="https://2x.antdv.com/components/tabs-cn"> Tab </a>
      &nbsp;&nbsp;API 描述。
    </template>
  </g-pro-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { parameter } from '../utils/columns'
import { proCardTabsData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      parameter,
      proCardTabsData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
