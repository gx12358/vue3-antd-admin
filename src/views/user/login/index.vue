<template>
  <div :class="$style['login-container']">
    <div :class="$style.content">
      <g-pro-form-login
        style="margin-top: 40px"
        :model="userForm"
        :formRef="(e) => (formRef = e)"
        :rules="userRules"
        :logo="Logo"
        title="GX Pro Admin"
        @finish="(values) => handleSubmit(values)"
      >
        <template #subTitle>
          <p>GX Pro Admin 是一套基于</p>
          vue（{{ state.dependencies['vue'] }}） + ant-design-vue（{{
            state.dependencies['ant-design-vue']
          }}） 开发的一套后台系统
        </template>
        <g-pro-form-text
          name="userName"
          :fieldProps="{ size: 'large', prefix: userOutlined }"
          placeholder="用户名: admin"
        />
        <g-pro-form-password
          name="password"
          :fieldProps="{ size: 'large', prefix: lockOutlined }"
          placeholder="密码: gx.design"
        />
        <div class="mb-24px">
          <g-pro-form-checkbox noStyle name="autoLogin">自动登录</g-pro-form-checkbox>
          <a style="float: right">忘记密码</a>
        </div>
      </g-pro-form-login>
    </div>
    <GlobalFooter />
  </div>
</template>

<script setup lang="ts">
import { useStore } from '@gx-vuex'
import { useRoute, useRouter } from 'vue-router'
import { UserOutlined, LockOutlined } from '@ant-design/icons-vue'
import { GlobalFooter } from '@gx-design/ProLayout'
import Logo from '@/assets/logo.png'
import { reactive } from 'vue'

interface UserState {
  userName: string
  password: string
}

interface loginState {
  redirect: string
  dependencies: RecordType
  devDependencies: RecordType
}

const { pkg } = __APP_INFO__

const userOutlined = h(UserOutlined)
const lockOutlined = h(LockOutlined)

const store = useStore()
const route = useRoute()
const router = useRouter()

const formRef = ref()

const userForm = reactive({
  userName: '',
  password: '',
  autoLogin: true
} as UserState)

const userRules = reactive({
  userName: [{ required: true, message: '用户名是必填项！' }],
  password: [{ required: true, message: '密码是必填项！' }]
})

const state: loginState = reactive({
  redirect: undefined,
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
    await router.push(handleRoute())
  }
}
</script>

<style lang="less" module>
@import './style';
</style>
