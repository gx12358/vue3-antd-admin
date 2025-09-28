<script setup lang="ts">
import { isArray, isString } from '@gx-design-vue/pro-utils'
import { usePermissions } from '@/hooks/system'

const props = defineProps<{
  auth: string | string[];
  type?: 'some' | 'all';
  showEmpty?: boolean;
}>()

const auth = computed(() => isString(props.auth) ? [ props.auth ] : isArray(props.auth)
  ? props.auth
  : [])

const { hasPermission } = usePermissions()
</script>

<template>
  <template v-if="hasPermission(auth, type)">
    <slot />
  </template>
  <template v-else-if="showEmpty">
    无权限按钮
  </template>
</template>

<style scoped lang="less">

</style>
