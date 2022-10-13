<template>
  <a-typography style="margin-top: 16px" id="groupCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 分组展示 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    你可以嵌套卡片组件来将内容分组, 以及
    <span class="gx-markdown-code">Divider</span>
    子组件来分隔这些内容。
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
      <g-pro-card-group title="核心指标" :direction="responsive ? 'column' : 'row'">
        <g-pro-card>
          <Statistic title="今日UV" :value="79.0" :precision="2" />
        </g-pro-card>
        <g-pro-card-divider :type="responsive ? 'horizontal' : 'vertical'" />
        <g-pro-card>
          <Statistic title="冻结金额" :value="112893.0" :precision="2" />
        </g-pro-card>
        <g-pro-card-divider :type="responsive ? 'horizontal' : 'vertical'" />
        <g-pro-card>
          <Statistic title="信息完整度" :value="93" suffix="/ 100" />
        </g-pro-card>
        <g-pro-card-divider :type="responsive ? 'horizontal' : 'vertical'" />
        <g-pro-card>
          <Statistic title="冻结金额" :value="112893.0" />
        </g-pro-card>
      </g-pro-card-group>
    </ResizeObserver>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { Statistic } from 'ant-design-vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'

export default defineComponent({
  components: { Statistic, ResizeObserver },
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
