<template>
  <transition
    v-if="!disabled"
    :enter-active-class="`animated ${enterAnimate} page-toggle-enter-active`"
    :leave-active-class="`animated ${leaveAnimate} page-toggle-leave-active`"
  >
    <slot></slot>
  </transition>
  <div v-else>
    <slot></slot>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import animates from '/config/default/animate'

export default defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    animate: {
      type: String,
      default: 'bounce'
    },
    direction: {
      type: String
    },
    reverse: {
      type: Boolean,
      default: true
    }
  },
  setup(props) {
    const enterAnimate = computed(() => {
      return activeClass(false)
    })
    const leaveAnimate = computed(() => {
      return activeClass(true)
    })
    const activeClass = (isLeave) => {
      let animate = animates.preset.find((item) => props.animate == item.name)
      if (animate == undefined) {
        return ''
      }
      let direction = ''
      if (props.direction == undefined) {
        direction = animate.directions[0]
      } else {
        direction = animate.directions.find((item) => item == props.direction)
      }
      direction = direction == undefined || direction === 'default' ? '' : direction
      if (direction != '') {
        direction =
          isLeave && props.reverse ? reversePosition(direction, animate.directions) : direction
        direction = direction[0].toUpperCase() + direction.substring(1)
      }
      let t = isLeave ? 'Out' : 'In'
      return animate.name + t + direction
    }
    const reversePosition = (direction, directions) => {
      if (direction.length == 0 || direction == 'x' || direction == 'y') {
        return direction
      }
      let index = directions.indexOf(direction)
      index = index % 2 == 1 ? index - 1 : index + 1
      return directions[index]
    }
    return {
      enterAnimate,
      leaveAnimate
    }
  }
})
</script>

<style lang="less">
.page-toggle-enter-active {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  animation-duration: 0.3s !important;
}

.page-toggle-leave-active {
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: transparent;
  animation-duration: 0.3s !important;
}
</style>
