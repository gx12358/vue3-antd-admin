<template>
  <g-pro-modal
    title="ScrollBreakpoint"
    width="450px"
    :open="visible"
    type="normal"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form v-model="scrollRef" v-bind="formItemLayout">
      <a-form-item label="模式">
        <a-radio-group v-model:value="scrollRef.mode">
          <a-radio value="grid">Grid</a-radio>
          <a-radio value="width">Width</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="scrollRef.mode === 'grid'" label="Grid">
        <a-radio-group v-model:value="scrollRef.grid">
          <a-radio-button value="xxxl">xxxl</a-radio-button>
          <a-radio-button value="xxl">xxl</a-radio-button>
          <a-radio-button value="xl">xl</a-radio-button>
          <a-radio-button value="lg">lg</a-radio-button>
          <a-radio-button value="md">md</a-radio-button>
          <a-radio-button value="xs">xs</a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="scrollRef.mode === 'width'" label="Width">
        <a-input
          style="width: 100%"
          v-model:value="scrollRef.width"
          placeholder="请输入断点数值"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { isString } from '@gx-design-vue/pro-utils'

const emits = defineEmits(['handleOk'])

const visible = ref(false)

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

const scrollRef = reactive({
  mode: 'grid',
  grid: 'xl',
  width: ''
})

const resetModalState = () => {
  visible.value = false
  scrollRef.mode = 'grid'
  scrollRef.grid = 'xl'
  scrollRef.width = ''
}

const open = (params = 'xl') => {
  visible.value = true
  if (isString(params)) {
    scrollRef.mode = 'grid'
    scrollRef.grid = params
  } else {
    scrollRef.mode = 'wdith'
    scrollRef.grid = params
  }
}

const handleSubmit = () => {
  emits('handleOk', scrollRef.mode === 'grid' ? scrollRef.grid : Number(scrollRef.width))
  resetModalState()
}

const handleCancel = () => {
  resetModalState()
}

defineExpose({
  open
})
</script>

<style lang="less" module></style>
