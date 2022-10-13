import { defineComponent, h } from 'vue'
import { Spin, SpinProps } from 'ant-design-vue'

export type PageLoadingProps = SpinProps

const PageLoading = defineComponent({
  name: 'PageLoading',
  props: {
    ...Spin.props
  },
  render() {
    return h(
      'div',
      { style: { paddingTop: '100px', textAlign: 'center' } },
      h(Spin, { ...this.$props })
    )
  }
})

export default PageLoading
