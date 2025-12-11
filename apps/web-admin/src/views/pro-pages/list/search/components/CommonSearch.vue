<script setup lang="ts">
import type { SearchState } from '../typings'
import { useMergedState } from '@gx-design-vue/pro-hooks'
import { useSearchListContext } from '../context'
import TagsSelect from './TagsSelect'

const props = withDefaults(defineProps<{
  disabled: boolean;
  state?: SearchState;
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

const [ searchState, changeSearchState ] = useMergedState<SearchState>(props.state, {
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
    <div class="form-item">
      <div class="label shrink-0 mr-15px">
        所属类目：
      </div>
      <TagsSelect class="flex-main" :data="classData" :value="searchState.classList" @change="val => handleChange(val, 'classList')" />
    </div>
    <slot name="author" />
    <div class="form-item">
      <div class="label shrink-0 mr-15px">
        其它选项：
      </div>
      <div class="flex items-center flex-main gap-20px">
        <div class="shrink-0 flex items-center">
          <div class="label shrink-0 mr-15px">
            活跃用户：
          </div>
          <a-select
            v-model:value="searchState.activeUser"
            placeholder="不限"
            allow-clear
            class="w-200px"
          >
            <a-select-option value="lisa">
              李三
            </a-select-option>
          </a-select>
        </div>
        <div class="flex items-center">
          <div class="label shrink-0 mr-15px">
            好评度：
          </div>
          <a-select
            v-model:value="searchState.rate"
            placeholder="不限"
            allow-clear
            class="w-200px"
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
@import "../style";
</style>
