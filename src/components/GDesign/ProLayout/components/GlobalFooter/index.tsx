import { defineComponent, VNodeChild } from 'vue'
import { LayoutFooter } from 'ant-design-vue'
import { GithubOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'
import type { CopyrightRender } from '../../RenderTypings'

export type Links = WithFalse<
  {
    key?: string
    title: VNodeChild | JSX.Element
    href: string
    blankTarget?: boolean
  }[]
>

export interface GlobalFooterProps {
  links?: Links
  copyright?: VNodeChild | JSX.Element
  prefixCls?: string
}

export const defaultLinks = [
  {
    key: 'Ant Design Pro',
    title: 'Ant Design Pro',
    href: 'https://pro.ant.design',
    blankTarget: true
  },
  {
    key: 'gitee',
    title: <GithubOutlined />,
    href: 'https://gitee.com/gx12358/vue-antd-admin',
    blankTarget: true
  },
  {
    key: 'Ant Design Vue',
    title: 'Ant Design Vue',
    href: 'https://next.antdv.com/components/overview-cn/',
    blankTarget: true
  }
]

export default defineComponent({
  name: 'GlobalFooter',
  props: {
    links: {
      type: [Array, Boolean] as PropType<Links>,
      default: defaultLinks
    },
    copyright: {
      type: [Object, Function, Boolean, String] as PropType<CopyrightRender>,
      default: '皖ICP备2022010510号-1'
    }
  },
  setup(props) {
    const baseClassName = getPrefixCls({
      suffixCls: 'global-footer',
      isPor: true
    })

    return () => (
      <LayoutFooter style={{ padding: 0 }}>
        <div class={baseClassName}>
          {props.links && (
            <div class={`${baseClassName}-links`}>
              {props.links.map((link) => (
                <a
                  key={link.key}
                  title={link.key}
                  target={link.blankTarget ? '_blank' : '_self'}
                  href={link.href}
                >
                  {link.title}
                </a>
              ))}
            </div>
          )}
          {props.copyright && (
            <div class={`${baseClassName}-copyright`}>
              Copyright&nbsp;&nbsp;2022&nbsp;&nbsp;
              <a href="https://beian.miit.gov.cn/">{props.copyright}</a>
            </div>
          )}
        </div>
      </LayoutFooter>
    )
  }
})
