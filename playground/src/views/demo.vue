<script setup lang="ts">
import { GUpload } from '@gx/design'

const urlList = computed<any[]>(() => [
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/21.jpg',
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/1.mp4',
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/1.mp3'
])
</script>

<template>
  <g-pro-page-container>
    <div class="mx-20%">
      <GUpload :list="urlList" />
    </div>
  </g-pro-page-container>
</template>

<style scoped lang="less">

</style>
