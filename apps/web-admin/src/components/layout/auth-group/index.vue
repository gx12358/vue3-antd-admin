<script setup lang="ts">
import { isArray, isString } from '@gx-design-vue/pro-utils'
import { useAuth } from '@/hooks/system'

const props = defineProps<{
  auth: string | string[];
  type?: 'some' | 'all';
  showEmpty?: boolean;
}>()

const auth = computed(() => isString(props.auth) ? [ props.auth ] : isArray(props.auth) ? props.auth : [])

const { hasAuth } = useAuth()
</script>

<template>
  <template v-if="hasAuth(auth, type)">
    <slot />
  </template>
  <template v-else-if="showEmpty">
    无权限按钮
  </template>
</template>

<style scoped lang="less">

</style>
