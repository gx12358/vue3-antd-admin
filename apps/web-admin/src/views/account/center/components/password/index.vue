<script setup lang="ts">
import { useProForm } from '@gx-design-vue/pro-provider'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { updateUserPassword } from '@/services/system/user/account'
import { useInjectContext } from '../../context'

interface FortmState {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const { loading } = useInjectContext()

const formState = reactive<FortmState>({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const { validate, validateInfos, resetFields } = useProForm<FortmState>(formState, {
  oldPassword: [
    {
      required: true,
      validator: (_, value) => {
        if (value.length < 5) {
          return Promise.reject('密码长度不能少于 5 个字符')
        }
        if (value.length > 20) {
          return Promise.reject('密码长度不能超过 20 个字符')
        }
        return Promise.resolve()
      }
    }
  ],
  newPassword: [
    {
      required: true,
      validator: (_, value) => {
        if (value.length < 5) {
          return Promise.reject('密码长度不能少于 5 个字符')
        }
        if (value.length > 20) {
          return Promise.reject('密码长度不能超过 20 个字符')
        }
        return Promise.resolve()
      }
    }
  ],
  confirmPassword: [
    {
      required: true,
      validator: (_, value) => {
        if (value.length < 5) {
          return Promise.reject('密码长度不能少于 5 个字符')
        }
        if (value.length > 20) {
          return Promise.reject('密码长度不能超过 20 个字符')
        }
        if (value !== formState.newPassword) {
          return Promise.reject('新密码和确认密码不一致')
        }
        return Promise.resolve()
      }
    }
  ]
})

async function update() {
  try {
    await validate()
    loading.value = true
    await updateUserPassword({
      oldPassword: formState.oldPassword,
      newPassword: formState.newPassword,
    })
    message.success('更新成功')
    resetFields()
  } catch {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <a-form class="md:w-320px w-full" :colon="false" :label-col="{ span: 6 }" :wrapper-col="{ span: 20 }">
    <a-form-item label="旧密码" v-bind="validateInfos.oldPassword">
      <a-input v-model:value="formState.oldPassword" placeholder="请输入旧密码" allow-clear />
    </a-form-item>
    <a-form-item label="新密码" v-bind="validateInfos.newPassword">
      <a-input v-model:value="formState.newPassword" placeholder="请输入新密码" allow-clear />
    </a-form-item>
    <a-form-item label="确认密码" v-bind="validateInfos.confirmPassword">
      <a-input v-model:value="formState.confirmPassword" placeholder="请输入确认密码" allow-clear />
    </a-form-item>
    <div class="flex justify-end">
      <a-button type="primary" @click="update">
        修改密码
      </a-button>
    </div>
  </a-form>
</template>

<style scoped lang="less">

</style>
