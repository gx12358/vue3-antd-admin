import type { MaybeRef, Ref } from 'vue'
import { useElementSize, useMounted, useWindowSize } from '@vueuse/core'
import * as echarts from 'echarts'
import { isRef } from 'vue'

const defaultBarOptions = {
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    show: false
  },
  yAxis: [
    {
      type: 'value'
    }
  ]
}

export default function <T = any>(id: string, props: {
  options?: any;
  rootEl?: any;
  series?: any;
  ready?: Ref<boolean>;
  xAxisOptions?: any;
  click?: Fn;
  seriesOptions?: any;
  data?: MaybeRef<T[]>;
  fieldNames?: Record<'name' | 'count', keyof T>
}) {
  let myChart

  const echartId = ref(id)
  const { width, height } = useWindowSize()
  const mount = useMounted()

  const xAxis = computed(() => {
    return [
      {
        type: 'category',
        data: props.data ? (isRef(props.data) ? props.data.value : props.data).map((item: any) => {
          return {
            ...item,
            value: item[props?.fieldNames?.name || 'name']
          }
        }) : [],
        ...(props.xAxisOptions || {})
      }
    ]
  })
  const dataList = computed(() =>
    props.data ? (isRef(props.data) ? props.data.value : props.data).map((item: any) => {
      const params: any = {
        value: item[props?.fieldNames?.count || 'count']
      }
      if (item.color) {
        params.itemStyle = {
          color: item.color
        }
      }
      const nameKey = props?.fieldNames?.name || 'name'
      if (item[nameKey]) {
        params.name = item[nameKey]
      }
      return params
    }) : []
  )

  if (isRef(props.data) && isRef(props.series)) {
    watch([
      () => props.ready?.value,
      () => (props.data as Ref<T[]>).value,
      () => (props.series as Ref<T[]>).value,
      () => mount.value
    ], ([ ready, val, isMount ]) => {
      if (ready === undefined || ready === true) {
        if (val.length && isMount) renderEchart()
      }
    }, { deep: true })
  } else if (isRef(props.data) && !isRef(props.series)) {
    watch([
      () => props.ready?.value,
      () => (props.data as Ref<T[]>).value,
      () => mount.value
    ], ([ ready, val, isMount ]) => {
      if (ready === undefined || ready === true) {
        if (val.length && isMount) renderEchart()
      }
    }, { deep: true })
  } else if (!isRef(props.data) && isRef(props.series)) {
    watch([
      () => props.ready?.value,
      () => (props.series as Ref<T[]>).value,
      () => mount.value
    ], ([ ready, val, isMount ]) => {
      if (ready === undefined || ready === true) {
        if (val.length && isMount) renderEchart()
      }
    }, { deep: true })
  } else {
    watch([
      () => props.ready?.value,
      () => mount.value
    ], ([ ready, val ]) => {
      if (ready === undefined || ready === true) {
        if (val) renderEchart()
      }
    })
  }

  const disposeEchart = () => {
    if (myChart) {
      myChart.dispose()
      myChart = null
    }
  }

  function renderEchart(options?: { init?: boolean; }) {
    if (options?.init || myChart)
      disposeEchart()

    nextTick(() => {
      const chartDom = document.getElementById(echartId.value)
      myChart = echarts.init(chartDom)
      const propsOptions = isRef(props.options) ? props.options?.value : props.options
      const options = {
        ...defaultBarOptions,
        series: props.series?.value ?? [
          {
            ...(props?.seriesOptions || {}),
            data: dataList.value
          }
        ],
        ...propsOptions
      }
      if (propsOptions?.xAxis === false) {
        delete options.xAxis
      } else {
        options.xAxis = xAxis.value
      }

      if (propsOptions?.yAxis === false) {
        delete options.yAxis
      }
      myChart.setOption(options)
      if (props?.click) {
        myChart.on('click', params => props.click?.(params))
      }
    })
  }

  if (props.rootEl) {
    const { width: rootWdith, height: rootHeight } = useElementSize(props.rootEl)
    watch([
      () => rootWdith.value,
      () => rootHeight.value
    ], () => {
      if (myChart) myChart.resize()
    })
  }

  watch([
    () => width.value,
    () => height.value
  ], () => {
    if (myChart) myChart.resize()
  })

  onUnmounted(() => {
    disposeEchart()
  })
}
