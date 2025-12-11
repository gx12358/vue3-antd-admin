import type { CustomRender, WithFalse } from '@gx-design-vue/pro-utils'
import type { CSSProperties, SlotsType } from 'vue'
import { getSlotsProps } from '@gx-design-vue/pro-utils'
import { Button, Result } from 'ant-design-vue'
import { defineComponent } from 'vue'

export type Status = '403' | '404' | '500'

const resultSubInfo: Record<Status, {
  title: string
  subTitle: string
}> = {
  '404': {
    title: '当前页面不存在...',
    subTitle: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
  },
  '403': {
    title: '您没有操作角色...',
    subTitle: '当前帐号没有操作角色,请联系管理员。',
  },
  '500': {
    title: '服务器错误...',
    subTitle: '服务器发生错误，请检查服务器配置。',
  },
}

const GAdminResult = defineComponent({
  name: 'GAdminResult',
  inheritAttrs: false,
  props: {
    status: {
      type: String as PropType<'403' | '404' | '500'>,
      required: true,
      default: '404'
    },
    title: {
      type: String as PropType<string>,
    },
    icon: {
      type: String as PropType<string>,
    },
    id: {
      type: String as PropType<string>,
    },
    class: {
      type: String as PropType<string>,
    },
    style: {
      type: Object as PropType<CSSProperties>,
      default: () => ({}),
    },
    subTitle: {
      type: String as PropType<string>,
    },
    extra: {
      type: [String] as PropType<CustomRender>,
      default: undefined,
    },
  },
  slots: Object as SlotsType<{
    default: WithFalse<CustomRender>;
    extra: WithFalse<CustomRender>;
  }>,
  setup(props, { slots }) {
    const router = useRouter()
    const title = computed(() => props.title || resultSubInfo[props.status]?.title)
    const subTitle = computed(() => props.subTitle || resultSubInfo[props.status]?.subTitle)

    function backHome() {
      router.replace('/')
    }

    return () => {
      const renders = getSlotsProps({
        slots,
        props,
        render: true,
        keys: ['extra', 'default'],
      })
      return (
        <Result
          {...props}
          title={title.value}
          subTitle={subTitle.value}
          extra={(
            <>
              {renders.extra || (
                <Button onClick={() => backHome()} type="primary">返回首页</Button>
              )}
            </>
          )}
          v-slots={{
            default: renders.default,
          }}
        />
      )
    }
  }
})

export default GAdminResult
