<template>
  <a-typography style="margin-top: 16px" id="stepsCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 竖向步骤示例 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    <span class="gx-markdown-code">Steps</span>
    组件结合
    <span class="gx-markdown-code">ProCard</span>
    组件完成竖向步骤示例。
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
        :split="responsive ? 'horizontal' : 'vertical'"
        bordered
        :style="isMobile ? undefined : { height: '320px' }"
      >
        <g-pro-card :colSpan="responsive ? 24 : 6">
          <Steps
            style="height: 100%"
            :direction="responsive ? 'horizontal' : 'vertical'"
            size="small"
            :current="current"
          >
            <Step title="填写基本信息" />
            <Step title="配置模板" />
            <Step title="配置访问" />
            <Step title="配置部署和调度" />
            <Step title="预览" />
          </Steps>
        </g-pro-card>
        <g-pro-card title="流量占用情况" :colSpan="responsive ? 24 : 18">
          <a-space>
            <a-button
              key="primary"
              type="primary"
              @click="
                () => {
                  current += 1
                }
              "
              :disabled="current === 5"
            >
              下一步
            </a-button>
            <a-button
              key="pre"
              @click="
                () => {
                  current -= 1
                }
              "
              :disabled="current === 0"
            >
              上一步
            </a-button>
          </a-space>
        </g-pro-card>
      </g-pro-card>
    </ResizeObserver>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, Ref, ref } from 'vue'
import { Steps } from 'ant-design-vue'
import { default as ResizeObserver } from 'ant-design-vue/es/vc-resize-observer'
import useMediaQuery from '@/hooks/event/useMediaQuery'

const Step = Steps.Step

export default defineComponent({
  components: { ResizeObserver, Steps, Step },
  setup() {
    const colSize = useMediaQuery()
    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')
    const current: Ref<number> = ref(0)
    const responsive: Ref<boolean> = ref(false)
    const setResponsive = (value: boolean) => {
      responsive.value = value
    }
    return {
      current,
      isMobile,
      responsive,
      setResponsive
    }
  }
})
</script>
