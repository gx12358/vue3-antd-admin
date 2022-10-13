<template>
  <a-typography id="watermark-api" style="margin-top: 15px">
    <a-typography-title :level="2" :style="{ color: '#454d64' }"> API </a-typography-title>
  </a-typography>
  <a-typography id="watermark-basic-api">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64"
      >基础参数
    </a-typography-title>
  </a-typography>
  <g-pro-table
    style="margin-top: 15px"
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="parameter"
    :dataSource="parameterData"
    row-key="attributes"
  />
  <a-typography id="watermark-high-api" style="margin-top: 15px">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64">
      高级参数
    </a-typography-title>
  </a-typography>
  <g-pro-table
    style="margin-top: 15px"
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="parameter"
    :dataSource="parameterLevelData"
    row-key="attributes"
  />
  <a-typography id="watermark-visualization-api" style="margin-top: 15px">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64"
      >水印 API 可视化
    </a-typography-title>
  </a-typography>
  <img
    style="width: 100%"
    src="https://gw.alipayobjects.com/zos/alicdn/joeXYy8j3/jieping2021-01-11%252520xiawu4.47.15.png"
  />
</template>

<script lang="js">
import { defineComponent, reactive, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  setup() {
    const state = reactive({
      parameter: columns.parameter,
      parameterData: config.parameterData,
      parameterLevelData: config.parameterLevelData
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>
