<script setup lang="ts" name="AccountCenter">
import type { GroupListItem } from '@gx-mock/routers/group/index.fake'
import type { TabsKey } from '@gx-mock/routers/user/account.fake'
import { getAccountCount, getAccountGroupList } from '@/services/userCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { GProCard } from '@gx-design-vue/pro-card'
import { useMediaQuery } from '@gx-design-vue/pro-hooks'
import { useProConfigContext } from '@gx-design-vue/pro-provider'
import TagList from './components/TagList.vue'
import { provideAccountCenterContext } from './context'

const tabPaneState: {
  name: string
  key: TabsKey
}[] = [
  {
    name: '文章',
    key: 'articles'
  },
  {
    name: '应用',
    key: 'applications'
  },
  {
    name: '项目',
    key: 'projects'
  }
]

const { layout, user, global } = useStore()
const route = useRoute()
const router = useRouter()
const { token } = useProConfigContext()
const col = useMediaQuery()

const isMobile = computed(() => [ 'md', 'sm', 'xs' ].includes(col.value))

const { data: groupData, loading } = useRequest<GroupListItem[]>(getAccountGroupList, {
  defaultData: [],
  pageActivated: true,
})

const { data: countData, loading: countLoading } = useRequest<Record<TabsKey, number>>(
  getAccountCount,
  {
    defaultData: {
      articles: 0,
      applications: 0,
      projects: 0
    },
    pageActivated: true,
    defaultLoading: true,
  }
)

const cardRightBodyHeight = computed(() => countLoading.value ? '16px 24px' : 0)

const contentHeight = computed(() => {
  const herderHeight = token.value.layout?.header?.heightLayoutHeader
  const tabsHeight = layout.config?.settings?.showTabsBar ? '62px' : '0px'
  const pageHeaderHeight = layout.config?.pageContainer?.pageHeaderRender === false
    ? '0px'
    : '46px'
  return isMobile.value
    ? undefined
    : `calc(100vh - ${herderHeight}px - ${tabsHeight} - ${pageHeaderHeight} - 54px - 48px)`
})

const activeKey = computed<TabsKey>(() => route.path.split('/').reverse()?.[0] as any)

onActivated(() => {
  global.setValue({
    disabledScrollTop: true,
    showProgressBar: true
  })
})

const changeRouter = (value: TabsKey) => {
  router.push({ path: `/account/center/${value}` })
}

onBeforeRouteLeave((to) => {
  if (!to.fullPath.includes('/account/center/')) {
    global.setValue({
      disabledScrollTop: false,
      showProgressBar: true
    })
  }
})

provideAccountCenterContext({
  activeKey,
  isMobile,
  countLoading,
  contentHeight
})
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <GProCard :gutter="[ 24, 24 ]" ghost wrap>
      <GProCard
        :col-span="{ lg: 7, xl: 7, xxl: 7, md: 24, sm: 24, xs: 24 }"
        :body-style="{ padding: '16px 24px' }"
        split="horizontal"
        class="card-left"
      >
        <div class="flex flex-col justify-center items-center mb-24px">
          <g-admin-image fit="cover" class="w-104px h-104px rd-50% mb-20px" :src="user.userInfo.avatar" />
          <span class="mb-4px text-rgba-[0-0-0-0.88] font-500 text-20px leading-28px">{{ user.userInfo.userName }}</span>
          <span>{{ user.userInfo.signature }}</span>
        </div>
        <div class="flex flex-col gap-8px">
          <div class="pl-26px relative">
            <contacts-outlined class="mr-8px" />
            <span>{{ user.userInfo.levelName }}</span>
          </div>
          <div class="pl-26px relative">
            <cluster-outlined class="mr-8px" />
            <span>{{ user.userInfo.group?.title }}</span>
          </div>
          <div class="pl-26px relative">
            <home-outlined class="mr-8px" />
            <span>{{ user.userInfo.address }}</span>
          </div>
        </div>
        <a-divider dashed />
        <div class="mb-12px font-500 text-rgba-[0-0-0-0.88]">
          标签
        </div>
        <TagList :tags="user.userInfo.tags?.split(',') || []" />
        <a-divider dashed />
        <GProCard :body-style="{ padding: 0 }" :loading="loading" class="group-card">
          <div class="mb-12px font-500 text-rgba-[0-0-0-0.88]">
            团队
          </div>
          <a-row :gutter="[ 36, 24 ]">
            <a-col v-for="item in groupData" :key="item.id" :lg="24" :xl="12">
              <div class="flex items-center gap-12px">
                <g-admin-image class="flex-shrink-0 w-24px h-24px rd-50%" :src="item.icon">
                  <template #placeholder>
                    <div class="gx-image-slot rd-50%">
                      <cluster-outlined class="!text-14px" />
                    </div>
                  </template>
                </g-admin-image>
                <span class="text-hidden-1 text-rgba-[0-0-0-0.88]">{{ item.title }}</span>
              </div>
            </a-col>
          </a-row>
        </GProCard>
      </GProCard>
      <GProCard
        :col-span="{ lg: 17, xl: 17, xxl: 17, md: 24, sm: 24, xs: 24 }"
        :loading="countLoading"
        class="card-right"
      >
        <a-tabs :active-key="activeKey" @change="changeRouter">
          <a-tab-pane v-for="item in tabPaneState" :key="item.key" :tab-key="item.key">
            <template #tab>
              {{ item.name }} <span>（{{ countData[item.key] }}）</span>
            </template>
          </a-tab-pane>
        </a-tabs>
        <router-view>
          <template #default="{ Component }">
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </template>
        </router-view>
        <div id="list-float-btn" />
      </GProCard>
    </GProCard>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
.card-left {
  position: sticky;
  top: (48 + 24 + 62px);
}

.card-right {
  &:deep(.ant-tabs-nav) {
    margin-bottom: 0;
    padding: 0 16px;
  }
  
  &:deep(.gx-pro-card-body) {
    padding: v-bind(cardRightBodyHeight);
  }
}

.group-card {
  &:deep(.gx-pro-card-loading-content) {
    padding: 0 !important;
  }
}
</style>
