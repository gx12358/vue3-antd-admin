<script setup lang="ts">
import type { ButtonProps } from 'ant-design-vue/es/button/buttonTypes'

defineProps<{
  title: string
} & ButtonProps>()

const emit = defineEmits([ 'click' ])
</script>

<template>
  <a-tooltip :title="title">
    <a-button @click="e => emit('click', e)">
      <slot />
      <slot name="icon" />
    </a-button>
  </a-tooltip>
</template>

<style scoped lang="less">

</style>
