<script setup lang="ts">
import usePageContent from '@/hooks/web/usePageContent'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { reactive, ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  frameSrc: string;
}>(), {
  frameSrc: ''
})

const { count } = usePageContent()

const prefixCls = getPrefixCls({
  suffixCls: 'iframe-page',
  isPor: true
})

const frameRef = ref<HTMLIFrameElement>()
const loading = ref(true)

const frameStyle = reactive<CSSProperties>({
  height: `${window.innerHeight - count.value}px`,
  borderRadius: '8px'
})

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

const calcHeight = () => (frameStyle.height = `${window.innerHeight - count.value}px`)

onMounted(() => {
  window.addEventListener('resize', calcHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', calcHeight)
})

const hideLoading = () => {
  loading.value = false
}
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <div :class="prefixCls" :style="frameStyle">
      <a-spin :spinning="loading" size="large" :style="frameStyle">
        <iframe
          ref="frameRef"
          :src="frameSrc"
          :class="[`${prefixCls}-main`]"
          :style="frameStyle"
          @load="hideLoading"
        />
      </a-spin>
    </div>
  </g-pro-page-container>
</template>
