<template>
  <router-view>
    <template #default="{ Component }">
      <keep-alive v-if="keepAlive">
        <component :is="Component" />
      </keep-alive>
      <component v-else :is="Component" />
    </template>
  </router-view>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useStore } from '@gx-vuex'

const route = useRoute()
const store = useStore()

const keepAlive = ref(false)

const { meta } = route

watch(
  () => route,
  () => {
    if (!store.settings.showTabsBar && !meta.keepAlive) {
      keepAlive.value = false
    } else {
      keepAlive.value =
        store.settings.keepAlive || store.settings.showTabsBar || (meta.keepAlive as boolean)
    }
  },
  {
    deep: true,
    immediate: true
  }
)
</script>
