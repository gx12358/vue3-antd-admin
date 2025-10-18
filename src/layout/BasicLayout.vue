<script setup lang="ts">
import type { DeepPartial, ProAliasToken } from '@gx-design-vue/pro-provider'
import { BellOutlined } from '@ant-design/icons-vue'
import { GProLayout, useLayoutMenu } from '@gx-design-vue/pro-layout'
import { GAppsLogoComponents, GProThemeEditor, GRightContent } from '@gx-design-vue/pro-layout-components'
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { appList } from '@/common'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { useStore } from '@/store'
import { layoutConfig } from '@/store/modules/layout'
import ProContent from './ContentView.vue'

const { theme, layout, user } = useStore()

const router = useRouter()

const collapsed = ref(false)
const themeConfigOpen = ref(false)

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

function changeSettingState(state: Partial<SystemLayoutConfig>) {
  layout.setValue({
    config: {
      settings: state
    }
  })
}

function changeThemeState(state: DeepPartial<ProAliasToken>) {
  layout.setValue({
    config: {
      token: state
    }
  })
}

const logout = (callBack?: any) => {
  globalConfirm({
    title: '温馨提醒',
    content: '是否确认退出系统?',
    okText: '确认',
    cancelText: '取消',
    onOk: () => {
      user.userLogout().then((_) => {}).finally(() => {
        location.reload()
        callBack?.()
      })
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
    <template #appsLogoComponents>
      <GAppsLogoComponents :app-list="appList" />
    </template>
    <template v-if="layout.config.settings.layout === 'wide'" #menuHeaderRender>
      <div class="text-center">
        额外元素
      </div>
    </template>
    <template #rightContentRender>
      <GRightContent :avatar="user.userInfo.avatar" @click-settings="themeConfigOpen = !themeConfigOpen" @logout="logout">
        <template #actionsRender="classNames">
          <div :class="classNames">
            <BellOutlined />
          </div>
        </template>
        <template #dropdownMenuExtraItemRender>
          <a-menu-item>
            <div class="flex items-center gap-16px">
              <a-avatar :src="user.userInfo.avatar" :size="40" />
              <div class="flex flex-col justify-between">
                <div class="flex items-center gap-10px">
                  <span>
                    {{ user.userInfo.nickName }}
                  </span>
                  <a-tag class="text-12px">
                    Pro
                  </a-tag>
                </div>
                <span class="text-muted-foreground text-12px">{{ user.userInfo.email }}</span>
              </div>
            </div>
          </a-menu-item>
          <a-menu-divider />
        </template>
      </GRightContent>
    </template>
    <ProContent />
    <GProThemeEditor
      v-model:open="themeConfigOpen"
      :extra-setting-state="{
        progress: layout.config.settings.progress,
        colorWeak: layout.config.settings.colorWeak,
      }"
      @change-theme-state="changeThemeState"
      @change-setting-state="changeSettingState"
    />
  </GProLayout>
</template>
