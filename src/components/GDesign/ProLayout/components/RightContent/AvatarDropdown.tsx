import type { FunctionalComponent as FC, VNode } from 'vue'
import { cloneVNode } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Dropdown, Menu, Avatar } from 'ant-design-vue'
import { LogoutOutlined, UserOutlined } from '@ant-design/icons-vue'
import type { ExtraRightDropdownRender } from '../../RenderTypings'
import { useRouteContext } from '../../RouteContext'

export type AvatarDropdownProps = {
  extra?: ExtraRightDropdownRender
  onLogout?: () => void
  avatar?: string
  userName?: string
}

const AvatarDropdown: FC<AvatarDropdownProps> = (props: AvatarDropdownProps) => {
  const { extra, onLogout, avatar, userName } = props

  const context = useRouteContext()

  const baseClassName = context.getPrefixCls({
    suffixCls: 'header-right',
    isPor: true
  })

  return (
    <Dropdown
      overlay={
        <Menu class={`${baseClassName}-menu`}>
          {extra &&
            (extra as VNode[]).map((child: VNode, index) => {
              const newChild = cloneDeep(child)
              const handleChildClick = child?.['props']?.onClick
              if (child?.['props']?.onClick) delete child?.['props']?.onClick
              return (
                <Menu.Item key={index} onClick={() => handleChildClick()}>
                  {cloneVNode(newChild)}
                </Menu.Item>
              )
            })}
          <Menu.Item key={extra ? (extra as VNode[]).length : 0} onClick={onLogout}>
            <a href="javascript:">
              <LogoutOutlined />
              <span>退出登录</span>
            </a>
          </Menu.Item>
        </Menu>
      }
    >
      <span class={[`${baseClassName}-action`, `${baseClassName}-account`]}>
        <Avatar
          src={avatar}
          icon={<UserOutlined />}
          size="small"
          class={`${baseClassName}-avatar`}
        />
        <span class={[`${baseClassName}-name`, 'anticon']}>{userName}</span>
      </span>
    </Dropdown>
  )
}

export default AvatarDropdown
