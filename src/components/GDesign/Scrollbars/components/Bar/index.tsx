import type { ExtractPropTypes } from 'vue'
import { defineComponent, ref } from 'vue'
import { barProps } from './props'
import Thumb from '../Thumb'

export type BarProps = ExtractPropTypes<typeof barProps>

const Bar = defineComponent({
  props: barProps,
  setup(props) {
    const moveX = ref(0)
    const moveY = ref(0)
    const GAP = 4

    const handleScroll = (wrap: HTMLDivElement) => {
      if (wrap) {
        const offsetHeight = wrap.offsetHeight - GAP
        const offsetWidth = wrap.offsetWidth - GAP

        moveY.value = ((wrap.scrollTop * 100) / offsetHeight) * props.ratioY
        moveX.value = ((wrap.scrollLeft * 100) / offsetWidth) * props.ratioX
      }
    }

    return {
      moveX,
      moveY,
      handleScroll
    }
  },
  render() {
    return (
      <>
        <Thumb
          className={this.className}
          move={this.moveX}
          ratio={this.ratioX}
          size={this.width}
          always={this.always}
        />
        <Thumb
          className={this.className}
          move={this.moveY}
          ratio={this.ratioY}
          size={this.height}
          vertical
          always={this.always}
        />
      </>
    )
  }
})

Bar.inheritAttrs = false

export default Bar
