<template>
  <a-typography style="margin-top: 16px" id="hideTitleCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 无标题 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px"> 头部没有内容时会自动隐藏。 </div>
  <div class="gx-markdown-demo">
    <g-pro-card style="max-width: 300px"> 内容 </g-pro-card>
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
