<template>
  <RouterView>
    <template #default="{ Component }">
      <page-transition
        :disabled="animate.disabled"
        :animate="animate.name"
        :direction="animate.direction"
      >
        <component v-if="isRouterAlive" :is="Component" />
      </page-transition>
    </template>
  </RouterView>
  <Iframe v-if="iframeSrc" :frameSrc="iframeSrc" />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import PageTransition from '@/components/PageTransition/index.vue'
import Iframe from '../views/Iframe/index.vue'

const props = defineProps({
  isRouterAlive: {
    type: Boolean,
    required: false,
    default: true
  },
  contentStyle: {
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  },
  animate: {
    type: Object,
    required: false,
    default: () => {
      return {}
    }
  }
})

const router = useRouter()

const iframeSrc = computed(() => {
  const meta = router.currentRoute.value?.meta
  return meta?.target && Number(meta?.targetStatus) === 0 ? meta?.target : ''
})
</script>
