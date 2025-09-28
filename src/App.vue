<script setup lang="ts">
import { GProAppPage } from '@gx-design-vue/pro-layout'
import { GProConfigProvider } from '@gx-design-vue/pro-provider'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Empty from '@/components/GlobalLayout/Empty/index.vue'

const indicator = h('i', {
  class: 'iconfont gx-jiazaizhong gx-admin-spin',
  spin: true,
})

const route = useRoute()

const { layout, global } = useStore()
</script>

<template>
  <GProConfigProvider :locale="zhCN" :token="{ colorPrimary: layout.config.settings.primaryColor }">
    <GProAppPage
      :spinning="{
        loading: global.pageLoading && route.fullPath === '/',
      }"
      :indicator="indicator"
      :spin-props="{ iconStyle: { fontSize: '40px' } }"
    >
      <template #emptyText>
        <Empty />
      </template>
      <router-view />
    </GProAppPage>
  </GProConfigProvider>
</template>

<style scoped lang="less">

</style>
