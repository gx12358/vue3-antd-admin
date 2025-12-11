<script setup lang="ts" name="AccountCenter">
import type { SystemUserProfileApi } from '@/services/system/user/account'
import { useRequest } from '@gx/hooks'
import dayjs from 'dayjs'
import { getUserProfile } from '@/services/system/user/account'
import Password from '@/views/account/center/components/password/index.vue'
import UserInfo from '@/views/account/center/components/user-info/index.vue'
import { provideContext } from './context'

const { user } = useStore()

const { loading, data, run } = useRequest<SystemUserProfileApi.UserProfileRespVO>(getUserProfile)

const activeKey = ref<'basic' | 'password'>('basic')

const reload = async () => {
  user.fetchAuthPermissionInfo()
  await run()
}

provideContext({
  loading,
  activeKey
})
</script>

<template>
  <g-pro-page-container :use-page-card="false" :loading="loading">
    <div class="flex lg:flex-nowrap flex-wrap gap-16px">
      <div class="gx-card xxl:w-9/24 notebook:w-13/24 lg:w-12/24 w-full">
        <div class="gx-card-header">
          个人信息
        </div>
        <div v-if="data" class="gx-card-body">
          <div class="flex-center">
            <g-admin-image :src="user.userInfo.avatar" class="w-120px h-120px rd-50% bd-border" />
          </div>
          <div class="grid md:grid-cols-2 grid-cols-1 gap-16px mt-8">
            <div class="flex-1 flex-items-center gap-8px">
              <user-outlined />
              用户账号：{{ user.userInfo.username }}
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <user-switch-outlined />
              所属角色：
              <a-tag v-for="item in data.roles" :key="item.id">
                {{ item.name }}
              </a-tag>
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <phone-outlined />
              手机号码：{{ data.mobile }}
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <mail-outlined />
              用户邮箱：{{ data.email }}
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <team-outlined />
              所属部门：{{ data.dept?.name }}
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <usergroup-add-outlined />
              所属岗位：
              <template v-if="data.posts && data.posts.length">
                <a-tag v-for="item in data.posts" :key="item.id">
                  {{ item.name }}
                </a-tag>
              </template>
              <template v-else>
                -
              </template>
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <clock-circle-outlined />
              创建时间：{{ dayjs(data.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
            <div class="flex-1 flex-items-center gap-8px">
              <login-outlined />
              登录时间：{{ dayjs(data.loginDate).format('YYYY-MM-DD HH:mm:ss') }}
            </div>
          </div>
        </div>
      </div>
      <div class="gx-card flex-1">
        <div class="gx-card-header">
          <a-tabs v-model:active-key="activeKey">
            <a-tab-pane key="basic" tab="基本设置" />
            <a-tab-pane key="password" tab="密码设置" />
          </a-tabs>
        </div>
        <div v-show="activeKey === 'basic'" class="gx-card-body">
          <UserInfo :state="data" @reload="reload" />
        </div>
        <div v-show="activeKey === 'password'" class="gx-card-body">
          <Password @reload="reload" />
        </div>
      </div>
    </div>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
&:deep(.ant-tabs-nav) {
  margin-bottom: 0;

  .ant-tabs-tab {
    padding-block: 16px;
  }
}
</style>
