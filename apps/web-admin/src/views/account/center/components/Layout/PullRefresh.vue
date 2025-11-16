<script setup lang="ts">
import { useEventListener } from '@vueuse/core'

const props = defineProps<{
  scrollY: number;
}>()

const emit = defineEmits<{
  (e: 'refresh', callback: () => void): void
}>()

function getDirection(x: number, y: number) {
  if (x > y) {
    return 'horizontal'
  }
  if (y > x) {
    return 'vertical'
  }
  return ''
}

const touchRef = ref()

const touchState = reactive({
  isTap: true,
  status: 'ready' as 'ready' | 'pulling' | 'loosing' | 'loading',
  loadingHeight: 50,
  moveValue: 0,
  startXValue: 0,
  startYValue: 0,
  maxValue: 80,
  direction: '' as '' | 'vertical' | 'horizontal'
})

const isMoved = computed(() => [ 'pulling', 'loosing' ].includes(touchState.status) && touchState.direction === 'vertical' && touchState.moveValue > 0)
const isVertical = computed(() => [ 'pulling', 'loosing', 'loading' ].includes(touchState.status) && touchState.direction === 'vertical' && touchState.moveValue > 0)

const touchStyle = computed(() => ({
  transitionDuration: isMoved.value ? '0ms' : '300ms',
  transform: isVertical.value ? `translate3d(0, ${touchState.moveValue}px, 0)` : undefined
}))

const clearTouchState = () => {
  touchState.status = 'ready'
  touchState.moveValue = 0
  touchState.direction = ''
  touchState.startYValue = 0
  touchState.startXValue = 0
}

const ease = (distance: number) => {
  const pullDistance = +(touchState.maxValue || touchState.loadingHeight)
  if (distance > pullDistance) {
    if (distance < pullDistance * 2) {
      distance = pullDistance + (distance - pullDistance) / 2
    } else {
      distance = pullDistance * 1.5 + (distance - pullDistance * 2) / 4
    }
  }
  return Math.round(distance)
}

useEventListener(touchRef, 'mousedown', (e) => {
  if (touchState.status === 'ready' && props.scrollY === 0) {
    touchState.direction = ''
    touchState.status = 'pulling'
    touchState.startXValue = e.clientX
    touchState.startYValue = e.clientY
  }
})

useEventListener(document, 'mousemove', (e) => {
  if ([ 'pulling', 'loosing' ].includes(touchState.status)) {
    const deltaX = (e.clientX < 0 ? 0 : e.clientX) - touchState.startXValue
    const deltaY = e.clientY - touchState.startYValue
    const offsetX = Math.abs(deltaX)
    const offsetY = Math.abs(deltaY)
    const LOCK_DIRECTION_DISTANCE = 10
    if (
      !touchState.direction || (offsetX < LOCK_DIRECTION_DISTANCE && offsetY < LOCK_DIRECTION_DISTANCE)
    ) {
      touchState.direction = getDirection(offsetX, offsetY)
    }
    if (touchState.isTap && (offsetX > 5 || offsetY > 5)) {
      touchState.isTap = false
    }
    if (deltaY >= 0 && touchState.direction === 'vertical') {
      e.preventDefault()
      e.stopPropagation()
      const pullDistance = +(touchState.loadingHeight)
      touchState.status = deltaY < pullDistance ? 'pulling' : 'loosing'
      touchState.moveValue = ease(deltaY)
    }
  }
})

useEventListener(document, 'mouseup', () => {
  if ([ 'pulling', 'loosing' ].includes(touchState.status)) {
    if (touchState.status === 'pulling') {
      clearTouchState()
    } else {
      touchState.status = 'loading'
      touchState.moveValue = ease(+touchState.loadingHeight)
      emit('refresh', clearTouchState)
    }
  }
})
</script>

<template>
  <div
    ref="touchRef"
    :style="touchStyle"
    :class="isVertical ? 'select-none' : ''"
  >
    <div class="pull-header flex-center mb-[-16px]">
      <template v-if="isVertical">
        <g-spin v-if="touchState.status === 'loading'" :icon-style="{ fontSize: '20px' }" />
        <span v-if="isMoved" class="text-hex-ccc">
          {{ `${touchState.status === 'pulling' ? '下拉' : '释放'}既可刷新...` }}
        </span>
      </template>
    </div>
    <slot />
  </div>
</template>

<style scoped lang="less">
.pull-header {
  position: absolute;
  height: 50px;
  left: 0;
  width: 100%;
  text-align: center;
  z-index: 10;
  transform: translateY(-100%);
}
</style>
