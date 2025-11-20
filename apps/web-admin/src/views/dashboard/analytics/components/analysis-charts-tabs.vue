<script setup lang="ts">
import type { BasicOption } from '@gx/types'

interface Props {
  value?: string | number;
  'onUpdate:value'?: (val: string | number | undefined) => void;
  tabs?: BasicOption[];
  onChange?: (val: string | number | undefined) => void;
}

defineOptions({
  name: 'AnalysisChartsTabs',
})

const props = withDefaults(defineProps<Props>(), {
  tabs: () => [],
})
const value = ref<string | number | undefined>(props.value || props.tabs?.[0]?.value)

watch(
  () => props.value,
  (val) => {
    value.value = val
  },
)

watch(
  () => value.value,
  (val) => {
    props.onChange?.(val)
    props['onUpdate:value']?.(val)
  },
)
</script>

<template>
  <div class="card-box w-full px-4 pb-5 pt-3">
    <a-segmented v-model:value="value" :options="tabs" />
    <template v-for="tab in tabs" :key="tab.label">
      <div v-if="tab.value === value" class="pt-4 mt-2">
        <slot :name="tab.value" />
      </div>
    </template>
  </div>
</template>
