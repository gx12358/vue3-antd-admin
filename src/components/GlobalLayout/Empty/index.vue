<script lang="ts" setup>
import { isBoolean } from '@gx-design-vue/pro-utils'

withDefaults(defineProps<{
  text?: string | boolean;
  width?: number;
}>(), {
  text: '暂无数据',
  width: 120
})

const slots = useSlots()
</script>

<template>
  <div class="flex-center flex-col">
    <img :style="{ width: `${width}px` }" src="/src/assets/public_images/nodata.svg" alt="">
    <slot name="text" v-if="slots?.text" />
    <span v-else-if="text" class="relative left-[-5px]">{{ isBoolean(text) ? '暂无数据' : text }}</span>
  </div>
</template>
