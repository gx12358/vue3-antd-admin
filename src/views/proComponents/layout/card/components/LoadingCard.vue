<template>
  <a-typography style="margin-top: 16px" id="loadingCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 加载中 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    配置
    <span class="gx-markdown-code">loading</span>
    属性为
    <span class="gx-markdown-code">true</span>
    控制卡片加载中，也可以传入 DOM 给
    <span class="gx-markdown-code">loading</span>
    来自定义 loading 展示。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card loading style="max-width: 300px"> 内容 </g-pro-card>
    <g-pro-card loading style="max-width: 300px; margin-top: 16px" layout="center">
      内容
    </g-pro-card>
    <g-pro-card title="自定义 Loading" extra="extra" style="max-width: 300px; margin-top: 16px">
      <template #loading>
        <div>加载中</div>
      </template>
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
