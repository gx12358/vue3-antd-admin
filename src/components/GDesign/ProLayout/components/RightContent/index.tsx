import { computed, defineComponent, createVNode } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { Modal, Space } from 'ant-design-vue'
import { LogoutOutlined, ExclamationCircleOutlined } from '@ant-design/icons-vue'
import config from '/config/config'
import { useStore } from '@gx-vuex'
import { globalHeaderProps } from '../GlobalHeader/props'
import HeaderSearch from './HeaderSearch'
import AvatarDropdown from './AvatarDropdown'
import NoticeIcon from '../NoticeIcon'
import { useRouteContext } from '../../RouteContext'

export default defineComponent({
  components: { LogoutOutlined },
  props: {
    theme: globalHeaderProps.theme,
    extra: globalHeaderProps.extraRightDropdownRender
  },
  setup(props) {
    const { recordRoute } = config.defaultSettings

    const context = useRouteContext()

    const baseClassName = context.getPrefixCls({
      suffixCls: 'header-right',
      isPor: true
    })

    const store = useStore()
    const route = useRoute()
    const router = useRouter()

    const avatar = computed(() => store.user.avatar)
    const userName = computed(() => store.user.loginName)

    const logout = () => {
      Modal.confirm({
        title: '温馨提醒',
        icon: createVNode(ExclamationCircleOutlined),
        content: '是否确认退出系统?',
        okText: '确认',
        cancelText: '取消',
        onOk() {
          return new Promise((resolve) => {
            setTimeout(resolve, 200)
            store.user.userLogut().then(() => {
              if (recordRoute) {
                const fullPath = route.fullPath
                router.push(`/user/login?redirect=${fullPath}`)
              } else {
                router.push({ path: '/user/login' })
              }
            })
          })
        },
        onCancel() {}
      })
    }

    return () => (
      <Space class={[baseClassName, props.theme]}>
        <HeaderSearch
          class={[`${baseClassName}-action`, `${baseClassName}-search`]}
          placeholder="站内搜索"
          defaultValue="Ant Design"
          options={[
            {
              label: <a href="https://umijs.org/zh/guide/umi-ui.html">umi ui</a>,
              value: 'umi ui'
            },
            {
              label: <a href="https://www.antdv.com/components/overview-cn">Ant Design</a>,
              value: 'Ant Design'
            },
            {
              label: <a href="https://protable.ant.design/">Pro Table</a>,
              value: 'Pro Table'
            },
            {
              label: <a href="https://prolayout.ant.design/">Pro Layout</a>,
              value: 'Pro Layout'
            }
          ]}
        />
        <NoticeIcon />
        <AvatarDropdown
          avatar={avatar.value}
          userName={userName.value}
          onLogout={logout}
          {...props}
        />
      </Space>
    )
  }
})
