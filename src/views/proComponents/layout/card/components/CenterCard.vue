<template>
  <a-typography style="margin-top: 16px" id="centerCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 内容居中 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    配置
    <span class="gx-markdown-code">layout</span>
    属性为
    <span class="gx-markdown-code">center</span>
    控制内容垂直居中，设置居中时内容部分转为
    <span class="gx-markdown-code">flex</span>
    布局，可以使用
    <span class="gx-markdown-code">direction</span>
    控制
    <span class="gx-markdown-code">flex</span>方向。
  </div>
  <div class="gx-markdown-demo" :style="isMobile ? undefined : { width: '500px' }">
    <g-pro-card
      title="标题"
      extra="extra"
      layout="center"
      direction="column"
      style="max-width: 300px; height: 200px"
    >
      <div>123</div>
      <div>456</div>
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
