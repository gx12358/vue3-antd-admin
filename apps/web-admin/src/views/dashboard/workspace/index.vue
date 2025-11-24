<script setup lang="ts">
import type { AnalysisOverviewItem, WorkbenchGroupItem, WorkbenchProjectItem, WorkbenchTrendItem } from './typing'
import { timeFix } from '@gx-core/shared/utils'
import { GProCard } from '@gx-design-vue/pro-card'
import { FastColor, unit, useProConfigContext } from '@gx-design-vue/pro-provider'
import { toChinesNum } from '@gx-design-vue/pro-utils'
import { GIconIfy } from '@gx/design'
import multiavatar from '@multiavatar/multiavatar/esm'
import dayjs from 'dayjs'
import Radar from './components/Radar.vue'

defineOptions({
  name: 'Workplace'
})

const router = useRouter()
const { user } = useStore()
const { token } = useProConfigContext()

const currentRoute = computed(() => router.currentRoute.value as AppRouteModule)

const projectItems = ref<WorkbenchProjectItem[]>([
  {
    color: '',
    content: '不要等待机会，而要创造机会。',
    date: '2021-04-01',
    group: '开源组',
    icon: 'carbon:logo-github',
    title: 'Github',
    url: 'https://github.com',
  },
  {
    color: '#3fb27f',
    content: '现在的你决定将来的你。',
    date: '2021-04-01',
    group: '算法组',
    icon: 'ion:logo-vue',
    title: 'Vue',
    url: 'https://vuejs.org',
  },
  {
    color: '#e18525',
    content: '没有什么才能比努力更重要。',
    date: '2021-04-01',
    group: '上班摸鱼',
    icon: 'ion:logo-html5',
    title: 'Html5',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/HTML',
  },
  {
    color: '#bf0c2c',
    content: '热情和欲望可以突破一切难关。',
    date: '2021-04-01',
    group: 'UI',
    icon: 'ion:logo-angular',
    title: 'Angular',
    url: 'https://angular.io',
  },
  {
    color: '#00d8ff',
    content: '健康的身体是实现目标的基石。',
    date: '2021-04-01',
    group: '技术牛',
    icon: 'bx:bxl-react',
    title: 'React',
    url: 'https://reactjs.org',
  },
  {
    color: '#EBD94E',
    content: '路是走出来的，而不是空想出来的。',
    date: '2021-04-01',
    group: '架构组',
    icon: 'ion:logo-javascript',
    title: 'Js',
    url: 'https://developer.mozilla.org/zh-CN/docs/Web/JavaScript',
  },
])
const trendItems = ref<WorkbenchTrendItem[]>([
  {
    avatar: 'svg:avatar-1',
    content: `在 <a>开源组</a> 创建了项目 <a>Vue</a>`,
    date: '刚刚',
    title: '威廉',
  },
  {
    avatar: 'svg:avatar-2',
    content: `关注了 <a>威廉</a> `,
    date: '1个小时前',
    title: '艾文',
  },
  {
    avatar: 'svg:avatar-3',
    content: `发布了 <a>个人动态</a> `,
    date: '1天前',
    title: '克里斯',
  },
  {
    avatar: 'svg:avatar-4',
    content: `发表文章 <a>如何编写一个Vite插件</a> `,
    date: '2天前',
    title: 'Gx',
  },
  {
    avatar: 'svg:avatar-1',
    content: `回复了 <a>杰克</a> 的问题 <a>如何进行项目优化？</a>`,
    date: '3天前',
    title: '皮特',
  },
  {
    avatar: 'svg:avatar-2',
    content: `关闭了问题 <a>如何运行项目</a> `,
    date: '1周前',
    title: '杰克',
  },
  {
    avatar: 'svg:avatar-3',
    content: `发布了 <a>个人动态</a> `,
    date: '1周前',
    title: '威廉',
  },
  {
    avatar: 'svg:avatar-4',
    content: `推送了代码到 <a>Github</a>`,
    date: '2021-04-01 20:00',
    title: '威廉',
  },
  {
    avatar: 'svg:avatar-4',
    content: `发表文章 <a>如何编写使用 Gx Pro Admin</a> `,
    date: '2021-03-01 20:00',
    title: 'Gx',
  },
])
const groupList = ref<WorkbenchGroupItem[]>([
  {
    icon: 'ion:logo-github',
    title: '开源组'
  },
  {
    icon: 'ion:logo-vue',
    title: '算法组'
  },
  {
    icon: 'ion:logo-html5',
    title: '上班摸鱼'
  },
  {
    icon: 'ion:logo-angular',
    title: 'UI'
  },
  {
    icon: 'bx:bxl-react',
    title: '技术牛'
  },
  {
    icon: 'ion:logo-javascript',
    title: '架构组'
  },
])
const radarList = ref<Record<string, AnalysisOverviewItem[]>>({
  personal: [
    {
      name: '引用',
      value: 10
    },
    {
      name: '口碑',
      value: 8
    },
    {
      name: '产量',
      value: 4
    },
    {
      name: '贡献',
      value: 5
    },
    {
      name: '热度',
      value: 7
    }
  ],
  team: [
    {
      name: '引用',
      value: 3
    },
    {
      name: '口碑',
      value: 9
    },
    {
      name: '产量',
      value: 6
    },
    {
      name: '贡献',
      value: 3
    },
    {
      name: '热度',
      value: 1
    }
  ],
  dept: [
    {
      name: '引用',
      value: 4
    },
    {
      name: '口碑',
      value: 1
    },
    {
      name: '产量',
      value: 6
    },
    {
      name: '贡献',
      value: 5
    },
    {
      name: '热度',
      value: 7
    }
  ],
})

