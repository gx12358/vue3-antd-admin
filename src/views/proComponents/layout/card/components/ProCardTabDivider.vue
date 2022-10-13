<template>
  <a-typography style="margin-top: 16px" id="proCardTabDivider">
    <a-typography-title :level="4" :style="{ color: '#454d64' }">
      ProCard.Divider
    </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    headerTitle="用于在将内容进行分组时进行分隔。"
    :columns="parameter"
    :dataSource="proCardTabDividerData"
    row-key="attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { parameter } from '../utils/columns'
import { proCardTabDividerData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      parameter,
      proCardTabDividerData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
