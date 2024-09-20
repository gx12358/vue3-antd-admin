<script setup lang="ts">
import type { AppRouteModule } from '@gx-design-vue/pro-layout'
import type { RadarRecord } from '@gx-mock/datasSource/dataChart'
import type { GroupListItem } from '@gx-mock/datasSource/group'
import type { MailNoticeListItem } from '@gx-mock/datasSource/notice'
import type { ProjectHomeCount, ProjectListItem } from '@gx-mock/datasSource/project'
import type { ListSearchParams } from '@gx-mock/util/table'
import { getRadarData } from '@/services/dataCenter'
import { getGroupTopList } from '@/services/groupCenter'
import { getMailNotice } from '@/services/mailCenter'
import { getProjectList, getProjectNums } from '@/services/projectCenter'
import { timeFix, toChinesNum } from '@/utils/util'
import { useRequest } from '@gx-admin/hooks/core'
import { useThemeStyle } from '@gx-admin/hooks/web'
import { GProCard } from '@gx-design-vue/pro-card'
import { compareArray } from '@gx-design-vue/pro-utils'
import dayjs from 'dayjs'
import { cloneDeep } from 'lodash-es'
import { reactive } from 'vue'
import Radar from './components/Radar.vue'

const store = useStore()
const router = useRouter()

const state = reactive({
  radarMaxCount: 10,
  radarData: []
})

const currentRoute = computed<AppRouteModule>(() => router.currentRoute.value)

const colorTextQuaternary = useThemeStyle({
  color: 'colorTextQuaternary'
})

const colorBgSpotlight = useThemeStyle({
  color: 'colorBgSpotlight'
})

const colorTextDescription = useThemeStyle({
  color: 'colorTextDescription'
})

const colorFillContent = useThemeStyle({
  borderColor: 'colorFillContent'
})

const { data: projectCount } = useRequest<Partial<ProjectHomeCount>>(
  getProjectNums,
  {
    params: {
      userId: store.user.userDetails.userId
    },
    defaultData: {},
    defaultLoading: true
  }
)
const {
  loading: projectLoading,
  data: projectList
} = useRequest<PageResult<ProjectListItem>, ListSearchParams, ProjectListItem[]>(
  getProjectList,
  {
    params: {
      pageNum: 1,
      pageSize: 6
    },
    defaultData: [],
    onAfterMutateData: data => data.list,
    defaultLoading: true
  }
)

const { loading: mailNoticeLoading, data: mailNoticeList } = useRequest<MailNoticeListItem[]>(
  getMailNotice,
  {
    params: {
      userId: store.user.userDetails.userId
    },
    defaultData: [],
    defaultLoading: true
  }
)

const { loading: radarLoading, data: radarList } = useRequest<RadarRecord[]>(
  getRadarData,
  {
    params: {
      userId: store.user.userDetails.userId
    },
    defaultData: [],
    defaultLoading: true
  }
)

const { loading: groupLoading, data: groupList } = useRequest<GroupListItem[]>(
  getGroupTopList,
  {
    params: {
      userId: store.user.userDetails.userId
    },
    defaultData: [],
    defaultLoading: true
  }
)

