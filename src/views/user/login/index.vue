<script setup lang="ts">
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { defaultSettings } from '@gx-config'
import { useProForm } from '@gx-design-vue/pro-provider'
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import classNames from '@/utils/classnames'
import { isDev } from '@/utils/env'
import { getStorage, removeStorage, setStorage } from '@/utils/storage'

type LoginType = 'account' | 'phone' | 'scanCode'

interface UserState {
  username: string
  password: string
}

const { title } = defaultSettings.system

const userFormValue = getStorage<UserState>({ key: 'gx-login-form' })

const userOutlined = h(UserOutlined)
const lockOutlined = h(LockOutlined)

const { user, layout, theme } = useStore()
const route = useRoute()
const router = useRouter()

const toggleEl = ref()
const loading = ref(false)
const autoLogin = ref(true)
const redirect = ref('/')

const loginType = reactive({
  options: [
    {
      label: '账号密码登录',
      value: 'account'
    },
    {
      label: '手机号登录',
      value: 'phone',
      disabled: true
    },
    {
      label: '扫码登录',
      value: 'scanCode',
      disabled: true
    }
  ],
  value: 'account' as LoginType
})

const userForm = reactive<UserState>({
  username: userFormValue?.username || (isDev() ? 'admin' : ''),
  password: userFormValue?.password || (isDev() ? 'gx.design' : '')
})

const { validateInfos, validate } = useProForm(userForm, {
  username: [ { required: true, message: '用户名是必填项！' } ],
  password: [ { required: true, message: '密码是必填项！' } ]
})

watch(() => route.fullPath, () => {
  redirect.value = (route.query?.redirect as string) || '/'
}, { deep: true, immediate: true })

const handleRoute = () => {
  return redirect.value === '/exception/404' || redirect.value === '/exception/403'
    ? '/'
    : redirect.value
}

const handleSubmit = async () => {
  validate().then(async () => {
    const response = await user.userLogin({ ...toRaw(userForm) })
    if (response) {
      if (autoLogin.value) {
        setStorage({
          key: 'gx-login-form',
          value: { ...userForm },
          // 7天
          expired: 7 * 24 * 60 * 60 * 1000
        })
      } else {
        removeStorage({ key: 'gx-login-form' })
      }
      router.push({ path: handleRoute() })
    }
  }).catch(() => {})
}
</script>

<template>
  <div class="flex min-h-100vh select-none overflow-x-hidden">
    <div class="absolute left-0 top-0 z-10 flex flex-1">
      <div class="text-muted lg:text-muted ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6">
        <img :src="layout.config.logo" alt="" width="42" class="mr-2">
        <div class="m-0 text-xl font-medium">
          {{ title }}
        </div>
      </div>
    </div>
    <div ref="toggleEl" class="absolute right-2 top-4 z-10 gx-pro-actions-icon text-xl">
      <g-icon :type="theme.isDark ? 'dark' : 'light'" @click="theme.toggle(toggleEl)" />
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <div :class="classNames('bg-layout absolute inset-0 h-full w-full')">
        <div class="login-background absolute left-0 top-0 size-full" />
        <div class="flex-col-center -enter-x mr-20 h-full">
          <img src="@images/login/login_bg.svg" alt="" class="animate-float h-64">
          <div class="text-1xl text-muted mt-6 font-sans lg:text-2xl">
            开箱即用的大型中后台管理系统
          </div>
          <div class="dark:text-muted-foreground mt-2">
            工程化、高性能、跨组件库的前端模版
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col-center dark:bg-layout bg-background relative px-6 py-10 lg:flex-initial lg:px-8 min-h-full w-[34%] flex-1">
      <div class="mt-6 w-full sm:mx-auto md:max-w-md">
        <div class="mb-4 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="text-foreground mb-3 text-2xl font-bold leading-9 tracking-tight lg:text-3xl">
            欢迎回来 👋🏻
          </h2>
        </div>
        <a-segmented v-model:value="loginType.value" :options="loginType.options" size="large" />
        <a-form name="login" layout="vertical" class="mt-8" @sumbit="handleSubmit">
          <a-form-item name="username" v-bind="validateInfos.username">
            <a-input
              v-model:value="userForm.username"
              size="large"
              allow-clear
              :prefix="userOutlined"
              placeholder="请输入用户名:admin"
            />
          </a-form-item>
          <a-form-item v-bind="validateInfos.password" name="password">
            <a-input-password
              v-model:value="userForm.password"
              size="large"
              :prefix="lockOutlined"
              placeholder="请输入密码:gx.design"
            />
          </a-form-item>
          <a-form-item>
            <div class="flex items-center justify-between">
              <a-checkbox v-model:checked="autoLogin">
                自动登录
              </a-checkbox>
              <a>忘记密码</a>
            </div>
          </a-form-item>
          <a-form-item class="mb-0">
            <a-button :loading="loading" size="large" block type="primary" html-type="submit" @click="handleSubmit">
              登录
            </a-button>
          </a-form-item>
        </a-form>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './style';
</style>
