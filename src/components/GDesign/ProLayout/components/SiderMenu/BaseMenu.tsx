import {
  defineComponent,
  VNodeChild,
  VNode,
  computed,
  isVNode,
  resolveComponent,
  ExtractPropTypes,
  ConcreteComponent
} from 'vue'
import { useRouter } from 'vue-router'
import { Menu } from 'ant-design-vue'
import { createFromIconfontCN } from '@ant-design/icons-vue'
import { baseMenuProps } from './props'
import { defaultSettings } from '../../defaultSettings'
import { isImg, isUrl } from '../../utils'

export interface CustomMenuRender {
  menuItemRender?: WithFalse<
    (args: { item: AppRouteModule; title?: JSX.Element; icon?: JSX.Element }) => CustomRender
  >
  subMenuItemRender?: WithFalse<
    (args: { item: AppRouteModule; children?: CustomRender[] }) => CustomRender
  >
}

export type BaseMenuProps = ExtractPropTypes<typeof baseMenuProps>

const IconFont: any = (iconfontUrl) => {
  return createFromIconfontCN({
    scriptUrl: iconfontUrl || defaultSettings.iconfontUrl
  })
}

const LazyIcon = (props: {
  icon: VNodeChild | string
  iconType?: number
  iconfontUrl?: string
}) => {
  const { icon, iconType, iconfontUrl } = props
  if (!icon) {
    return null
  }
  if (typeof icon === 'string' && icon !== '') {
    if (isUrl(icon) || isImg(icon)) {
      return <img src={icon} alt="icon" class={`gx-pro-sider-menu-icon customimg`} />
    }
    if (iconType === 1) {
      return iconfontUrl ? <IconFont type={icon} /> : <i class={`iconfont ${icon} customicon`}></i>
    }
  }
  if (isVNode(icon)) {
    return icon
  }
  const DynamicIcon = resolveComponent(icon as string) as any
  return (typeof LazyIcon === 'function' && <DynamicIcon />) || null
}

LazyIcon.props = {
  icon: {
    type: [String, Function, Object] as PropType<string | Function | VNode | JSX.Element>
  },
  iconType: Number,
  iconfontUrl: String
}

export default defineComponent({
  name: 'BaseMenu',
  props: baseMenuProps,
  emits: ['update:openKeys', 'update:selectedKeys', 'click'],
  setup(props, { attrs, emit }) {
    const router = useRouter()
    const handleOpenChange = (openKeys: string[]): void => {
      emit('update:openKeys', openKeys)
    }
    const handleSelect = (params: {
      key: string | number
      keyPath: string[] | number[]
      item: VNodeChild | any
      domEvent: MouseEvent
      selectedKeys: string[]
    }): void => {
      emit('update:selectedKeys', params.selectedKeys)
    }
    const handleClick = (args: {
      item: VNodeChild
      key: string | number
      keyPath: string | string[] | number | number[]
    }) => {
      emit('click', args)
    }
    const isTotargetLink = (meta: any, routerInfo: any) => {
      const target = (meta.target || '') as string
      const hasUrl = isUrl(target)
      if (router.currentRoute.value?.fullPath !== routerInfo.to) {
        if (hasUrl && target && meta.targetStatus === 1) {
          window.open(target)
        }
      }
    }
    const RouterLink = resolveComponent('router-link') as ConcreteComponent
    const getNavMenuItems = (menusData: AppRouteModule[] = []) => {
      return menusData.map((item) => getSubMenuOrItem(item)).filter((item) => item)
    }
    const getSubMenuOrItem = (item: AppRouteModule): VNode => {
      if (
        Array.isArray(item.children) &&
        item.children.length > 0 &&
        !item?.meta?.hideInMenu &&
        !item?.meta?.hideChildrenInMenu
      ) {
        if (props.subMenuItemRender) {
          return props.subMenuItemRender({
            item,
            children: getNavMenuItems(item.children)
          }) as VNode
        }
        const menuTitle = item.meta?.title
        const defaultTitle = item.meta?.icon ? (
          <span class={`gx-pro-sider-menu-item`}>
            <span class={`gx-pro-sider-menu-item-title`}>{menuTitle}</span>
          </span>
        ) : (
          <span class={`gx-pro-sider-menu-item`}>{menuTitle}</span>
        )

        const hasGroup = item.meta?.type === 'group'

        const MenuComponent = hasGroup ? Menu.ItemGroup : Menu.SubMenu

        return (
          <MenuComponent
            title={defaultTitle}
            key={item.path}
            icon={
              hasGroup ? null : (
                <LazyIcon
                  icon={item.meta?.icon}
                  iconfontUrl={props.iconfontUrl}
                  iconType={item.meta?.iconType}
                />
              )
            }
          >
            {getNavMenuItems(item.children)}
          </MenuComponent>
        )
      }

      const [title, icon] = getMenuItem(item)

      return (
        ((props.menuItemRender && props.menuItemRender({ item, title, icon })) as VNode) || (
          <Menu.Item
            disabled={item.meta?.disabled}
            danger={item.meta?.danger}
            key={item.path}
            icon={icon}
          >
            {title}
          </Menu.Item>
        )
      )
    }
    const getMenuItem = (item: AppRouteModule) => {
      const meta = { ...item.meta }
      const CustomTag: any = meta.targetStatus === 1 && meta.target ? 'a' : RouterLink
      const parames = { to: item.linkPath || item.path || '' }
      if (parames.to === '/live/list/operation/:id') parames.to = '/live/list/operation/add'

      const menuTitle = item.meta?.title
      const defaultTitle = item.meta?.icon ? (
        <CustomTag
          {...parames}
          class={`gx-pro-sider-menu-item`}
          onClick={() => isTotargetLink(meta, parames)}
        >
          <span class={`gx-pro-sider-menu-item-title`}>{menuTitle}</span>
        </CustomTag>
      ) : (
        <CustomTag
          {...parames}
          class={`gx-pro-sider-menu-item`}
          onClick={() => isTotargetLink(meta, parames)}
        >
          <span>{menuTitle}</span>
        </CustomTag>
      )

      const icon =
        (item.meta?.icon && (
          <LazyIcon
            icon={item.meta?.icon}
            iconfontUrl={props.iconfontUrl}
            iconType={item.meta?.iconType}
          />
        )) ||
        undefined

      return [defaultTitle, icon]
    }
    const getMenuItems = computed(() => {
      return getNavMenuItems(props.menuData)
    })
    return () => (
      <Menu
        key="Menu"
        inlineIndent={16}
        mode={props.mode}
        theme={props.theme as 'dark' | 'light'}
        openKeys={props.openKeys === false ? [] : props.openKeys}
        selectedKeys={props.selectedKeys || []}
        style={attrs.style}
        class={attrs.class}
        onOpenChange={handleOpenChange}
        onSelect={handleSelect}
        onClick={handleClick}
        {...props.menuProps}
      >
        {getMenuItems.value}
      </Menu>
    )
  }
})