watch(radarList, (val) => {
  if (val.length) {
    state.radarMaxCount = cloneDeep(val).sort((a, b) => compareArray(a, b, 'value', 1))?.[0].value
    let datasource: any[] = []
    const indicatorList: {
      name: string
      max: number
    }[] = []
    val.forEach((item) => {
      if (indicatorList.every(el => el.name !== item.label)) {
        indicatorList.push({
          name: item.label,
          max: state.radarMaxCount
        })
      }
      if (datasource.every(el => el.name !== item.name)) {
        const radarItems: {
          name: string
          label: string[]
          value: number[]
        } = {
          name: item.name,
          label: [],
          value: []
        }
        radarItems.label.push(item.label)
        radarItems.value.push(item.value)
        datasource.push(radarItems)
      } else {
        datasource = datasource.map((el: { name: string; value: number[]; label: string[] }) => {
          if (el.name === item.name) {
            el.label.push(item.label)
            el.value.push(item.value)
          }
          return el
        })
      }
      return item
    })
    state.radarData = datasource
  }
}, { deep: true })
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <template #contentRender>
      <div class="text-hidden-1 text-20px leading-32px font-600">
        {{ currentRoute.meta.title }}
      </div>
      <div class="flex items-center justify-between mt-12px flex-wrap">
        <div class="flex gap-24px lt-md:w-full">
          <a-avatar class="rd-50% w-70px h-70px overflow-hidden" style="flex-shrink: 0" :src="store.user.userDetails.avatar" />
          <div class="flex flex-col py-10px justify-between gap-10px">
            <div class="font-500 leading-20px font-500 text-20px">
              {{ timeFix() }}，{{ store.user.userDetails.nickName }} ，祝你开心每一天
            </div>
            <div :style="colorTextDescription">
              前端工程师 | （REACT，VUE，UNIAPP、TARO）平台
            </div>
          </div>
        </div>
        <div v-if="Object.keys(projectCount).length" class="flex items-center gap-32px lt-md:w-full lt-md:mt-20px">
          <div class="statistic_item">
            <a-statistic title="项目数" :value="projectCount.projectNum" />
          </div>
          <div class="statistic_item">
            <a-statistic title="团队内排名" :value="`${projectCount.ranking?.current || 0} / ${projectCount.ranking?.max || 0}`" />
          </div>
          <div class="statistic_item">
            <a-statistic title="项目访问" :value="projectCount.viewsProjectNum" />
          </div>
        </div>
      </div>
    </template>
    <a-row :gutter="24">
      <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
        <GProCard
          class="mb-24px"
          title="进行中的项目"
          wrap
          bordered
          header-bordered
          :loading="projectLoading"
          :body-style="{ padding: 0, marginBlockStart: '-1px', marginInlineStart: '-1px' } as CSSProperties"
        >
          <template #extra>
            <a>全部项目</a>
          </template>
          <GProCard
            v-for="item in projectList"
            :key="item.id"
            class="card-item"
            :col-span="{ xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }"
            hoverable
          >
            <div class="flex flex-col gap-8px">
              <div class="flex items-center gap-12px">
                <a-avatar size="small" :src="item.group.icon" />
                <span class="gx-admin-a leading-24px">{{ item.name }}</span>
              </div>
              <div :style="colorTextDescription" class="text-hidden-2 leading-22px">
                {{ item.description }}
              </div>
              <div class="flex items-center leading-20px text-12px gap-4px">
                <span :style="colorTextDescription">{{ item.group.title }}</span>
                <span :style="colorTextQuaternary">{{ dayjs(item.createTime).fromNow() }}</span>
              </div>
            </div>
          </GProCard>
        </GProCard>
        <GProCard title="动态" header-bordered :loading="mailNoticeLoading">
          <div v-for="item in mailNoticeList" :key="item.id" class="flex py-16px gap-16px mail-item" :style="colorFillContent">
            <a-avatar :src="item.user.avatar" />
            <div class="flex flex-col gap-4px">
              <div class="mail-item-top">
                <span :style="colorBgSpotlight">{{ item.user.name }}</span>&nbsp;
                <span class="event">
                  <span
                    v-for="(key, index) in item.template.split(/@\{([^{}]*)\}/gi)"
                    :key="index"
                  >
                    <template v-if="item[key]">
                      <a v-if="item[key]" :href="item[key].link">
                        {{ item[key].name }}
                      </a>
                    </template>
                    <template v-else>{{ key }}</template>
                  </span>
                </span>
              </div>
              <span :style="colorTextQuaternary">{{ dayjs(item.updatedAt).fromNow() }}</span>
            </div>
          </div>
        </GProCard>
      </a-col>
      <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
        <GProCard class="mb-24px" title="快速开始 / 便捷导航" header-bordered>
          <div class="flex flex-wrap">
            <span
              v-for="(_, index) in Array.from({ length: 6 })"
              :key="index"
              class="gx-admin-a w-25% mb-13px cursor-pointer"
            >
              {{ `操作${toChinesNum(index + 1)}` }}
            </span>
            <a-button ghost type="primary" size="small">
              添加
            </a-button>
          </div>
        </GProCard>
        <GProCard header-bordered class="mb-24px" title="XX 指数" :loading="radarLoading">
          <Radar :data="state.radarData" :max="state.radarMaxCount" />
        </GProCard>
        <GProCard title="团队" header-bordered :loading="groupLoading">
          <a-row :gutter="10">
            <a-col v-for="item in groupList" :key="item.id" :span="12">
              <div class="py-12px">
                <div class="flex items-center gx-admin-a gap-12px cursor-pointer">
                  <a-avatar size="small" :src="item.icon" />
                  <span class="leading-24px">{{ item.title }}</span>
                </div>
              </div>
            </a-col>
          </a-row>
        </GProCard>
      </a-col>
    </a-row>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
@import "./style";
</style>
