<template>
  <g-pro-page-container :contentStyle="{ position: 'relative' }">
    <g-doc :anchorLinks="links">
      <a-typography id="watermark">
        <a-typography-title :level="2" :style="{ color: '#454d64' }">
          WaterMark 水印组件
          <a style="font-size: 14px" href="https://procomponents.ant.design/components/water-mark">
            （参照react-pro-components：water-mark）
          </a>
        </a-typography-title>
      </a-typography>
      <CustomizeSetApi />
      <PositionApi />
      <ContentApi />
      <ImageApi />
      <ParameterApi />
    </g-doc>
    <g-back-top />
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import PositionApi from './components/PositionApi.vue'
import ContentApi from './components/ContentApi.vue'
import ImageApi from './components/ImageApi.vue'
import CustomizeSetApi from './components/CustomizeSetApi.vue'
import ParameterApi from './components/ParameterApi.vue'

export default defineComponent({
  components: {
    PositionApi,
    ContentApi,
    ImageApi,
    CustomizeSetApi,
    ParameterApi
  },
  setup() {
    const state = reactive({
      links: [
        {
          link: '#watermark',
          name: 'WaterMark'
        },
        {
          link: '#watermark-customize',
          level: 2,
          name: '自定义配置'
        },
        {
          link: '#watermark-position',
          level: 2,
          name: '前置水印'
        },
        {
          link: '#watermark-text',
          level: 2,
          name: '文字水印'
        },
        {
          link: '#watermark-image',
          level: 2,
          name: '图片水印'
        },
        {
          link: '#watermark-api',
          name: 'API'
        },
        {
          link: '#watermark-basic-api',
          level: 2,
          name: '基础参数'
        },
        {
          link: '#watermark-high-api',
          level: 2,
          name: '高级参数'
        },
        {
          link: '#watermark-visualization-api',
          level: 2,
          name: '水印 API 可视化'
        }
      ]
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" module></style>
