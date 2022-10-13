<template>
  <a-typography style="margin-top: 16px" id="basicApi">
    <a-typography-title :level="2" :style="{ color: '#454d64' }"> API </a-typography-title>
  </a-typography>
  <g-pro-table
    style="margin-top: 15px"
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="parameter"
    :dataSource="basicData"
    row-key="attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { parameter } from '../utils/columns'
import { basicData } from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      parameter,
      basicData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
