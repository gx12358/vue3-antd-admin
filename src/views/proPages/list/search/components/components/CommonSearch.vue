<script setup lang="ts">
import type { SearchState } from '../typings'
import { useMergedState } from '@gx-design-vue/pro-hooks'
import { useSearchListContext } from '../../context'
import TagsSelect from './TagsSelect'

const props = withDefaults(defineProps<{
  disabled: boolean;
  state: Partial<SearchState>;
}>(), {
  state: () => ({
    classList: [],
    rate: undefined,
    activeUser: undefined,
    authorList: undefined
  })
})

const emit = defineEmits<{
  (e: 'change', state: Partial<SearchState>): void
  (e: 'update:state', state: Partial<SearchState>): void
}>()

const { classData } = useSearchListContext()

const [ searchState, changeSearchState ] = useMergedState<Partial<SearchState>>(props.state, {
  value: computed(() => props.state),
  onChange: (val) => {
    emit('change', val)
    emit('update:state', val)
  }
})

const handleChange = (val: Partial<SearchState>[keyof SearchState], type: keyof SearchState) => {
  const params: any = {}
  params[type] = val
  changeSearchState(Object.assign(unref(searchState), params))
}
</script>

<template>
  <div class="relative">
    <div v-if="disabled" class="absolute z-1 w-full h-full" />
    <div class="max-sm-flex-wrap form-item">
      <div class="label shrink-0 mr-15px max-sm-w-full max-sm-mb-8px text-hex-999">
        所属类目：
      </div>
      <TagsSelect class="flex-main" :data="classData" :value="(searchState as SearchState).classList" @change="val => handleChange(val, 'classList')" />
    </div>
    <slot name="author" />
    <div class="max-md-flex-wrap form-item">
      <div class="label shrink-0 mr-15px max-md-w-full max-md-mb-8px text-hex-999">
        其它选项：
      </div>
      <div class="flex items-center flex-main gap-20px max-sm-flex-wrap">
        <div class="md-w-40% shrink-0 max-md-w-40% max-sm-w-full flex items-center">
          <div class="label max-sm-flex-main-70 shrink-0 mr-15px text-hex-999">
            活跃用户：
          </div>
          <a-select
            v-model:value="searchState.activeUser"
            placeholder="不限"
            allow-clear
            class="w-200px max-sm-w-60%"
          >
            <a-select-option value="lisa">
              李三
            </a-select-option>
          </a-select>
        </div>
        <div class="md-w-40% flex max-md-w-40% max-sm-w-full items-center">
          <div class="label max-sm-flex-main-70 shrink-0 mr-15px text-hex-999">
            好评度：
          </div>
          <a-select
            v-model:value="searchState.rate"
            placeholder="不限"
            allow-clear
            class="w-200px max-sm-w-60%"
          >
            <a-select-option value="good">
              优秀
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.form-item {
  --at-apply: flex items-start leading-32px border-b-hex-f0f0f0 pb-10px border-b-1px border-b-solid mb-15px;
}
</style>
