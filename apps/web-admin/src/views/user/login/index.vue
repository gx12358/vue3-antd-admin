<script setup lang="ts">
import type { AuthApi } from '@/services/user'
import { LockOutlined, UserOutlined } from '@ant-design/icons-vue'
import { app } from '@gx-config'
import { cn, isDev } from '@gx-core/shared/utils'
import { useProForm } from '@gx-design-vue/pro-provider'
import { h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getTenantByWebsite, getTenantSimpleList } from '@/services/tenant'
import { storage } from '@/utils/storage'

defineOptions({ name: 'SocialLogin' })

type LoginType = 'account' | 'phone' | 'scanCode'

interface UserState {
  tenantId: number | undefined
  username: string
  password: string
}

const accountMap = {
  1: [
    {
      username: 'admin',
      password: 'admin123'
    }
  ],
  121: [
    {
      username: 'jack',
      password: '123456'
    }
  ],
  122: [
    {
      username: 'gx12358',
      password: '123456'
    }
  ]
}

const { title } = app.system

const userFormValue = storage.getStorage<UserState>({ key: 'gx-login-form' })

const { user, layout, theme } = useStore()
const route = useRoute()
const router = useRouter()
const { permission } = useStore()

const toggleEl = ref()
const loading = ref(false)
const autoLogin = ref(true)
const redirect = ref('/')
/** 获取租户列表，并默认选中 */
const tenantList = ref<AuthApi.TenantResult[]>([]) // 租户列表

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
  username: userFormValue?.username || (isDev() ? '' : ''),
  password: userFormValue?.password || (isDev() ? '' : ''),
  tenantId: userFormValue?.tenantId || undefined
})

const { validateInfos, validate } = useProForm(userForm, {
  tenantId: [ { required: true, message: '请选择租户！' } ],
  username: [ { required: true, message: '用户名是必填项！' } ],
  password: [ { required: true, message: '密码是必填项！' } ],
})

watch(() => route.fullPath, () => {
  redirect.value = (route.query?.redirect as string) || '/'
}, { deep: true, immediate: true })

onMounted(() => {
  fetchTenantList()
})

async function fetchTenantList() {
  try {
    // 获取租户列表、域名对应租户
    const websiteTenantPromise = getTenantByWebsite(window.location.hostname)
    tenantList.value = await getTenantSimpleList()

    // 选中租户：域名 > store 中的租户 > 首个租户
    let tenantId: undefined | number
    const websiteTenant = await websiteTenantPromise
    if (websiteTenant?.id) {
      tenantId = websiteTenant.id
    }
    // 如果没有从域名获取到租户，尝试从 store 中获取
    if (!tenantId && permission.tenantId) {
      tenantId = permission.tenantId
    }
    // 如果还是没有租户，使用列表中的第一个
    if (!tenantId && tenantList.value?.[0]?.id) {
      tenantId = tenantList.value[0].id
    }

    // 设置选中的租户编号
    permission.setState({ tenantId })

    userForm.tenantId = tenantId
  } catch (error) {
    console.error('获取租户列表失败:', error)
  }
}

function setAccount(userinfo) {
  Object.assign(userForm, { ...userinfo })
}

const handleRoute = () => {
  return redirect.value === '/exception/404' || redirect.value === '/exception/403'
    ? '/'
    : redirect.value
}

const handleSubmit = async () => {
  validate().then(async () => {
    const status = await user.userLogin({ ...toRaw(userForm) })
    if (status) {
      if (autoLogin.value) {
        storage.setStorage({
          key: 'gx-login-form',
          value: { ...userForm },
          // 7天
          expired: 7 * 24 * 60 * 60 * 1000
        })
      } else {
        storage.removeStorage({ key: 'gx-login-form' })
      }
      router.push({ path: handleRoute() })
    }
  }).catch(() => {})
}
</script>

<template>
  <div class="flex min-h-100vh select-none overflow-x-hidden">
    <div class="absolute left-0 top-0 z-10 flex flex-1">
      <div class="text-base lg:text-base ml-4 mt-4 flex flex-1 items-center sm:left-6 sm:top-6">
        <img :src="layout.config.logo" alt="" width="42" class="mr-2">
        <div class="m-0 text-xl font-medium">
          {{ title }}
        </div>
      </div>
    </div>
    <div ref="toggleEl" class="absolute right-2 top-4 z-10 gx-pro-actions-icon text-xl">
      <g-icon :type="theme.isDark ? 'moon' : 'sunny'" @click="theme.toggle(toggleEl)" />
    </div>
    <div class="relative hidden w-0 flex-1 lg:block">
      <div :class="cn('bg-layout absolute inset-0 h-full w-full')">
        <div class="login-background absolute left-0 top-0 size-full" />
        <div class="flex-col-center -enter-x mr-20 h-full">
          <img src="@images/login/login_bg.svg" alt="" class="animate-float h-64">
          <div class="text-1xl text-base mt-6 font-sans lg:text-2xl">
            开箱即用的大型中后台管理系统
          </div>
          <div class="dark:text-description mt-2">
            工程化、高性能、跨组件库的前端模版
          </div>
        </div>
      </div>
    </div>
    <div class="flex-col-center bg-background-container relative px-6 py-10 lg:flex-initial lg:px-8 min-h-full w-[34%] flex-1">
      <div class="mt-6 w-full sm:mx-auto md:max-w-md">
        <div class="mb-4 sm:mx-auto sm:w-full sm:max-w-md">
          <h2 class="text-description mb-3 text-2xl font-bold leading-9 tracking-tight lg:text-3xl">
            欢迎回来 👋🏻
          </h2>
        </div>
        <a-segmented v-model:value="loginType.value" :options="loginType.options" size="large" />
        <a-form name="login" layout="vertical" class="mt-8" @sumbit="handleSubmit">
          <a-form-item name="tenantId" v-bind="validateInfos.tenantId">
            <a-select
              v-model:value="userForm.tenantId"
              size="large"
              allow-clear
              :options="tenantList.map(item => ({
                label: item.name,
                value: item.id,
              }))"
              placeholder="请选择租户"
            />
          </a-form-item>
          <a-form-item name="username" v-bind="validateInfos.username">
            <a-input
              v-model:value="userForm.username"
              size="large"
              allow-clear
              :prefix="h(UserOutlined)"
              placeholder="请输入用户名"
            />
          </a-form-item>
          <a-form-item v-bind="validateInfos.password" name="password">
            <a-input-password
              v-model:value="userForm.password"
              size="large"
              :prefix="h(LockOutlined)"
              allow-clear
              placeholder="请输入密码"
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
        <div class="flex-center mt-4">
          <a-dropdown placement="bottom">
            <div class="flex items-center gap-2 w-fit text-description cursor-pointer">
              <span>演示账号</span>
              <team-outlined />
            </div>
            <template #overlay>
              <a-menu>
                <a-menu-item v-for="item in accountMap[userForm.tenantId as number]" :key="item.username" @click.stop="setAccount(item)">
                  {{ item.username }}
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="less" scoped>
@import './style';
</style>
