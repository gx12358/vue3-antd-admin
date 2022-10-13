import { computed, defineComponent, ExtractPropTypes, ref } from 'vue'
import { useMediaQuery } from '@gx-admin/hooks/event'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '@/utils'

import './style.less'

export const documentationProps = {
  anchorLinks: {
    type: Array as PropType<any[]>,
    default: () => []
  },
  contentStyle: PropTypes.style
}

export type DocumentationProps = Partial<ExtractPropTypes<typeof documentationProps>>

export default defineComponent({
  name: 'GDocumentation',
  props: documentationProps,
  setup() {
    const prefixCls = getPrefixCls({
      suffixCls: 'documentation'
    })

    const colSize = useMediaQuery()

    const anchor = ref()

    const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

    const classNames = computed(() => {
      return {
        [`${prefixCls}`]: true
      }
    })

    return {
      anchor,
      colSize,
      isMobile,
      classNames
    }
  },
  render() {
    const { classNames, isMobile } = this
    return (
      <div class={classNames} style={this.$props.contentStyle}>
        <g-anchor actionRef={(ref) => (this.anchor = ref)} links={this.$props.anchorLinks} />
        <div style={{ paddingRight: isMobile ? undefined : '208px' }}>
          {this.$slots.default?.()}
        </div>
      </div>
    )
  }
})
