<template>
  <a-typography style="margin-top: 16px" id="splitCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 卡片切分 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    布局模式下通过配置<span class="gx-markdown-code">split</span
    >可以方便地切分卡片，可以进行任意的分栏，不管是横切还是竖切都非常便利，切分出来的分栏仍然保有卡片的特性，高度自动撑满。注意：
    <ul style="margin-top: 16px; list-style-type: disc">
      <li>切分时父卡片的内容 <span class="gx-markdown-code">padding</span> 会被设置为 0。</li>
      <li>切分时子卡片的 <span class="gx-markdown-code">border-radius</span> 会被设置为 0。</li>
    </ul>
  </div>
  <div class="gx-markdown-demo">
    <ResizeObserver
      key="resize-observer"
      :onResize="
        ({ width }) => {
          setResponsive(width < 596)
        }
      "
    >
      <g-pro-card
        title="左右分栏带标题"
        extra="2019年9月28日"
        :split="responsive ? 'horizontal' : 'vertical'"
        bordered
        headerBordered
      >
        <g-pro-card title="左侧详情" colSpan="50%">
          <div style="height: 360px">左侧内容</div>
        </g-pro-card>
        <g-pro-card title="流量占用情况">
          <div style="height: 360px">右侧内容</div>
        </g-pro-card>
      </g-pro-card>
    </ResizeObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'

export default defineComponent({
  components: {
    ResizeObserver
  },
  setup() {
    const responsive = ref(false)
    const setResponsive = (value: boolean) => {
      responsive.value = value
    }
    return {
      responsive,
      setResponsive
    }
  }
})
</script>

<style lang="less" module></style>
