<script setup lang="ts">
import type { ProLayoutExpose } from '@gx-design-vue/pro-layout'
import type { BaseLayoutDesignToken, ProLayoutConfig } from '@gx-design-vue/pro-provider'
import { AppsLogoList, GProLayout, PageLock, RightContent, SettingDrawer, useLayoutMenu } from '@gx-design-vue/pro-layout'
import { useTokenCssVar } from '@gx-design-vue/pro-provider'
import { useRouter } from 'vue-router'
import { appList } from '@/common'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { layoutConfig } from '@/store/modules/layout'
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
      settings: { siderWidth: val ? 0 : layoutConfig.siderWidth }
    }
  })
}, { immediate: true })

useTokenCssVar({
  colorSplit: '--gx-color-split',
  colorError: '--gx-color-error',
  colorErrorHover: '--gx-color-error',
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
      user.userLogout().then((_) => {}).finally(() => {
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
    @logo-click="() => router.push('/')"
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
