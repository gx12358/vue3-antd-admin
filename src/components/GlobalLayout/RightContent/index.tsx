import { typeViteEnv } from '@/utils/env'
import { LogoutOutlined, QuestionCircleOutlined, UserOutlined } from '@ant-design/icons-vue'
import { useState } from '@gx-design-vue/pro-hooks'
import { useProLayoutContext } from '@gx-design-vue/pro-layout'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { useDebounceFn } from '@vueuse/core'
import { Avatar, Dropdown, Menu, MenuItem } from 'ant-design-vue'
import ResizeObserver from 'ant-design-vue/es/vc-resize-observer'
import { defineComponent } from 'vue'
import { useStyle } from './style'

export default defineComponent({
  name: 'GlobalRightContent',
  setup(_) {
    const store = useStore()
    const router = useRouter()
    const { theme, layout } = useProLayoutContext()

    const prefixCls = getPrefixCls({
      suffixCls: 'global-header',
      isPor: true
    })

    const [ logoutLoading, changeLoading ] = useState(false)
    const { wrapSSR, hashId } = useStyle(prefixCls)

    const layoutSide = computed(() => layout.value === 'side' || layout.value === 'simple')
    const hTheme = computed(() => (layoutSide.value && 'light') || theme.value)

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
          class={`${prefixCls}-right-content ${hTheme.value} ${hashId.value}`.trim()}
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
                    <div class="flex leading-26px">
                      <QuestionCircleOutlined onClick={() => window.open(typeViteEnv('VITE_HOME_PAGE_DOC'))} />
                    </div>
                  </div>
                  <div class={`${prefixCls}-header-actions-item ${hashId.value}`.trim()}>
                    <div class="flex leading-26px" onClick={() => window.open(typeViteEnv('VITE_GITHUB_PAGE'))}>
                      <i class="iconfont gx-github !text-18px text-hex-main" />
                    </div>
                  </div>
                  <div class={`${prefixCls}-header-actions-item ${hashId.value}`.trim()}>
                    <div class="flex leading-26px" onClick={() => window.open(typeViteEnv('VITE_GITEE_PAGE'))}>
                      <i class="iconfont gx-gitee text-hex-C71D23" />
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
