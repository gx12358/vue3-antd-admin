<script setup lang="ts">
import { getPrefixCls } from '@gx-design-vue/pro-utils'

const iframeLayoutId = getPrefixCls({
  suffixCls: 'iframe-layout',
  isPor: true
})
</script>

<template>
  <div :id="iframeLayoutId">
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </div>
</template>