const cardShadow = computed(() => {
  return `
    0 1px 2px -2px ${new FastColor('rgba(0, 0, 0, 0.16)').toRgbString()},
    0 3px 6px 0 ${new FastColor('rgba(0, 0, 0, 0.12)').toRgbString()},
    0 5px 12px 4px ${new FastColor('rgba(0, 0, 0, 0.09)').toRgbString()}
  `
})

const boxShadow = computed(() => {
  return `
    ${unit(token.value.lineWidth)} 0 0 0 ${token.value.colorBorderSecondary},
    0 ${unit(token.value.lineWidth)} 0 0 ${token.value.colorBorderSecondary},
    ${unit(token.value.lineWidth)} ${unit(token.value.lineWidth)} 0 0 ${token.value.colorBorderSecondary},
    ${unit(token.value.lineWidth)} 0 0 0 ${token.value.colorBorderSecondary} inset,
    0 ${unit(token.value.lineWidth)} 0 0 ${token.value.colorBorderSecondary} inset
  `
})

const transition = computed(() => {
  return `all ${token.value.motionDurationMid}`
})
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <template #contentRender>
      <div class="text-hidden-1 text-20px leading-32px font-600">
        {{ currentRoute.meta?.title }}
      </div>
      <div class="flex items-center justify-between mt-12px flex-wrap gap-20px">
        <div class="flex gap-24px lt-md:w-full">
          <a-avatar class="rd-50% w-70px h-70px overflow-hidden" style="flex-shrink: 0" :src="user.userInfo.avatar" />
          <div class="flex flex-col py-10px justify-between gap-10px">
            <div class="font-500 leading-20px font-500 text-20px">
              {{ timeFix() }}，{{ user.userInfo.nickname }} ，祝你开心每一天
            </div>
            <div class="text-foreground">
              前端工程师 | （REACT，VUE，UNIAPP、TARO）平台
            </div>
          </div>
        </div>
        <div class="flex items-center gap-32px lt-md:w-full lt-md:mt-20px">
          <div class="statistic_item">
            <a-statistic title="项目数" value="2/10" />
          </div>
          <div class="statistic_item">
            <a-statistic title="团队内排名" value="8" />
          </div>
          <div class="statistic_item">
            <a-statistic title="项目访问" value="300" />
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
          :body-style="{ padding: 0, marginBlockStart: '-1px', marginInlineStart: '-1px' }"
        >
          <template #extra>
            <a>全部项目</a>
          </template>
          <GProCard
            v-for="item in projectItems"
            :key="item.title"
            class="card-item"
            :col-span="{ xl: 8, lg: 8, md: 12, sm: 24, xs: 24 }"
            hoverable
          >
            <div class="flex flex-col gap-8px">
              <div class="flex items-center gap-12px">
                <GIconIfy class="size-8" :color="item.color" :icon="item.icon" />
                <span class="gx-admin-a leading-24px">{{ item.title }}</span>
              </div>
              <div class="text-hidden-2 leading-22px text-foreground">
                {{ item.content }}
              </div>
              <div class="flex items-center leading-20px text-12px gap-4px">
                <span class="text-foreground">{{ item.group }}</span>
                <span class="text-quaternary">{{ dayjs(item.date).fromNow() }}</span>
              </div>
            </div>
          </GProCard>
        </GProCard>
        <GProCard title="动态" header-bordered :body-style="{ paddingInline: 0 }">
          <div v-for="(item, index) in trendItems" :key="index" class="flex py-16px gap-16px bd-b-border px-6">
            <span class="size-10 flex-none rounded-full" v-html="multiavatar(item.avatar)" />
            <div class="flex flex-col gap-4px">
              <div class="mail-item-top">
                <span class="mr-4px">{{ item.title }}</span>
                <span v-html="item.content" />
              </div>
              <span class="text-quaternary">{{ item.date }}</span>
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
        <GProCard header-bordered class="mb-24px" title="XX 指数">
          <Radar :data="radarList" />
        </GProCard>
        <GProCard title="团队" header-bordered>
          <a-row :gutter="10">
            <a-col v-for="(item, index) in groupList" :key="index" :span="12">
              <div class="py-12px">
                <div class="flex items-center gx-admin-a gap-12px cursor-pointer">
                  <span class="size-6" v-html="multiavatar(item.icon)" />
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
.card-item {
  background: transparent;
  border-radius: 0;
  box-shadow: v-bind(boxShadow);
  transition: v-bind(transition);

  &:hover {
    position: relative;
    z-index: 1;
    box-shadow: v-bind(cardShadow);
  }
}
</style>
