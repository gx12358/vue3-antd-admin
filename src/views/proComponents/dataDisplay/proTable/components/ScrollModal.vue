<script setup lang="ts">
import { useProForm } from '@gx-design-vue/pro-provider'
import { cloneDeep } from 'lodash-es'
import { reactive, ref } from 'vue'

const emits = defineEmits(['handleOk'])

const visible = ref(false)

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

const formState = reactive({
  x: 1850,
  y: undefined
})

const { resetFields, validate, validateInfos } = useProForm(formState)

const resetModalState = () => {
  visible.value = false
  resetFields()
}

const open = () => {
  visible.value = true
}

const handleSubmit = () => {
  validate()
    .then(() => {
      const params = cloneDeep(formState)
      Object.keys(params).map((item) => {
        if (params[item]) {
          params[item] = Number(params[item])
        } else {
          delete params[item]
        }
        return item
      })
      emits('handleOk', params)
      resetModalState()
    })
    .catch((_) => {})
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
    title="Scroll"
    width="450px"
    type="normal"
    :open="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="x" v-bind="validateInfos.x">
        <a-input
          v-model:value="formState.x"
          style="width: 100%"
          placeholder="请输入横向x"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="y" v-bind="validateInfos.y">
        <a-input
          v-model:value="formState.y"
          style="width: 100%"
          placeholder="请输入纵向y"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>
