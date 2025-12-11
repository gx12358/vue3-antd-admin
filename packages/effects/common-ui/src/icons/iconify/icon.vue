<script setup lang="ts">
import type { Fn } from '@gx/types'
import type { Component } from 'vue'
import { isHttpUrl, } from '@gx-core/shared/utils'
import { isFunction, isObject, isString, } from '@gx-design-vue/pro-utils'
import { Icon } from '@iconify/vue'
import { computed } from 'vue'

const props = defineProps<{
  // 没有是否显示默认图标
  fallback?: boolean;
  icon?: Component | Fn | string;
}>()

const isRemoteIcon = computed(() => {
  return isString(props.icon) && isHttpUrl(props.icon)
})

const isComponent = computed(() => {
  const { icon } = props
  return !isString(icon) && (isObject(icon) || isFunction(icon))
})
</script>

<template>
  <component :is="icon as Component" v-if="isComponent" v-bind="$attrs" />
  <img v-else-if="isRemoteIcon" :src="icon as string" v-bind="$attrs">
  <Icon v-else-if="icon" v-bind="$attrs" :icon="icon as string" />
</template>
