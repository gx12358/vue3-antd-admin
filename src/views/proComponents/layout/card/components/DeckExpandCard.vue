<template>
  <a-typography style="margin-top: 16px" id="deckExpandCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 卡片组展开 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    配合
    <span class="gx-markdown-code">ghost</span>
    幽灵模式和可折叠能力可以实现卡片组展开。
  </div>
  <div class="gx-markdown-demo" :style="isMobile ? undefined : { width: '500px' }">
    <g-pro-card title="卡片组展开" ghost :gutter="8" collapsible>
      <g-pro-card layout="center" bordered> 卡片内容 </g-pro-card>
      <g-pro-card layout="center" bordered> 卡片内容 </g-pro-card>
      <g-pro-card layout="center" bordered> 卡片内容 </g-pro-card>
    </g-pro-card>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import useMediaQuery from '@/hooks/event/useMediaQuery'

export default defineComponent({
  setup() {
    const colSize = useMediaQuery()

    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')
    return {
      isMobile
    }
  }
})
</script>

<style lang="less" module></style>
