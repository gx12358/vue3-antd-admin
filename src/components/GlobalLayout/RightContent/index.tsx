import { defineComponent } from 'vue'
import { Avatar, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import { LogoutOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useDebounceFn } from '@vueuse/core'
import ResizeObserver from 'ant-design-vue/es/vc-resize-observer'
import { useState } from '@gx-design-vue/pro-hooks'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { useStyle } from './style'
import { typeViteEnv } from '@/utils/env'

export default defineComponent({
  name: 'GlobalRightContent',
  setup(_) {
    const store = useStore()
    const router = useRouter()

    const prefixCls = getPrefixCls({
      suffixCls: 'global-header',
      isPor: true
    })

    const [ logoutLoading, changeLoading ] = useState(false)
    const { wrapSSR, hashId } = useStyle(prefixCls)

    const [ rightSize, setRightSize ] = useState<number | string>('auto')

    /** 减少一下渲染的次数 */
    const setRightSizeDebounceFn = useDebounceFn(async (width: number) => {
      setRightSize(width)
    }, 160)

    const handleLogout = () => {
      changeLoading(true)
      store.user.userLogut().then((_) => {}).finally(() => {
        router.push({ path: '/user' })
        changeLoading(false)
      })
    }

    return () => {
      return wrapSSR(
        <div
          class={`${prefixCls}-right-content ${hashId.value}`.trim()}
          style={{
            minWidth: rightSize.value,
            height: '100%'
          }}
        >
          <div
            style={{
              height: '100%'
            }}
          >
            <ResizeObserver
              key="resize-observer"
              onResize={({ width }) => {
                setRightSizeDebounceFn(width)
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  height: '100%',
                  justifyContent: 'flex-end'
                }}
              >
                <div class={`${prefixCls}-header-actions ${hashId.value}`.trim()}>
                  <div class={`${prefixCls}-header-actions-item ${hashId.value}`.trim()}>
                    <div style={{ display: 'flex', height: '26px' }}>
                      <QuestionCircleOutlined onClick={() => window.open(typeViteEnv('VITE_HOME_PAGE_DOC'))} />
                    </div>
                  </div>
                  <div class={`${prefixCls}-header-actions-avatar ${hashId.value}`.trim()}>
                    <Dropdown
                      overlay={(
                        <Menu>
                          <MenuItem
                            key="logout"
                            icon={<LogoutOutlined />}
                            onClick={() => handleLogout()}
                            disabled={logoutLoading.value}
                          >
                            退出登录
                          </MenuItem>
                        </Menu>
                      )}
                    >
                      <div>
                        <Avatar
                          size={28}
                          icon={<UserOutlined />}
                          src={store.user.userInfo.avatar}
                        />
                        <div style={{ marginInlineStart: '8px' }}>
                          <span class="anticon">
                            {store.user.userInfo.nickName}
                          </span>
                        </div>
                      </div>
                    </Dropdown>
                  </div>
                </div>
              </div>
            </ResizeObserver>
          </div>
        </div>
      )
    }
  }
})
