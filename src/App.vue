<script setup lang="ts">
import { useScrollRoot } from '@gx-admin/hooks/web'
import { GProAppPage, ThemeContext } from '@gx-design-vue/pro-layout'
import { GProConfigProvider } from '@gx-design-vue/pro-provider'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import GIcon from '@/components/GDesign/Icon'
import StyleGlobal from '@/components/GlobalContext/StyleGlobal'
import Empty from '@/components/GlobalLayout/Empty/index.vue'

const indicator = h(GIcon, {
  type: 'loading',
  class: 'gx-pro-spin gx-admin-spin',
})

const route = useRoute()
const scrollRoot = useScrollRoot()

const { theme, global } = useStore()
</script>

<template>
  <GProConfigProvider
    :locale="zhCN"
    :token="theme.token"
    :css-var="theme.cssVar"
    :dark="theme.isDark"
    :get-popup-container="() => scrollRoot"
  >
    <ThemeContext v-model:theme="theme.theme">
      <StyleGlobal />
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
    </ThemeContext>
  </GProConfigProvider>
</template>

<style scoped lang="less">

</style>
