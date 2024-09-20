import type { SpinProps } from 'ant-design-vue'
import { useProAppContext } from '@gx-design-vue/pro-app'
import { Spin } from 'ant-design-vue'
import { defineComponent, reactive } from 'vue'

export default defineComponent({
  name: 'GPageLoading',
  props: {
    loading: {
      type: Boolean,
      default: false
    },
    tip: {
      type: String,
      default: ''
    },
    size: {
      type: String as VuePropType<SpinProps['size']>,
      default: 'large'
    }
  },
  setup(props) {
    const { indicator } = useProAppContext()

    const style = reactive<CSSProperties>({
      textAlign: 'center',
      position: 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 0
    })
    const spinStyle = reactive({
      position: 'absolute',
      left: '50%',
      top: '50%',
      transform: 'translate(-50%, -50%)'
    })

    return () => (
      <>
        {props.loading ? (
          <div style={style} class="gx-admin-page-loading">
            <Spin size={props.size} style={spinStyle} tip={props.tip} indicator={indicator?.value} />
          </div>
        ) : null}
      </>
    )
  }
})
