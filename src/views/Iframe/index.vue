<script setup lang="ts">
import type { CSSProperties } from 'vue'
import { useProConfigContext } from '@gx-design-vue/pro-provider'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { ref, watch } from 'vue'

const props = withDefaults(defineProps<{
  frameSrc: string;
}>(), {
  frameSrc: ''
})

const { global } = useStore()
const { token } = useProConfigContext()
const { globalLayout } = toRefs(global.state)

const prefixCls = getPrefixCls({
  suffixCls: 'iframe-page',
  isPor: true
})

const frameRef = ref<HTMLIFrameElement>()
const loading = ref(true)

const publicHeight = computed(
  () =>
    token.value.layout?.header.heightLayoutHeader + 24 * 2 + (
      globalLayout.value.showTabsBar ? globalLayout.value.fixedMultiTab ? 62 : 46 : 0
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
