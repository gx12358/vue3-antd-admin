<script setup lang="ts">
import type { ProLayoutExpose } from '@gx-design-vue/pro-layout'
import type { BaseLayoutDesignToken, ProLayoutConfig } from '@gx-design-vue/pro-provider'
import { appList } from '@/common'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { useThemeStyle } from '@/hooks/web'
import { GProLayout, PageLock, RightContent, useLayoutMenu } from '@gx-design-vue/pro-layout'
import { useRouter } from 'vue-router'
import ProContent from './ContentView.vue'

const { layout, user } = useStore()

const router = useRouter()

const collapsed = ref(false)

const { breadcrumbRouters, matchedKeys, menuData } = useLayoutMenu({})

watch([
  () => router.currentRoute.value?.meta?.hidden,
  () => layout.config.settings.layout
], ([ val ]) => {
  layout.setValue({
    config: {
      settings: { siderWidth: val ? 0 : undefined }
    }
  })
}, { immediate: true })

const color = useThemeStyle({
  colorError: 'colorError',
  colorErrorHover: 'colorErrorHover'
})

watchEffect(() => {
  const htmlEl = document.querySelector('html')
  if (htmlEl) {
    color.colorError && htmlEl.style.setProperty('--gx-color-error', color.colorError)
    color.colorErrorHover && htmlEl.style.setProperty(
      '--gx-color-error-hover',
      color.colorErrorHover
    )
  }
})

const changeSettings = (value: Partial<ProLayoutConfig>) => {
  layout.setValue({
    config: {
      settings: value
    }
  })
}

const changeLayoutTheme = (value: Partial<BaseLayoutDesignToken>) => {
  layout.setValue({
    config: {
      token: {
        layout: value
      }
    }
  })
}

const userLogout = (callBack: Fn) => {
  globalConfirm({
    title: '温馨提醒',
    content: '是否确认退出系统?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      user.userLogut().then((_) => {}).finally(() => {
        router.push({ path: '/user' })
        callBack?.()
      })
    }
  })
}
</script>

<template>
  <GProLayout
    :ref="val => layout.proLayoutRef = val as unknown as ProLayoutExpose"
    v-model:collapsed="collapsed"
    v-model:selected-keys="matchedKeys.selectedKeys"
    v-model:open-keys="matchedKeys.openKeys"
    v-bind="layout.config"
    :route="menuData"
    :breadcrumb="{ routes: breadcrumbRouters }"
    @menu-header-click="() => router.push('/')"
  >
    <template #appLogoListRender>
      <AppsLogoList :app-list="appList" />
    </template>
    <template v-if="layout.config.settings.layout === 'wide'" #menuHeaderRender>
      <div class="text-center">
        额外元素
      </div>
    </template>
    <template #rightContentRender>
      <RightContent :avatar="user.userInfo.avatar" :name="user.userInfo.nickName" @logout="userLogout" />
    </template>
    <template #pageLockRender>
      <PageLock :avatar="user.userInfo.avatar" :name="user.userInfo.nickName" />
    </template>
    <ProContent />
    <SettingDrawer
      weakmode
      show-progress
      :settings="layout.config.settings"
      @change="changeSettings"
      @layout-change="changeLayoutTheme"
    />
  </GProLayout>
</template>
