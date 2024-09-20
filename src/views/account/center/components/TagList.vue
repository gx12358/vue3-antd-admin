<script setup lang="ts">
import { getRandomNumber } from '@gx-design-vue/pro-utils'
import { cloneDeep } from 'lodash-es'

const props = withDefaults(defineProps<{ tags: string[] }>(), { tags: () => [] })

interface TagsList {
  id: string;
  value: string;
}

const inputRef = ref()
const tagsList = ref<TagsList[]>([])
const inputValue = ref()
const inputVisible = ref<boolean>(false)

watch(
  () => props.tags,
  () => {
    tagsList.value = cloneDeep(props.tags).map(item => ({ id: getRandomNumber().uuid(5), value: item }))
  },
  { deep: true, immediate: true }
)

const showInput = () => {
  inputVisible.value = true
  nextTick(() => {
    inputRef.value && inputRef.value.focus()
  })
}

const handleInputConfirm = () => {
  if (inputValue.value && tagsList.value.every(item => item.value.includes(inputValue.value))) {
    tagsList.value = [ ...tagsList.value, { id: getRandomNumber().uuid(5), value: inputValue.value } ]
  }
  inputValue.value = ''
  inputVisible.value = false
}
</script>

<template>
  <div class="flex flex-wrap gap-8px">
    <template v-for="tag in tagsList" :key="tag.id">
      <a-tooltip v-if="tag.value.length > 20" :title="tag.value">
        <a-tag>
          {{ `${tag.value.slice(0, 20)}...` }}
        </a-tag>
      </a-tooltip>
      <a-tag v-else>
        {{ tag.value }}
      </a-tag>
    </template>
    <a-input
      v-if="inputVisible"
      ref="inputRef"
      v-model:value="inputValue"
      type="text"
      size="small"
      :style="{ width: '78px' }"
      @blur="handleInputConfirm"
      @keyup.enter="handleInputConfirm"
    />
    <a-tag v-else style="background: #fff; border-style: dashed;" class="cursor-pointer" @click="showInput">
      <plus-outlined />
      New Tag
    </a-tag>
  </div>
</template>

<style scoped lang="less">

</style>
