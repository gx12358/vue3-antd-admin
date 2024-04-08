<script setup lang="ts">
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import { GProApp } from '@gx-design-vue/pro-app'
import PageLoading from '@/components/PageLoading'
import Empty from '@/components/GlobalLayout/Empty/index.vue'

const indicator = h('i', {
  class: 'iconfont gx-jiazaizhong gx-admin-spin',
  spin: true
})

const store = useStore()
const route = useRoute()

const loading = computed(() => store.routes.routerLoading)
</script>

<template>
  <ConfigProvider :locale="zhCN">
    <template #renderEmpty>
      <Empty :text="false" />
    </template>
    <GProApp :indicator="indicator" class="h-full">
      <template #emptyText>
        <Empty />
      </template>
      <div id="gx-pro-admin">
        <g-scrollbars :bar-style="{ zIndex: 110 }">
          <router-view />
        </g-scrollbars>
        <PageLoading :loading="loading && route.fullPath === '/'" />
      </div>
    </GProApp>
  </ConfigProvider>
</template>


