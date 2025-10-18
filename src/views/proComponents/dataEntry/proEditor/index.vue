<script setup lang="ts">
import GProEditor from '@/components/GlobalLayout/ProEditor/index.vue'

const content = ref(`<p>你好～</p>`)
</script>

<template>
  <g-pro-page-container>
    <GProEditor
      ref="editors"
      v-model:value="content"
    />
  </g-pro-page-container>
</template>

<style lang="less" module></style>
