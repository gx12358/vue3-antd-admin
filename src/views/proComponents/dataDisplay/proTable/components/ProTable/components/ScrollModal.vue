<template>
  <g-pro-modal
    title="Scroll"
    width="450px"
    type="normal"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form v-bind="formItemLayout">
      <a-form-item label="x" v-bind="validateInfos.x">
        <a-input
          style="width: 100%"
          v-model:value="scrollRef.x"
          placeholder="请输入横向x"
          allow-clear
        />
      </a-form-item>
      <a-form-item label="y" v-bind="validateInfos.y">
        <a-input
          style="width: 100%"
          v-model:value="scrollRef.y"
          placeholder="请输入纵向y"
          allow-clear
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { cloneDeep } from 'lodash-es'
import { Form } from 'ant-design-vue'

const useForm = Form.useForm

const emits = defineEmits(['handleOk'])

const visible = ref(false)

const formItemLayout = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
}

const scrollRef = reactive({
  x: 1850,
  y: undefined
})

const { resetFields, validate, validateInfos } = useForm(scrollRef)

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
      const params = cloneDeep(scrollRef)
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

<style lang="less" module></style>
