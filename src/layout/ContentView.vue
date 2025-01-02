<script setup lang="ts">
import type { AppRouteModule, Meta } from '@gx-design-vue/pro-layout'
import { PageTranstion, useProLayoutContext } from '@gx-design-vue/pro-layout'
import { computed, ref } from 'vue'
import IframeView from '../views/Iframe/index.vue'

const { global, layout } = useStore()
const router = useRouter()
const { renderRouterView } = useProLayoutContext()

const keepLiveRouterNames = ref<any[]>([])

const iframeSrc = computed(() => {
  const meta = router.currentRoute.value?.meta as Meta
  return meta?.link && Number(meta?.linkStatus) === 0 ? meta?.link || '' : ''
})

watch(() => global.keepAlive, () => {
  keepLiveRouterNames.value = (router.getRoutes() as AppRouteModule[])
    .filter(item => global.keepAlive || (item.meta as Meta)?.keepAlive)
    .map(item => item.name)
}, { immediate: true })
</script>

<template>
  <router-view>
    <template #default="{ Component }">
      <PageTranstion v-bind="layout.config.settings.animate">
        <template v-if="renderRouterView">
          <keep-alive :include="keepLiveRouterNames">
            <component :is="Component" />
          </keep-alive>
        </template>
      </PageTranstion>
    </template>
  </router-view>
  <IframeView v-if="iframeSrc" :frame-src="iframeSrc" />
</template>
