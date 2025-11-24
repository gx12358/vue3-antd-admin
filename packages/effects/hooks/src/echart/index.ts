import type { MaybeRef } from 'vue'
import type { ECOption } from './types'
import { useThemeContext } from '@gx-design-vue/context'
import {
  tryOnUnmounted,
  useDebounceFn,
  useMounted,
  useResizeObserver,
  useTimeoutFn,
  useWindowSize,
} from '@vueuse/core'
import { BarChart, LineChart, PieChart, RadarChart } from 'echarts/charts'
// 引入标题，提示框，直角坐标系，数据集，内置数据转换器组件，组件后缀都为 Component
import {
  DatasetComponent,
  GraphicComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent
} from 'echarts/components'
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
import * as echarts from 'echarts/core'
// 标签自动布局、全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features'
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { SVGRenderer } from 'echarts/renderers'
import { computed, isRef, nextTick, ref, watch } from 'vue'

// 注册必须的组件
echarts.use([
  LineChart,
  RadarChart,
  GraphicComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DatasetComponent,
  TransformComponent,
  BarChart,
  PieChart,
  LabelLayout,
  UniversalTransition,
  SVGRenderer
])

export function useEchart(chartId: string, options: MaybeRef<ECOption>) {
  let chartInstance: echarts.ECharts | null = null
  let cacheOptions: ECOption = {}

  const { isDark } = useThemeContext()
  const mounted = useMounted()
  const { height, width } = useWindowSize()
  const resizeHandler: () => void = useDebounceFn(resize, 200)

  const chartEl = ref<HTMLElement | null>(null)

  const disposeEchart = () => chartInstance?.dispose()

  const getOptions = computed<ECOption>(() => {
    if (!isDark.value) {
      return {}
    }

    return {
      backgroundColor: 'transparent'
    }
  })

  const initCharts = (id) => {
    chartEl.value = document.getElementById(id)
    if (!chartEl.value) {
      return
    }
    chartInstance = echarts.init(chartEl.value, isDark.value ? 'dark' : null)

    return chartInstance
  }

  const isElHidden = (el: HTMLElement | null): boolean => {
    if (!el) return true
    return el.offsetHeight === 0 || el.offsetWidth === 0
  }

  watch([
    () => mounted.value,
    () => isRef(options) ? options.value : options
  ], () => {
    if (mounted.value) {
      initCharts(chartId)
      renderEchart(isRef(options) ? options.value : options)
    }
  }, { immediate: true })

  function renderEchart(
    options: ECOption,
    clear = true,
  ) {
    cacheOptions = options
    const currentOptions = {
      ...options,
      ...getOptions.value,
    }
    return new Promise((resolve) => {
      if (chartEl.value?.offsetHeight === 0) {
        useTimeoutFn(async () => {
          resolve(await renderEchart(currentOptions))
        }, 30)
        return
      }
      nextTick(() => {
        if (isElHidden(chartEl.value)) {
          useTimeoutFn(async () => {
            resolve(await renderEchart(currentOptions))
          }, 30)
          return
        }
        useTimeoutFn(() => {
          if (!chartInstance) {
            const instance = initCharts(chartId)
            if (!instance) return
          }
          clear && chartInstance?.clear()
          chartInstance?.setOption(currentOptions)
          resolve(chartInstance)
        }, 30)
      })
    })
  }

  function resize() {
    if (isElHidden(chartEl.value)) {
      return
    }
    chartInstance?.resize({
      animation: {
        duration: 300,
        easing: 'quadraticIn',
      },
    })
  }

  watch([width, height], () => {
    resizeHandler?.()
  })

  useResizeObserver(chartEl, resizeHandler)

  watch(isDark, () => {
    if (chartInstance) {
      chartInstance.dispose()
      initCharts(chartId)
      renderEchart(cacheOptions)
      resize()
    }
  })

  tryOnUnmounted(() => {
    disposeEchart()
  })

  return {
    renderEchart,
    resize,
    getChartInstance: () => chartInstance,
  }
}

export default echarts
