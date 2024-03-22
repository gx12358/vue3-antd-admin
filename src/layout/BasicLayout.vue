<template>
  <GProLayout
    v-model:collapsed="baseState.collapsed"
    v-model:selectedKeys="baseState.selectedKeys"
    v-model:openKeys="baseState.openKeys"
    v-bind="state as BasicLayoutProps"
    :menu-data="menuState.menuData as AppRouteModule[]"
    :breadcrumb="{ routes: state.breadcrumb }"
    @changeTabs="changeTabs"
    @reloadPage="handleReload"
    @menuHeaderClick="() => router.push('/')"
  >
    <template v-if="state.layout === 'wide'" #menuExtraRender>
      <div class="text-center"> 额外元素</div>
    </template>
    <template #rightContentRender>
      <RightContent />
    </template>
    <ProContent :animate="store.global.animateSetting" :reloadStatus="reloadStatus" />
    <SettingDrawer :settings="state" @change="changeTheme" @changeLayout="changeLayoutTheme" weakmode show-progress />
  </GProLayout>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { cloneDeep } from 'lodash-es'
import logo from '@/assets/logo.png'
import { merge, isString, isFunction } from '@gx-design-vue/pro-utils'
import type { ThemeConfig, BaseLayoutDesignToken } from '@gx-design-vue/pro-provider'
import type { AppRouteModule, BasicLayoutProps, Route } from '@gx-design-vue/pro-layout'
import { themeConfig as proThemeConfig } from '@gx-design-vue/pro-provider'
import {
  GProLayout,
  SettingDrawer,
  getMenuData,
  hanlePathKey,
  clearMenuItem,
  getMatchedList,
  handleThemeConfig,
  getMenuFirstLastChildPath
} from '@gx-design-vue/pro-layout'
import RightContent from '@/components/GlobalLayout/RightContent'
import ProContent from './ContentView.vue'

const store = useStore()
const router = useRouter()

const reloadStatus = ref(true)

const routeData: AppRouteModule[] = router.getRoutes() as any

const themeConfig = reactive(cloneDeep({ ...proThemeConfig } as ThemeConfig))

const state = reactive({
  logo,
  breadcrumb: [],
  ...handleThemeConfig(themeConfig)
} as Omit<BasicLayoutProps, 'breadcrumb' | 'token'> & { breadcrumb: Route[]; token: any })

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

watch(() => state, (val) => {
  store.global.setGlobalData({
    settings: val as any
  })
}, { deep: true, immediate: true })

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
  () => router.currentRoute.value as any,
  (val: AppRouteModule) => {
    if (val) {
      handleMenuData()
      const breadcrumb: Route[] = matchedMenu.value.map((menuItem: AppRouteModule) => {
        const path = getMenuFirstLastChildPath(menuItem.meta?.hideChildrenInMenu ? [] : menuItem.children || [])
        return {
          path: path ? isString(menuItem.redirect) ? menuItem.redirect as string : isFunction(menuItem.redirect)
            ? (menuItem.redirect as any)?.() as string
            : '' || menuItem.path : '',
          breadcrumbName: menuItem.meta?.title || ''
        }
      })
      state.breadcrumb = cloneDeep(breadcrumb)
    }
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
  Object.assign(state, newVal)
  Object.assign(themeConfig, newVal)
  
  if (newVal.animate?.name) {
    store.global.setGlobalData({
      animateSetting: { ...newVal.animate }
    })
  }
}

const changeLayoutTheme = (newVal: BaseLayoutDesignToken) => {
  state.token = merge(state.token, { ...newVal })
}
</script>
