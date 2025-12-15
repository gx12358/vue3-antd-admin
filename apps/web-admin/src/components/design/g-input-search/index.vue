<script setup lang="ts">
import type { CustomRender } from '@gx-design-vue/pro-utils'
import type { InputProps } from 'ant-design-vue/es/input'
import type { PropType } from 'vue'

defineOptions({
  name: 'GInputSearch'
})

const props = withDefaults(defineProps<Omit<InputProps, 'value' | 'onUpdate:value'>>(), {
  lazy: true,
  hidden: undefined,
  allowClear: undefined,
  readonly: undefined,
  focused: undefined,
  defaultValue: undefined,
  disabled: undefined,
  loading: undefined,
  bordered: undefined,
  autofocus: undefined,
})

const slots = defineSlots<{
  suffix: CustomRender
  prefix: CustomRender
  clearIcon: CustomRender
  enterButton: CustomRender
  addonAfter: CustomRender
  addonBefore: CustomRender
}>()

const modelValue = defineModel('value', {
  type: String as PropType<string>,
  default: undefined
})

const value = ref(undefined)

const onSearch = (value: string) => {
  modelValue.value = value
}
</script>

<template>
  <a-input-search v-bind="props" v-model:value="value" @search="onSearch">
    <template v-for="name in slots" #[name]>
      <slot :name="name" />
    </template>
  </a-input-search>
</template>

<style scoped lang="less">

</style>
