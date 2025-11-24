<script setup lang="ts">
const urlList = computed<string[]>(() => [
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/21.jpg',
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/1.mp4',
  'https://oss-liveshow.oss-cn-beijing.aliyuncs.com/mp-static/static/images/1.mp3'
])
</script>

<template>
  <g-pro-page-container>
    <g-admin-upload :progress="false" :list="urlList" />
  </g-pro-page-container>
</template>
