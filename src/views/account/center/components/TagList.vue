<template>
  <div :class="$style.tags">
    <div :class="$style.tagsTitle">标签</div>
    <Tag :key="item.key" v-for="item in (tags || []).concat(newTags)">
      {{ item.label }}
    </Tag>
    <a-input
      v-show="inputVisible"
      ref="inputRef"
      type="text"
      size="small"
      style="width: 78px"
      v-model:value="inputValue"
      @change="handleInputChange"
      @blur="handleInputConfirm"
      @pressEnter="handleInputConfirm"
    />
    <Tag v-if="!inputVisible" style="border-style: dashed" @click="showInput">
      <PlusOutlined />
    </Tag>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref, toRefs } from 'vue'
import { Tag } from 'ant-design-vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { CurrentUser, TagType } from '@/services/account/typings'

export default defineComponent({
  props: {
    tags: Array as PropType<CurrentUser['tags']>
  },
  components: { PlusOutlined, Tag },
  setup() {
    const inputRef = ref(null)
    const state = reactive({
      inputValue: '',
      inputVisible: false,
      newTags: [] as TagType[]
    })

    const showInput = () => {
      state.inputVisible = true
      if (inputRef.value) {
        inputRef.value?.focus()
      }
    }

    const handleInputChange = (e) => {
      state.inputValue = e.target.value
    }

    const handleInputConfirm = () => {
      let tempsTags = [...state.newTags]
      if (
        state.inputValue &&
        tempsTags.filter((tag) => tag.label === state.inputValue).length === 0
      ) {
        tempsTags = [...tempsTags, { key: `new-${tempsTags.length}`, label: state.inputValue }]
      }
      state.newTags = tempsTags
      state.inputVisible = false
      state.inputValue = ''
    }

    return {
      ...toRefs(state),
      inputRef,
      showInput,
      handleInputChange,
      handleInputConfirm
    }
  }
})
</script>

<style lang="less" module>
@import '../style';
</style>
