<script lang="ts" setup>
import { isBoolean } from '@gx-design-vue/pro-utils'

withDefaults(defineProps<{
  text?: string | boolean;
  width?: number;
}>(), {
  text: '暂无数据',
  width: 120
})
</script>

<template>
  <div class="flex-center flex-col">
    <img :style="{ width: `${width}px` }" src="/src/assets/public_images/nodata.svg" alt="">
    <span v-if="text" class="relative left-[-5px]">{{ isBoolean(text) ? '暂无数据' : text }}</span>
  </div>
</template>
