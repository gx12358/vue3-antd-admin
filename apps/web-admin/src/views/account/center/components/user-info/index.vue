<script setup lang="ts">
import type { SystemUserProfileApi } from '@/services/system/user/account'
import { useProForm } from '@gx-design-vue/pro-provider'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { useDict } from '@/hooks/system'
import { updateUserProfile } from '@/services/system/user/account'
import { useInjectContext } from '../../context'

type FortmState = WithRequired<SystemUserProfileApi.UserProfileRespVO, 'username' | 'mobile' | 'email' | 'sex'>

const props = defineProps<{
  state?: SystemUserProfileApi.UserProfileRespVO
}>()

const emits = defineEmits<{
  (e: 'reload'): void
}>()

const { dictState } = useDict('system_user_sex')
const { loading } = useInjectContext()

const formState = reactive<FortmState>({
  id: undefined,
  username: '',
  mobile: '',
  email: '',
  sex: 1
})

const { validateInfos, validate } = useProForm<FortmState>(formState, {
  username: [ { required: true, message: '请输入用户昵称' }],
  mobile: [ { required: true, pattern: /^1[3-9]\d{9}$/, message: '请输入手机号码' }],
  email: [ { required: true, pattern: /^[\w-]+@[\w-]+(\.[\w-]+)+$/, message: '请输入邮箱地址' }],
  sex: [ { required: true, message: '请选择性别' }],
})

watch(() => props.state, (value) => {
  if (!value) return
  for (const key in value) {
    if (key in formState) {
      formState[key] = value[key]
    }
  }
}, { immediate: true })

async function update() {
  try {
    await validate()
    loading.value = true
    await updateUserProfile(toRaw(formState))
    message.success('更新成功')
    await emits('reload')
  } catch {}
  finally {
    loading.value = false
  }
}
</script>

<template>
  <a-form class="md:w-320px w-full" :colon="false">
    <a-form-item label="用户昵称" v-bind="validateInfos.username">
      <a-input v-model:value="formState.username" placeholder="请输入用户昵称" allow-clear />
    </a-form-item>
    <a-form-item label="用户昵称" v-bind="validateInfos.mobile">
      <a-input v-model:value="formState.mobile" placeholder="请输入用户昵称" allow-clear />
    </a-form-item>
    <a-form-item label="用户邮箱" v-bind="validateInfos.email">
      <a-input v-model:value="formState.email" placeholder="请输入用户邮箱" allow-clear />
    </a-form-item>
    <a-form-item label="用户性别" v-bind="validateInfos.sex">
      <a-radio-group v-model:value="formState.sex" button-style="solid">
        <a-radio-button v-for="item in dictState.system_user_sex.data" :key="item.value" :value="Number(item.value)">
          {{ item.label }}
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
    <div class="flex justify-end">
      <a-button type="primary" @click="update">
        更新信息
      </a-button>
    </div>
  </a-form>
</template>

<style scoped lang="less">

</style>
