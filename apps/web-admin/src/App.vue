<script setup lang="ts">
import { GProAppPage, ThemeContext } from '@gx-design-vue/pro-layout'
import { GProConfigProvider } from '@gx-design-vue/pro-provider'
import { StyleGlobalContext } from '@gx/design'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
import Empty from '@/components/layout/empty/index.vue'
import globalStyles from '@/design/global-style'
import { useScrollRoot } from '@/hooks/web'

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
      <StyleGlobalContext :modules="globalStyles" />
      <GProAppPage
        :spinning="{
          loading: global.pageLoading && route.fullPath === '/',
        }"
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
