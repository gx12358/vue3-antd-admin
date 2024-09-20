<script setup lang="ts">
import type {
  AppRouteModule,
  BasicLayoutProps,
  MergerSettingsType
} from '@gx-design-vue/pro-layout'
import type { BaseLayoutDesignToken, ThemeConfig } from '@gx-design-vue/pro-provider'
import RightContent from '@/components/GlobalLayout/RightContent'
import {
  clearMenuItem,
  getMatchedList,
  getMenuData,
  getMenuFirstLastChildPath,
  GProLayout,
  hanlePathKey,
  SettingDrawer
} from '@gx-design-vue/pro-layout'
import { isFunction, isString, merge } from '@gx-design-vue/pro-utils'
import { useRouter } from 'vue-router'
import ProContent from './ContentView.vue'

const { global } = useStore()
const { globalLayout } = toRefs(global.state)

const router = useRouter()

const reloadStatus = ref(true)

const routeData: AppRouteModule[] = router.getRoutes() as any

const menuState = reactive<Pick<BasicLayoutProps, 'menuData' | 'levelMenuData'>>({
  menuData: [],
  levelMenuData: []
})

const baseState: Partial<BasicLayoutProps> = reactive({
  selectedKeys: [],
  openKeys: [],
  collapsed: false
})

const matchedMenu = computed(() => getMatchedList(
  menuState.levelMenuData as AppRouteModule[] || [],
  hanlePathKey(router.currentRoute.value as AppRouteModule)
))

const breadcrumbRouters = computed(() => {
  return matchedMenu.value.map((menuItem: AppRouteModule) => {
    const path = getMenuFirstLastChildPath(menuItem.meta?.hideChildrenInMenu
      ? []
      : menuItem.children || [])
    return {
      path: path ? isString(menuItem.redirect)
          ? menuItem.redirect as string
          : isFunction(menuItem.redirect)
            ? (menuItem.redirect as any)?.()
            : menuItem.path || ''
        : '',
      breadcrumbName: menuItem.meta?.title || ''
    }
  })
})

const handleMenuData = () => {
  const menuInfos = getMenuData(clearMenuItem(routeData))
  if (router.currentRoute?.value?.meta?.hideMenu) {
    menuState.menuData = []
    menuState.levelMenuData = []
  } else {
    menuState.menuData = menuInfos.menuData
    menuState.levelMenuData = menuInfos.levelMenuData
  }
}

watch(
  () => router.currentRoute.value,
  (val) => {
    if (val)
      handleMenuData()
  },
  { deep: true, immediate: true }
)

watchEffect(() => {
  if (router.currentRoute.value) {
    baseState.selectedKeys = matchedMenu.value.map(item => item.path)
    baseState.openKeys = matchedMenu.value.filter(item => item.path !== router.currentRoute.value.path)
      .map(item => item.path)
  }
})

const handleReload = () => {
  reloadStatus.value = false
  setTimeout(() => {
    reloadStatus.value = true
  }, 200)
}

const changeTabs = (_routers: any) => {
  // console.log(_routers)
}

const changeTheme = (newVal: MergerSettingsType<ThemeConfig>) => {
  merge(globalLayout.value, { ...newVal })
}

const changeLayoutTheme = (newVal: Partial<BaseLayoutDesignToken>) => {
  globalLayout.value.token = merge(globalLayout.value.token, { ...newVal })
}
</script>

<template>
  <GProLayout
    v-model:collapsed="baseState.collapsed"
    v-model:selected-keys="baseState.selectedKeys"
    v-model:open-keys="baseState.openKeys"
    v-bind="globalLayout as BasicLayoutProps"
    :breadcrumb="{ routes: breadcrumbRouters }"
    :menu-data="menuState.menuData as AppRouteModule[]"
    @change-tabs="changeTabs"
    @reload-page="handleReload"
    @menu-header-click="() => router.push('/')"
  >
    <template v-if="globalLayout.layout === 'wide'" #menuExtraRender>
      <div class="text-center">
        额外元素
      </div>
    </template>
    <template #rightContentRender>
      <RightContent />
    </template>
    <ProContent :animate="globalLayout.animate" :reload-status="reloadStatus" />
    <SettingDrawer :settings="globalLayout" weakmode show-progress @change="changeTheme" @change-layout="changeLayoutTheme" />
  </GProLayout>
</template>
