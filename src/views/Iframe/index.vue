<template>
  <div :class="prefixCls" :style="getWrapStyle">
    <a-spin :spinning="loading" size="large" :style="getWrapStyle">
      <iframe
        :src="frameSrc"
        :class="[`${prefixCls}-main`]"
        ref="frameRef"
        @load="hideLoading"
      ></iframe>
    </a-spin>
  </div>
</template>

<script lang="ts" setup>
import { ref, unref, computed, onMounted, onUnmounted, watch } from 'vue'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '@/utils'

const props = defineProps({
  frameSrc: PropTypes.string.def('')
})

const prefixCls = getPrefixCls({
  suffixCls: 'iframe-page',
  isPor: true
})

const loading = ref(true)
const topRef = ref(48 + 24 * 5 + 30 + 52)
const frameRef = ref()
const heightRef = ref(window.innerHeight)

watch(
  () => props.frameSrc,
  (_) => {
    loading.value = true
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  window.addEventListener('resize', calcHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calcHeight)
})

const getWrapStyle = computed(() => {
  return {
    height: `${unref(heightRef)}px`
  }
})

const calcHeight = () => {
  const iframe = unref(frameRef)
  if (!iframe) {
    return
  }
  const top = 48 + 24 * 5 + 30 + 52
  topRef.value = top
  heightRef.value = window.innerHeight - top
  const clientHeight = document.documentElement.clientHeight - top
  iframe.style.height = `${clientHeight}px`
}

const hideLoading = () => {
  loading.value = false
  calcHeight()
}
</script>
