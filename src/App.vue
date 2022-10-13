<template>
  <div id="gx-pro-admin">
    <g-bars>
      <config-provider :locale="locale">
        <router-view />
      </config-provider>
    </g-bars>
    <g-page-loading :loading="loading && routhPath === '/'" />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@gx-vuex'
import { ConfigProvider } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'

const store = useStore()
const route = useRoute()

const locale = ref(zhCN)
const routhPath = ref(route.fullPath)

const loading = computed(() => store.routes.routerLoading)

watch(
  () => route.fullPath,
  (value) => {
    routhPath.value = value
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
