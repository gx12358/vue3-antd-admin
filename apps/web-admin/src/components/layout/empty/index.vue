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
    <img :style="{ width: `${width}px` }" src="@images/public/nodata.svg" alt="">
    <slot v-if="slots?.text" name="text" />
    <span v-else-if="text" class="relative left-[-5px] text-hex-999">{{ isBoolean(text) ? '暂无数据' : text }}</span>
  </div>
</template>
