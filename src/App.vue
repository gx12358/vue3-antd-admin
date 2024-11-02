<script setup lang="ts">
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import { ProAppPage } from '@gx-design-vue/pro-layout'
import ProConfigProvider from '@gx-design-vue/pro-provider'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const indicator = h('i', {
  class: 'iconfont gx-jiazaizhong gx-admin-spin',
  spin: true
})

const route = useRoute()
const { layout, global } = useStore()
</script>

<template>
  <ProConfigProvider :locale="zhCN" :token="{ colorPrimary: layout.settings.primaryColor }">
    <ProAppPage
      :spinning="global.pageLoading && route.fullPath === '/'"
      :indicator="indicator"
      :spin-props="{ iconStyle: { fontSize: '40px' } }"
    >
      <template #emptyText>
        <Empty />
      </template>
      <router-view />
    </ProAppPage>
  </ProConfigProvider>
</template>

<style scoped lang="less">

</style>
