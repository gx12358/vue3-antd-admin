<script setup lang="ts">
import Base from './components/Base.vue'
import Binding from './components/Binding.vue'
import Notification from './components/Notification.vue'
import Security from './components/Security.vue'

type menuKey = 'base' | 'security' | 'binding' | 'notification'

const menuMap: Record<menuKey, any> = {
  base: {
    name: '基本设置',
    components: Base
  },
  security: {
    name: '安全设置',
    components: Security
  },
  binding: {
    name: '账号绑定',
    components: Binding
  },
  notification: {
    name: '新消息通知',
    components: Notification
  },
}

const activeKey = ref<menuKey>('base')
</script>

<template>
  <g-pro-page-container :page-card-props="{ bodyStyle: { paddingInline: '16px' } }">
    <a-tabs v-model:active-key="activeKey" tab-position="left" animated>
      <a-tab-pane v-for="(item, key) in menuMap" :key="key" class="!px-30px" :tab="item.name">
        <component :is="item.components" />
      </a-tab-pane>
    </a-tabs>
  </g-pro-page-container>
</template>

<style lang="less" scoped>

</style>
