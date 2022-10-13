<template>
  <a-typography style="margin-top: 16px" id="headerDivider">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 标题带分割线 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    当添加分隔线时会自动增加标题的高度与内容区域分开。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card
      title="标题"
      extra="extra"
      tooltipText="这是提示"
      style="max-width: 300px"
      headerBordered
    >
      内容
    </g-pro-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>

<style lang="less" module></style>
