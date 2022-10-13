<template>
  <a-typography style="margin-top: 16px" id="cardTab">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 卡片式页签 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    配置
    <span class="gx-markdown-code">tab</span>的 <span class="gx-markdown-code">type</span>为
    <span class="gx-markdown-code">card</span>
    来配置卡片式页签。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card
      :tabs="{
        type: 'card'
      }"
    >
      <g-pro-card-tab-pane key="tab1" tab="产品一"> 内容一 </g-pro-card-tab-pane>
      <g-pro-card-tab-pane key="tab2" tab="产品二"> 内容二 </g-pro-card-tab-pane>
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
