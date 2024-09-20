<script setup lang="ts">
import Logo from '@/assets/logo.png'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { GProFormCheckbox, GProFormLogin, GProFormPassword, GProFormText } from '@gx-design-vue/pro-form'
import { GlobalFooter } from '@gx-design-vue/pro-layout'
import { h, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'

interface UserState {
  userName: string
  password: string
}

interface loginState {
  redirect: string
  dependencies: Record<string, any>
  devDependencies: Record<string, any>
}

const { pkg } = __APP_INFO__

const userOutlined = h(UserOutlined)
const lockOutlined = h(LockOutlined)

const store = useStore()
const route = useRoute()
const router = useRouter()

const userForm = reactive({
  userName: 'admin',
  password: 'gx.design',
  autoLogin: true
} as UserState)

const userRules = reactive({
  userName: [{ required: true, message: '用户名是必填项！' }],
  password: [{ required: true, message: '密码是必填项！' }]
})

const state: loginState = reactive({
  redirect: '/',
  dependencies: pkg.dependencies,
  devDependencies: pkg.devDependencies
})

watch(
  () => route.fullPath,
  () => {
    state.redirect = (route.query?.redirect as string) || '/'
  },
  {
    deep: true,
    immediate: true
  }
)
const handleRoute = () => {
  return state.redirect === '/exception/404' || state.redirect === '/exception/403'
    ? '/'
    : state.redirect
}

const handleSubmit = async (value) => {
  const response: any = await store.user.userLogin({ ...value })
  if (response) {
    router.push({ path: handleRoute() })
  }
}
</script>

<template>
  <div :class="$style['login-container']">
    <div :class="$style.content">
      <GProFormLogin
        style="margin-top: 40px"
        :model="userForm"
        :rules="userRules"
        :logo="Logo"
        title="GX Pro Admin"
        @submit="handleSubmit"
      >
        <template #subTitle>
          <p>GX Pro Admin 是一套基于</p>
          vue（{{ state.dependencies.vue }}） + ant-design-vue（{{
            state.dependencies['ant-design-vue']
          }}） 开发的一套后台系统1111
        </template>
        <GProFormText
          name="userName"
          :field-props="{ size: 'large', prefix: userOutlined }"
          placeholder="用户名: admin"
        />
        <GProFormPassword
          name="password"
          :field-props="{ size: 'large', prefix: lockOutlined }"
          placeholder="密码: gx.design"
        />
        <div class="mb-[24px]">
          <GProFormCheckbox no-style name="autoLogin">
            自动登录
          </GProFormCheckbox>
          <a class="float-right">忘记密码</a>
        </div>
      </GProFormLogin>
    </div>
    <GlobalFooter />
  </div>
</template>

<style lang="less" module>
@import './style';
</style>
