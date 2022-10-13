<template>
  <a-typography style="margin-top: 16px" id="borderedCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 带边框 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    配置
    <span class="gx-markdown-code">bordered</span>
    属性控制是否卡片带边框。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card title="标题" extra="extra" tooltipText="这是提示" style="max-width: 300px" bordered>
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
