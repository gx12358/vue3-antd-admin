import {
  computed,
  defineComponent,
  reactive,
  watch,
  onMounted,
  toRefs,
  ExtractPropTypes
} from 'vue'
import { useStore } from '@gx-vuex'
import { useRoute, useRouter } from 'vue-router'
import { Tabs, Menu, Dropdown } from 'ant-design-vue'
import { EllipsisOutlined, ReloadOutlined, CloseOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import multiTabProps from './props'

const TabPane = Tabs.TabPane

export type MultiTabProps = Partial<ExtractPropTypes<typeof multiTabProps>>

export default defineComponent({
  props: multiTabProps,
  components: {
    EllipsisOutlined,
    ReloadOutlined,
    CloseOutlined
  },
  setup(props) {
    const { isMobile, loading, isFixedMultiTab, onReloadPage } = toRefs(props)
    const $route = useRoute()
    const router = useRouter()
    const store = useStore()
    const { routesWhiteList } = config.defaultSettings
    const state = reactive({
      affixTabs: [],
      reloadSpin: false,
      tabActive: '',
      tabContextActive: ''
    })
    const routes = computed(() => store.routes.routes)
    const visitedRoutes = computed(() => store.tabsRouter.visitedRoutes)
    const needFixedMultiTab = computed(() => isFixedMultiTab.value)
    const needSettingWidth = computed(() => needFixedMultiTab.value && !isMobile.value)
    const width = computed(() => {
      return needSettingWidth.value
        ? `calc(100% - ${props.collapsed ? props.collapsedWidth : props.siderWidth}px)`
        : '100%'
    })
    const right = computed(() => (needFixedMultiTab.value ? 0 : undefined))
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 初始化添加固定标签
     */
    const initAffixTabs = (routes) => {
      routes.forEach((route) => {
        if (route.meta && route.meta.tagFixed) addTabs(route)
        if (route.children) initAffixTabs(route.children)
      })
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 添加标签路由
     */
    const addTabs = async (tag) => {
      if (
        tag.name &&
        tag.meta &&
        tag.meta.tagHidden !== true &&
        !routesWhiteList.includes(tag.path)
      ) {
        let matched = [tag.name]
        if (tag.matched) matched = tag.matched.map((item) => item.name)
        await store.tabsRouter.addVisitedRoute({
          tagFixed: tag.meta && tag.meta.tagFixed,
          path: tag.path,
          fullPath: tag.fullPath || tag.path,
          query: tag.query,
          params: tag.params,
          name: tag.name,
          matched: matched,
          meta: { ...tag.meta }
        })
        if (isActive(tag)) state.tabActive = tag.fullPath || tag.path
      }
    }
    onMounted(() => {
      initAffixTabs(routes.value)
    })
    watch(
      () => $route,
      (route) => {
        addTabs(route)
      },
      {
        deep: true,
        immediate: true
      }
    )
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 是否是当前页
     */
    const isActive = (route) => {
      return route.path === $route.path
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 当前页是否固定
     */
    const isFixed = (tag) => {
      return tag.meta && tag.meta.tagFixed
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 标签点击
     */
    const handleTabClick = (tab) => {
      const route = visitedRoutes.value.filter((item) => item.path === tab)[0]
      if ($route.fullPath !== route.fullPath) router.push(route.fullPath)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 标签删除
     */
    const handleTabRemove = async (e, fullPath) => {
      e.stopPropagation()
      const view = visitedRoutes.value.find((item) => {
        return fullPath === item.fullPath
      })
      await store.tabsRouter.delVisitedRoute(view)
      if (isActive(view)) toLastTag()
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 标签副操作点击
     */
    const handleClick = ({ key }, stateType) => {
      switch (key) {
        case 'closeOthersTabs':
          closeOthersTabs(stateType)
          break
        case 'closeLeftTabs':
          closeLeftTabs(stateType)
          break
        case 'closeRightTabs':
          closeRightTabs(stateType)
          break
        default:
          break
      }
    }
    const dropdownVisible = (path) => {
      state.tabContextActive = path
    }
    const tabBarExtraState = (type, path: any) => {
      const currentIndex = visitedRoutes.value.findIndex((item) => item.fullPath === path)
      let status = false
      switch (type) {
        case 1:
          status =
            visitedRoutes.value.length === 1 ||
            (visitedRoutes.value.findIndex((item) => item.meta.tagFixed) === 0 &&
              visitedRoutes.value.length === 2)
          break
        case 2:
          status =
            currentIndex === 0 ||
            (currentIndex === 1 &&
              visitedRoutes.value.findIndex((item) => item.meta.tagFixed) === 0)
          break
        case 3:
          status =
            currentIndex === visitedRoutes.value.length - 1 || visitedRoutes.value.length === 1
          break
      }
      return status
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 刷新当前路由
     */
    const reloadPage = () => {
      state.reloadSpin = true
      onReloadPage.value && onReloadPage.value()
      setTimeout(() => {
        state.reloadSpin = false
      }, 500)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭其他页
     */
    const closeOthersTabs = async (stateType) => {
      await store.tabsRouter.delOthersVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭左侧所有路由
     */
    const closeLeftTabs = async (stateType) => {
      await store.tabsRouter.delLeftVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 关闭右侧所有路由
     */
    const closeRightTabs = async (stateType) => {
      await store.tabsRouter.delRightVisitedRoutes(toThisTag(stateType))
      toContextTag(stateType)
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转上下路由
     */
    const toContextTag = (stateType) => {
      const currentPath = stateType === 'tabActive' ? $route.fullPath : state[stateType]
      if (stateType !== $route.fullPath) {
        router.push(currentPath)
      }
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转路由：/
     */
    const toLastTag = () => {
      const latestView = visitedRoutes.value.slice(-1)[0]
      if (latestView) router.push(latestView)
      else router.push('/')
    }
    /**
     * @Author      gx12358
     * @DateTime    2021/8/6
     * @lastTime    2021/8/6
     * @description 跳转点击页
     */
    const toThisTag = (stateType) => {
      const currentPath = stateType === 'tabActive' ? $route.fullPath : state[stateType]
      const view = visitedRoutes.value.find((item) => item.fullPath === currentPath)
      if (currentPath !== view?.path || '') router.push(view)
      return view
    }

    const defaultRenderTabMenu = (record) => (
      <Menu onClick={(e) => handleClick(e, 'tabContextActive')}>
        <Menu.Item
          disabled={tabBarExtraState(1, record.fullPath || record.path)}
          key="closeOthersTabs"
        >
          关闭其他
        </Menu.Item>
        <Menu.Item
          disabled={tabBarExtraState(2, record.fullPath || record.path)}
          key="closeLeftTabs"
        >
          关闭左侧
        </Menu.Item>
        <Menu.Item
          disabled={tabBarExtraState(3, record.fullPath || record.path)}
          key="closeRightTabs"
        >
          关闭右侧
        </Menu.Item>
      </Menu>
    )

    const defaultRenderTab = (record) => (
      <Dropdown
        trigger="contextmenu"
        overlay={defaultRenderTabMenu(record)}
        onVisibleChange={(_) => dropdownVisible(record.fullPath)}
      >
        <div class="gx-pro-multi-tab-content">
          {record.meta.title}
          {state.tabActive === (record.fullPath || record.path) && (
            <ReloadOutlined
              class="gx-pro-multi-tab-reload-btn"
              style={{ marginRight: 0 }}
              spin={state.reloadSpin}
              onClick={() => {
                state.reloadSpin ? null : reloadPage()
              }}
            />
          )}
          {visitedRoutes.value.length > 1 && !isFixed(record) && (
            <CloseOutlined
              class="gx-pro-multi-tab-close-btn"
              style={{ marginRight: 0 }}
              onClick={(e) => handleTabRemove(e, record.fullPath)}
            />
          )}
        </div>
      </Dropdown>
    )

    const defaultExtraMenu = () => (
      <Menu onClick={(e) => handleClick(e, 'tabActive')}>
        <Menu.Item disabled={tabBarExtraState(1, state.tabActive)} key="closeOthersTabs">
          关闭其他
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(2, state.tabActive)} key="closeLeftTabs">
          关闭左侧
        </Menu.Item>
        <Menu.Item disabled={tabBarExtraState(3, state.tabActive)} key="closeRightTabs">
          关闭右侧
        </Menu.Item>
      </Menu>
    )

    const tabBarExtraContent = () => (
      <Dropdown overlay={defaultExtraMenu()}>
        <EllipsisOutlined class="gx-pro-multi-tab-dropdown-menu-btn" rotate={90} />
      </Dropdown>
    )

    return () => (
      <>
        {props.isFixedMultiTab && (
          <div
            class={{
              ['gx-pro-multi-tab-fixed']: true,
              ['gx-pro-multi-tab-fixed-loading']: loading.value
            }}
          />
        )}
        <div
          style={{
            margin: 0,
            width: width.value,
            right: right.value,
            zIndex: 99
          }}
          class={{
            ['gx-pro-multi-tab']: true,
            ['gx-pro-multi-tab-wrap']: props.isFixedMultiTab,
            ['gx-pro-multi-tab-wrap-fixed']: props.isFixedMultiTab,
            ['gx-pro-multi-tab-wrap-loading']: loading.value
          }}
        >
          <Tabs
            onTabClick={handleTabClick}
            activeKey={state.tabActive}
            hideAdd
            type="editable-card"
            v-slots={{
              rightExtra: (_) => tabBarExtraContent()
            }}
          >
            {visitedRoutes.value.map((item) => (
              <TabPane key={item.fullPath} closable={false} tab={defaultRenderTab(item)} />
            ))}
          </Tabs>
        </div>
      </>
    )
  }
})
