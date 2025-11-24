<script setup lang="ts">
import type { DeepPartial, ProAliasToken } from '@gx-design-vue/pro-provider'
import { GProLayout, useLayoutMenu } from '@gx-design-vue/pro-layout'
import { GProThemeEditor } from '@gx-design-vue/pro-layout-components'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from '@/store'
import { layoutConfig } from '@/store/modules/layout'
import ProContent from './ContentView.vue'

const { theme, layout } = useStore()

const router = useRouter()

const collapsed = ref(false)
const themeEditorOpen = ref(false)

const { breadcrumbRouters, matchedKeys, menuData } = useLayoutMenu()

watch([
  () => router.currentRoute.value?.meta?.hidden,
  () => layout.config.settings?.layout
], ([ val, settingsLayout ]) => {
  if (settingsLayout) {
    layout.setValue({
      config: {
        settings: {
          siderWidth: val ? 0 : layoutConfig.siderWidth
        }
      }
    })
  }
}, { immediate: true })

function changeLayoutConfig(state: Partial<SystemLayoutConfig>) {
  layout.setValue({
    config: {
      settings: state
    }
  })
}

function changeLayoutTokens(state: DeepPartial<ProAliasToken>) {
  layout.setValue({
    config: {
      token: state
    }
  })
}
</script>

<template>
  <GProLayout
    :ref="val => layout.proLayout = val as any"
    v-model:collapsed="collapsed"
    v-model:selected-keys="matchedKeys.selectedKeys"
    v-model:open-keys="matchedKeys.openKeys"
    v-model:theme="theme.theme"
    :route="menuData"
    v-bind="layout.config"
    :breadcrumb="{ routes: breadcrumbRouters }"
    @logo-click="() => router.push('/')"
  >
    <ProContent />
    <GProThemeEditor
      v-model:open="themeEditorOpen"
      :default-token="layout.config.token"
      :default-value="layout.config.settings"
      @change-tokens-state="changeLayoutTokens"
      @change-setting-state="changeLayoutConfig"
    />
  </GProLayout>
</template>
