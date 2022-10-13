<template>
  <a-typography style="margin-top: 16px" id="responsiveCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 响应式 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    <span class="gx-markdown-code">colSpan</span>
    支持 antd 定义的栅格式响应布局。预设六个响应尺寸：
    <span class="gx-markdown-code">xs&nbsp;&nbsp;</span>
    <span class="gx-markdown-code">sm&nbsp;&nbsp;</span>
    <span class="gx-markdown-code">md&nbsp;&nbsp;</span>
    <span class="gx-markdown-code">lg&nbsp;&nbsp;</span>
    <span class="gx-markdown-code">xl&nbsp;&nbsp;</span>
    <span class="gx-markdown-code">xxl</span>
    。如果要支持响应式，可以写成
    <span class="gx-markdown-code">{ xs: 4, sm: 8, md: 10, lg: 12 }</span>
    。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card title="24栅格" style="margin-top: 8px" :gutter="8">
      <g-pro-card :colSpan="{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }" layout="center" bordered>
        Col
      </g-pro-card>
      <g-pro-card :colSpan="{ xs: 20, sm: 16, md: 12, lg: 8, xl: 4 }" layout="center" bordered>
        Col
      </g-pro-card>
      <g-pro-card :colSpan="{ xs: 2, sm: 4, md: 6, lg: 8, xl: 10 }" layout="center" bordered>
        Col
      </g-pro-card>
    </g-pro-card>
    <g-pro-card title="指定宽度px" :gutter="8" style="margin-top: 8px">
      <g-pro-card
        :colSpan="{
          xs: '50px',
          sm: '100px',
          md: '200px',
          lg: '300px',
          xl: '400px'
        }"
        layout="center"
        bordered
      >
        Col
      </g-pro-card>
      <g-pro-card layout="center" bordered> Auto </g-pro-card>
    </g-pro-card>
    <g-pro-card title="指定宽度百分比" :gutter="8" style="margin-top: 8px">
      <g-pro-card layout="center" bordered> Auto </g-pro-card>
      <g-pro-card
        :colSpan="{
          xs: '10%',
          sm: '20%',
          md: '30%',
          lg: '40%',
          xl: '50%'
        }"
        layout="center"
        bordered
      >
        Col - 百分比
      </g-pro-card>
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

<style lang="less" module></style>
