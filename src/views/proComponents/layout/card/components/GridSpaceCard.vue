<template>
  <a-typography style="margin-top: 16px" id="gridSpaceCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 栅格间隔 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    栅格常常需要和间隔进行配合，你可以使用
    <span class="gx-markdown-code">gutter</span>
    属性，我们推荐使用
    <span class="gx-markdown-code">(16+8n)px</span>
    作为栅格间隔(n 是自然数)，如果要支持响应式，可以写成
    <span class="gx-markdown-code">{ xs: 8, sm: 16, md: 24, lg: 32 }</span>
    。如果需要垂直间距，可以写成数组形式
    <span class="gx-markdown-code">[水平间距, 垂直间距][16, { xs: 8, sm: 16, md: 24, lg: 32 }]</span
    >。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card :wrap="isMobile" :gutter="[16, 16]">
      <g-pro-card :colSpan="isMobile ? '100%' : '30%'" title="title" headerBordered bordered>
        300px
      </g-pro-card>
      <g-pro-card bordered>Auto</g-pro-card>
    </g-pro-card>
    <g-pro-card
      :wrap="isMobile"
      :gutter="[{ xs: 8, sm: 8, md: 16, lg: 24, xl: 32 }, 16]"
      style="margin-top: 16px"
    >
      <g-pro-card bordered>Responsive</g-pro-card>
      <g-pro-card bordered>Responsive</g-pro-card>
      <g-pro-card bordered>Responsive</g-pro-card>
    </g-pro-card>
    <g-pro-card :wrap="isMobile" :gutter="16" style="margin-top: 16px">
      <g-pro-card bordered>Auto</g-pro-card>
      <g-pro-card bordered>Auto</g-pro-card>
      <g-pro-card bordered>Auto</g-pro-card>
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
