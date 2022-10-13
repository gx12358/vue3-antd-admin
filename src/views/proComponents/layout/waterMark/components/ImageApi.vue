<template>
  <a-typography id="watermark-image" style="margin-top: 15px">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64">
      图片水印水印
    </a-typography-title>
  </a-typography>
  <a-typography>
    <a-typography style="color: #454d64">
      通过
      <span style="padding: 2px 5px; color: #d56161; background: #f6f7f9"> image </span>
      指定图片地址。为保证图片高清且不被拉伸，请传入水印图片的宽高 width 和 height,
      并上传至少两倍的宽高的 logo 图片地址。
    </a-typography>
  </a-typography>
  <div
    style="
      position: relative;
      z-index: 90;
      margin-top: 15px;
      background-color: #fff;
      border: 1px solid #ebedf1;
      border-radius: 1px;
    "
  >
    <div style="padding: 40px 24px">
      <g-pro-watermark :width="115" :height="36" :image="imageUrl">
        <div style="height: 500px"></div>
      </g-pro-watermark>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  setup() {
    const imageUrl = ref(
      'https://gw.alipayobjects.com/zos/bmw-prod/59a18171-ae17-4fc5-93a0-2645f64a3aca.svg'
    )
    return {
      imageUrl
    }
  }
})
</script>
