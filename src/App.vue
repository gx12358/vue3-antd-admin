<script setup lang="ts">
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import PageLoading from '@/components/PageLoading'
import { GProApp } from '@gx-design-vue/pro-app'
import ProConfigProvider from '@gx-design-vue/pro-provider'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const indicator = h('i', {
  class: 'iconfont gx-jiazaizhong gx-admin-spin',
  spin: true
})

const { global } = useStore()
const { globalLayout, pageLoading } = toRefs(global.state)
</script>

<template>
  <ProConfigProvider :locale="zhCN" :token="{ colorPrimary: globalLayout.primaryColor }">
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
        <PageLoading :loading="pageLoading" />
      </div>
    </GProApp>
  </ProConfigProvider>
</template>
