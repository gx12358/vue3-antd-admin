<script setup lang="ts">
import { useRouter } from 'vue-router'
import { isFunction, isString, merge } from '@gx-design-vue/pro-utils'
import type { BaseLayoutDesignToken, ThemeConfig } from '@gx-design-vue/pro-provider'
import type { AppRouteModule, BasicLayoutProps } from '@gx-design-vue/pro-layout'
import {
  GProLayout,
  SettingDrawer,
  clearMenuItem,
  getMatchedList,
  getMenuData,
  getMenuFirstLastChildPath,
  hanlePathKey,
} from '@gx-design-vue/pro-layout'
import RightContent from '@/components/GlobalLayout/RightContent'
import ProContent from './ContentView.vue'

const { global } = useStore()
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
    const path = getMenuFirstLastChildPath(menuItem.meta?.hideChildrenInMenu ? [] : menuItem.children || [])
    return {
      path: path ? isString(menuItem.redirect) ? menuItem.redirect as string : isFunction(menuItem.redirect)
        ? (menuItem.redirect as any)?.() as string
        : '' || menuItem.path : '',
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

const changeTheme = (newVal: ThemeConfig) => {
  global.settings.layout = merge(global.settings.layout, { ...newVal })
}

const changeLayoutTheme = (newVal: BaseLayoutDesignToken) => {
  global.settings.layout.token = merge(global.settings.layout.token, { ...newVal })
}
</script>

<template>
  <GProLayout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="global.settings.layout as BasicLayoutProps"
    :breadcrumb="{ routes: breadcrumbRouters }"
    :menu-data="menuState.menuData as AppRouteModule[]"
    @changeTabs="changeTabs"
    @reloadPage="handleReload"
    @menuHeaderClick="() => router.push('/')"
  >
    <template v-if="global.settings.layout.layout === 'wide'" #menuExtraRender>
      <div class="text-center"> 额外元素</div>
    </template>
    <template #rightContentRender>
      <RightContent />
    </template>
    <ProContent :animate="global.settings.layout.animate" :reloadStatus="reloadStatus" />
    <SettingDrawer :settings="global.settings.layout" @change="changeTheme" @changeLayout="changeLayoutTheme" weakmode show-progress />
  </GProLayout>
</template>
