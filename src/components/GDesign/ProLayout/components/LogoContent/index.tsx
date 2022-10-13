import type { CSSProperties, ExtractPropTypes } from 'vue'
import { computed, defineComponent } from 'vue'
import Logo from '@/assets/logo.png'
import { useMemo } from '@gx-admin/hooks/core'
import logoContentProps from './props'
import { useRouteContext } from '../../RouteContext'

export type LogoContentProps = Partial<ExtractPropTypes<typeof logoContentProps>>

export const defaultRenderLogo = (logo?: CustomRender, logoStyle?: CSSProperties): CustomRender => {
  if (!logo) {
    return null
  }
  if (typeof logo === 'string') {
    return <img src={logo} alt="logo" style={logoStyle} />
  }
  if (typeof logo === 'function') {
    return logo()
  }
  return logo
}

export const defaultRenderLogoAndTitle = (
  props: LogoContentProps,
  renderKey: string | undefined = 'menuHeaderRender'
) => {
  const { logo = Logo, logoStyle, title } = props
  const renderFunction = (props as any)[renderKey || '']
  if (renderFunction === false) {
    return null
  }

  const logoDom = defaultRenderLogo(logo, logoStyle)
  const titleDom = title && <h1>{title}</h1>

  if (typeof renderFunction === 'function') {
    return renderFunction(logoDom, props.collapsed ? null : titleDom, props)
  }

  return (
    <>
      {logoDom || null}
      {props.collapsed ? null : titleDom}
    </>
  )
}

const LogoContent = defineComponent({
  name: 'LogoContent',
  props: logoContentProps,
  setup(props) {
    const context = useRouteContext()

    const layoutSide = computed(() => props.layout === 'side' || props.layout === 'simple')

    const baseClassName = computed(() =>
      context.getPrefixCls({
        suffixCls: layoutSide.value || props.drawer ? 'sider' : 'global-header',
        isPor: true
      })
    )

    const headerDom = useMemo(() => defaultRenderLogoAndTitle(props, props.renderKey))

    return () => (
      <div
        id="logo"
        class={{
          [`${baseClassName.value}-logo`]: true,
          [`${baseClassName.value}-logo-${props.logoDirection}`]: layoutSide.value
        }}
        onClick={props.onMenuHeaderClick}
      >
        <a>{headerDom.value || null}</a>
      </div>
    )
  }
})

LogoContent.inheritAttrs = false

export default LogoContent
