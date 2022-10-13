<template>
  <a-typography style="margin-top: 16px" id="gridCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 栅格布局 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    当嵌套子卡片时, 组件会自动切换为
    <span class="gx-markdown-code">flex</span>
    弹性盒布局，你可以将
    <span class="gx-markdown-code">direction</span>
    设置为
    <span class="gx-markdown-code">column</span>
    来指定 Flex 方向，你还可以通过配置
    <span class="gx-markdown-code">ghost</span>
    属性为
    <span class="gx-markdown-code">true</span>
    来去掉背景色和 padding 方便页内布局。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card direction="column" ghost :gutter="[0, 8]">
      <g-pro-card layout="center" bordered> colSpan - 24 </g-pro-card>
      <g-pro-card :colSpan="12" layout="center" bordered> colSpan - 12 </g-pro-card>
      <g-pro-card :colSpan="8" layout="center" bordered> colSpan - 8 </g-pro-card>
      <g-pro-card :colSpan="0" layout="center" bordered> colSpan - 0 </g-pro-card>
    </g-pro-card>
    <g-pro-card title="24栅格" :gutter="8" style="margin-top: 8px">
      <g-pro-card :colSpan="12" layout="center" bordered> colSpan - 12 </g-pro-card>
      <g-pro-card :colSpan="6" layout="center" bordered> colSpan - 6 </g-pro-card>
      <g-pro-card :colSpan="6" layout="center" bordered> colSpan - 6 </g-pro-card>
    </g-pro-card>
    <g-pro-card ghost :gutter="8" style="margin-top: 8px">
      <g-pro-card colSpan="200px" layout="center" bordered> colSpan - 200px </g-pro-card>
      <g-pro-card layout="center" bordered> Auto </g-pro-card>
    </g-pro-card>
    <g-pro-card ghost :gutter="8" style="margin-top: 8px">
      <g-pro-card layout="center" bordered> Auto </g-pro-card>
      <g-pro-card colSpan="30%" bordered> colSpan - 30% </g-pro-card>
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
