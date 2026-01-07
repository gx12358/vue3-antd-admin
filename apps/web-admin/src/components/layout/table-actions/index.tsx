import type { Fn } from '@gx/types'
import type { ButtonProps } from 'ant-design-vue'
import type { CSSProperties, PropType } from 'vue'
import {
  DeleteOutlined,
  DownloadOutlined,
  EllipsisOutlined,
  FormOutlined,
  PlusOutlined,
  UploadOutlined
} from '@ant-design/icons-vue'
import { classNames, isBoolean } from '@gx-design-vue/pro-utils'
import { Button, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { defineComponent } from 'vue'
import { useAuth } from '@/hooks/system'

export type TableActionsType = 'update' | 'text' | 'danger' | 'create' | 'import' | 'export'

export interface TableActionsRow {
  label: string;
  class?: string;
  style?: CSSProperties;
  type?: TableActionsType;
  buttonProps?: ButtonProps;
  icon?: any;
  auth?: string | boolean;
  visible?: boolean;
  onClick?: Fn;
  children?: TableActionsRow[];
}

const TableActions = defineComponent({
  name: 'TableActions',
  inheritAttrs: false,
  props: {
    actions: {
      type: Array as PropType<TableActionsRow[]>,
      default: () => []
    },
    showEmpty: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  },
  setup(props) {
    const defaultIcon: Partial<Record<TableActionsType, any>> = {
      update: <FormOutlined />,
      danger: <DeleteOutlined />,
      create: <PlusOutlined />,
      import: <UploadOutlined />,
      export: <DownloadOutlined />,
    }

    const { hasAuth } = useAuth()

    const authActions = computed(() => {
      return props.actions.filter((item) => {
        if (isBoolean(item.visible)) return item.visible
        if (isBoolean(item.auth)) return item.auth

        item.children = item.children?.filter((child) => {
          if (isBoolean(item.visible)) return item.visible

          return isBoolean(child.auth)
            ? child.auth
            : !child.auth || hasAuth(child.auth)
        })

        return item.auth && hasAuth(item.auth)
          ? true
          : item.children
            ? item.children?.length > 0
            : true
      })
    })

    const renderIcon = (icon: any, type: TableActionsType) => {
      return icon !== false && (icon || defaultIcon[type])
    }

    return () => {
      if (authActions.value.length) {
        return (
          <div class="gx-pro-actions">
            {
              authActions.value.map((item) => {
                const ChildCom: any = item.buttonProps ? Button : 'div'

                if (item.children && item.children.length > 0) {
                  const moreIcon = item.icon !== false && (item.icon || <EllipsisOutlined class="transform-rotate-90" />)
                  return (
                    <Dropdown
                      overlay={(
                        <Menu>
                          {
                            item.children.map((child) => {
                              return (
                                <MenuItem
                                  key={child.label}
                                  onClick={child.onClick}
                                  icon={renderIcon(child.icon, child.type ?? 'text')}
                                >
                                  <span>{child.label}</span>
                                </MenuItem>
                              )
                            })
                          }
                        </Menu>
                      )}
                    >
                      <ChildCom
                        key={item.type}
                        class={classNames(item.class, !item.buttonProps && (['gx-pro-actions-item flex items-center gap-2px', item.type]))}
                        style={item.style}
                        {...item.buttonProps}
                      >
                        <span>{item.label}</span>
                        {item.buttonProps ? <span class="ml-8px">{moreIcon}</span> : moreIcon}
                      </ChildCom>
                    </Dropdown>
                  )
                }

                return (
                  <ChildCom
                    key={item.type}
                    class={classNames(item.class, !item.buttonProps && (['gx-pro-actions-item flex items-center gap-4px', item.type]))}
                    style={item.style}
                    {...item.buttonProps}
                    onClick={item.onClick}
                    icon={item.buttonProps && renderIcon(item.icon, item.type ?? 'text')}
                  >
                    {!item.buttonProps && renderIcon(item.icon, item.type ?? 'text')}
                    <span>{item.label}</span>
                  </ChildCom>
                )
              })
            }
          </div>
        )
      }

      return null
    }
  }
})

export default TableActions
