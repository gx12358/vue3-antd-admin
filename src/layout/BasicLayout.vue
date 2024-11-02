<script setup lang="ts">
import type { BasicLayoutProps, MergerSettingsType } from '@gx-design-vue/pro-layout'
import type { BaseLayoutDesignToken, ProLayoutConfig } from '@gx-design-vue/pro-provider'
import { appList } from '@/common'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import {
  AppsLogoList,
  GProLayout,
  PageLock,
  RightContent,
  SettingDrawer,
  useLayoutMenu
} from '@gx-design-vue/pro-layout'
import { useRouter } from 'vue-router'
import ProContent from './ContentView.vue'

const { layout, user } = useStore()

const router = useRouter()

const reloadStatus = ref(true)

const baseState: Partial<BasicLayoutProps> = reactive({
  selectedKeys: [],
  openKeys: [],
  collapsed: false
})

const { breadcrumbRouters, matchedKeys, menuState } = useLayoutMenu({})

const handleReload = () => {
  reloadStatus.value = false
  setTimeout(() => {
    reloadStatus.value = true
  }, 200)
}

const tabsChange = (_routers: any) => {
  // console.log(_routers)
}

const changeSettings = (value: MergerSettingsType<ProLayoutConfig>) => {
  layout.setValue({ settings: value })
}

const changeLayoutTheme = (value: Partial<BaseLayoutDesignToken>) => {
  layout.setValue({
    settings: {
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
    v-model:collapsed="baseState.collapsed"
    v-model:selected-keys="matchedKeys.selectedKeys"
    v-model:open-keys="matchedKeys.openKeys"
    v-bind="{ ...layout.settings, ...menuState }"
    :breadcrumb="{ routes: breadcrumbRouters }"
    @tabs-change="tabsChange"
    @reload-page="handleReload"
    @menu-header-click="() => router.push('/')"
  >
    <template #appLogoListRender>
      <AppsLogoList :app-list="appList" />
    </template>
    <template v-if="layout.settings.layout === 'wide'" #menuHeaderRender>
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
    <ProContent :animate="layout.settings.animate" :reload-status="reloadStatus" />
    <SettingDrawer
      weakmode
      show-progress
      :settings="layout.settings"
      @change="changeSettings"
      @layout-change="changeLayoutTheme"
    />
  </GProLayout>
</template>
