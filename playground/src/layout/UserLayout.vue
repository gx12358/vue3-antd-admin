<script setup lang="ts">
import { getPrefixCls } from '@gx-design-vue/pro-utils'

const userLayoutId = getPrefixCls({
  suffixCls: 'user-layout',
  isPor: true
})
</script>

<template>
  <div :id="userLayoutId">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
