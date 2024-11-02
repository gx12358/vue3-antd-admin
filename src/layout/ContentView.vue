<script setup lang="ts">
import type { AppRouteModule, BasicLayoutProps, Meta } from '@gx-design-vue/pro-layout'
import { PageTranstion } from '@gx-design-vue/pro-layout'
import { computed, ref } from 'vue'
import IframeView from '../views/Iframe/index.vue'

defineProps({
  reloadStatus: {
    type: Boolean as VuePropType<boolean>,
    default: true
  },
  animate: {
    type: Object as VuePropType<BasicLayoutProps['animate']>,
    default: () => {
      return {}
    }
  }
})

const { global } = useStore()
const router = useRouter()

const keepLiveRouterNames = ref([])

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
      <PageTranstion v-bind="animate">
        <template v-if="reloadStatus">
          <keep-alive :include="keepLiveRouterNames">
            <component :is="Component" />
          </keep-alive>
        </template>
      </PageTranstion>
    </template>
  </router-view>
  <IframeView v-if="iframeSrc" :frame-src="iframeSrc" />
</template>
