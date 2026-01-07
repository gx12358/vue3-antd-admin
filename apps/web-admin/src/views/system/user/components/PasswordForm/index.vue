<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemUserApi } from '@/services/system/user'
import { message } from 'ant-design-vue'
import { omit } from 'lodash-es'
import { reactive } from 'vue'
import z from 'zod'
import { useForm } from '@/hooks/state'
import { resetUserPassword } from '@/services/system/user'

interface FormState {
  id?: number;
  password: string;
  confirmPassword: string;
  oldPassword?: string;
}

const modalState = reactive<ProModalProps>({
  width: 520,
  title: '重置密码',
  open: false
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit
} = useForm<FormState>({
  values: {
    id: undefined,
    password: '',
    confirmPassword: '',
  },
  dependencies: {
    password: {
      zod: z
        .string({ message: '请输入新密码' })
        .min(5, '密码长度不能少于 5 个字符')
        .max(20, '密码长度不能超过 20 个字符'),
    },
    confirmPassword: {
      zod: z
        .string({ message: '请输入确认密码' })
        .min(5, '确认密码长度不能少于 5 个字符')
        .max(20, '确认密码长度不能超过 20 个字符')
        .refine(
          value => value === formState.password,
          '两次输入的密码不一致'
        ),
      triggerFields: ['password']
    }
  }
})

async function onOk(values: FormState) {
  // 提交表单
  try {
    loading.value = true
    await resetUserPassword(omit(values, ['confirmPassword']))
    onClose()
    message.success('操作成功')
  } finally {
    loading.value = false
  }
}

function onClose() {
  resetFields()
  modalState.open = false
}

defineExpose({
  open: async (row: SystemUserApi.UserTableRecord) => {
    if (!row.id) return
    modalState.open = true
    formState.id = row.id
  }
})
</script>

<template>
  <g-pro-modal
    v-bind="modalState"
    :spinning="loading"
    @ok="handleSubmit(onOk)"
    @cancel="onClose"
  >
    <a-form class="gx-pro-form" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item v-bind="register('password')" label="新密码">
        <a-input-password v-model:value="formState.password" placeholder="请输入新密码" />
      </a-form-item>
      <a-form-item v-bind="register('confirmPassword')" label="确认密码">
        <a-input-password v-model:value="formState.confirmPassword" placeholder="请输入新密码" />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
