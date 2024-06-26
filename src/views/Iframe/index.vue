<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { ref, watch } from 'vue'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { useProConfigContext } from '@gx-design-vue/pro-provider'

const props = withDefaults(defineProps<{
  frameSrc: string;
}>(), {
  frameSrc: ''
})

const { global } = useStore()
const { token } = useProConfigContext()

const prefixCls = getPrefixCls({
  suffixCls: 'iframe-page',
  isPor: true
})

const frameRef = ref<HTMLIFrameElement>()
const loading = ref(true)

const publicHeight = computed(
  () =>
    token.value.layout?.header.heightLayoutHeader + 24 * 2 + (
      global.globalLayout.showTabsBar ? global.globalLayout.fixedMultiTab ? 62 : 46 : 0
    )
)

const frameStyle = reactive({
  height: `${window.innerHeight - publicHeight.value}px`,
  borderRadius: '8px'
} as CSSProperties)

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

const calcHeight = () => (frameStyle.height = `${window.innerHeight - publicHeight.value}px`)

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
          :src="frameSrc"
          :class="[`${prefixCls}-main`]"
          :style="frameStyle"
          ref="frameRef"
          @load="hideLoading"
        />
      </a-spin>
    </div>
  </g-pro-page-container>
</template>
