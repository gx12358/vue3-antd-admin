<template>
  <a-typography style="margin-top: 16px" id="columnsCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 左右分栏 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    通过卡片切分能力我们很容易实现左右分栏的效果，很适合左侧是列表，右侧是详情的结构。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card split="vertical">
      <g-pro-card title="左侧详情" colSpan="30%"> 左侧内容 </g-pro-card>
      <g-pro-card title="左右分栏子卡片带标题" headerBordered>
        <div style="height: 360px">右侧内容</div>
      </g-pro-card>
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
