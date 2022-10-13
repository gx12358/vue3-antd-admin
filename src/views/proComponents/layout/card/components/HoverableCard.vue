<template>
  <a-typography style="margin-top: 16px" id="hoverableCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 浮出效果 </a-typography-title>
  </a-typography>
  <div class="gx-markdown-demo">
    <g-pro-card hoverable bordered style="max-width: 300px"> 内容 </g-pro-card>
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
