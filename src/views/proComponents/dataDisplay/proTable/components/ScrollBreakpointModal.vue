<script setup lang="ts">
import { isString } from '@gx-design-vue/pro-utils'
import { reactive, ref } from 'vue'

const emits = defineEmits(['handleOk'])

const visible = ref(false)

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

const scrollState = reactive({
  mode: 'grid',
  grid: 'xl',
  width: ''
})

const resetModalState = () => {
  visible.value = false
  scrollState.mode = 'grid'
  scrollState.grid = 'xl'
  scrollState.width = ''
}

const open = (params = 'xl') => {
  visible.value = true
  if (isString(params)) {
    scrollState.mode = 'grid'
    scrollState.grid = params
  } else {
    scrollState.mode = 'wdith'
    scrollState.grid = params
  }
}

const handleSubmit = () => {
  emits('handleOk', scrollState.mode === 'grid' ? scrollState.grid : Number(scrollState.width))
  resetModalState()
}

const handleCancel = () => {
  resetModalState()
}

defineExpose({
  open
})
</script>

<template>
  <g-pro-modal
    title="ScrollBreakpoint"
    width="450px"
    :open="visible"
    type="normal"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :model="scrollState" v-bind="formItemLayout">
      <a-form-item label="模式">
        <a-radio-group v-model:value="scrollState.mode">
          <a-radio value="grid">
            Grid
          </a-radio>
          <a-radio value="width">
            Width
          </a-radio>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="scrollState.mode === 'grid'" label="Grid">
        <a-radio-group v-model:value="scrollState.grid">
          <a-radio-button value="xxxl">
            xxxl
          </a-radio-button>
          <a-radio-button value="xxl">
            xxl
          </a-radio-button>
          <a-radio-button value="xl">
            xl
          </a-radio-button>
          <a-radio-button value="lg">
            lg
          </a-radio-button>
          <a-radio-button value="md">
            md
          </a-radio-button>
          <a-radio-button value="xs">
            xs
          </a-radio-button>
        </a-radio-group>
      </a-form-item>
      <a-form-item v-if="scrollState.mode === 'width'" label="Width">
        <a-input
          v-model:value="scrollState.width"
          style="width: 100%"
          placeholder="请输入断点数值"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>
