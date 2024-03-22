<template>
  <router-view>
    <template #default="{ Component }">
      <PageTranstion v-bind="animate">
        <template v-if="reloadStatus">
          <keep-alive :include="keepliveRouterNames">
            <component :is="Component"  />
          </keep-alive>
        </template>
      </PageTranstion>
    </template>
  </router-view>
  <IframeView v-if="iframeSrc" :frameSrc="iframeSrc" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import type { BasicLayoutProps, Meta } from '@gx-design-vue/pro-layout'
import { PageTranstion } from '@gx-design-vue/pro-layout'
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

const store = useStore()
const router = useRouter()

const keepliveRouterNames = ref([])

const iframeSrc = computed(() => {
  const meta = router.currentRoute.value?.meta as Meta
  return meta?.target && Number(meta?.targetStatus) === 0 ? meta?.target || '' : ''
})

watch(
  [
    () => store.global.settings?.keepAlive
  ],
  () => {
    keepliveRouterNames.value = router.getRoutes()
      .filter(item => store.global.settings?.keepAlive || (item.meta as Meta)?.keepAlive)
      .map(item => item.name)
  }, { immediate: true }
)
</script>
