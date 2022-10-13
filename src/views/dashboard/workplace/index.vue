<template>
  <g-pro-page-container :useCard="false">
    <div :class="$style.workplace">
      <PageHeader title="工作台" :backIcon="false">
        <template #extra>
          <span :class="$style.refresh" @click="reloadCurrentPage">
            <RedoOutlined />&nbsp;刷新
          </span>
        </template>
        <div class="gx-pro-page-container-row">
          <div class="gx-pro-page-container-content">
            <div :class="$style.avatar">
              <a-avatar size="large" :src="store.user.userInfo.avatar">
                <template #icon>
                  <a-spin>
                    <template #indicator>
                      <LoadingOutlined />
                    </template>
                  </a-spin>
                </template>
              </a-avatar>
            </div>
            <div :class="$style.content">
              <div :class="$style['content-title']">
                {{ state.timeFix }}，{{ store.user.userInfo.nickName }}
                <span :class="$style['welcome-text']"> ，{{ welcome }} </span>
              </div>
              <div>前端工程师 | （REACT，VUE，UNIAPP）平台</div>
            </div>
          </div>
          <div
            :style="isMobile ? { width: '100%', marginTop: '24px' } : undefined"
            class="gx-pro-page-container-extraContent"
          >
            <div :class="$style['extra-content']">
              <div :class="$style['stat-item']">
                <Statistic title="项目数" :value="3" />
              </div>
              <div :class="$style['stat-item']">
                <Statistic title="项目访问" :value="2223" />
              </div>
            </div>
          </div>
        </div>
      </PageHeader>
      <div class="mt-24px">
        <a-row :gutter="24">
          <a-col :xl="16" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card
              :class="$style['project-list']"
              :loading="state.loading"
              style="margin-bottom: 24px"
              :bordered="false"
              title="进行中的项目"
            >
              <template #extra>
                <a href="#/">全部项目</a>
              </template>
              <div>
                <a-card-grid
                  :class="$style['project-card-grid']"
                  :key="i"
                  v-for="(item, i) in state.notice"
                >
                  <a-card :bordered="false" :body-style="{ padding: 0 }">
                    <a-card-meta>
                      <template #title>
                        <div :class="$style['card-title']">
                          <a-avatar size="small" :src="item.logo" />
                          <a :href="item.href">{{ item.title }}</a>
                        </div>
                      </template>
                      <template #description>
                        <div :class="$style['card-description']">
                          {{ item.description }}
                        </div>
                      </template>
                    </a-card-meta>
                    <div :class="$style['project-item']">
                      <a :href="item.memberLink">{{ item.member || '' }}</a>
                      <span :class="$style.datetime">9小时前</span>
                    </div>
                  </a-card>
                </a-card-grid>
              </div>
            </a-card>
            <a-card :loading="state.dynamicLoading" title="全部动态" :bordered="false">
              <a-list :class="$style['activities-list']">
                <a-list-item :key="index" v-for="(item, index) in state.activities">
                  <a-list-item-meta>
                    <template #avatar>
                      <a-avatar :src="item.user.avatar" />
                    </template>
                    <template #title>
                      <a class="userName">{{ item.user.name }}</a
                      >&nbsp;
                      <span class="event">
                        <template
                          :key="index"
                          v-for="(key, index) in item.template.split(/@\{([^{}]*)\}/gi)"
                        >
                          <template v-if="item[key]">
                            <a v-if="item[key]" :href="item[key].link">
                              {{ item[key].name }}
                            </a>
                          </template>
                          <template v-else>{{ key }}</template>
                        </template>
                      </span>
                    </template>
                    <template #description>
                      <span :class="$style.datetime">{{ momentFromNow(item.updatedAt) }}</span>
                    </template>
                  </a-list-item-meta>
                </a-list-item>
              </a-list>
            </a-card>
          </a-col>
          <a-col style="padding: 0 12px" :xl="8" :lg="24" :md="24" :sm="24" :xs="24">
            <a-card title="快速开始 / 便捷导航" style="margin-bottom: 24px" :bordered="false">
              <div :class="$style['item-group']">
                <a>操作一</a>
                <a>操作二</a>
                <a>操作三</a>
                <a>操作四</a>
                <a>操作五</a>
                <a>操作六</a>
                <a-button size="small" type="primary" ghost>
                  <template #icon>
                    <PlusOutlined />
                  </template>
                  添加
                </a-button>
              </div>
            </a-card>
            <a-card
              title="XX 指数"
              style="margin-bottom: 24px"
              :loading="state.radarLoading"
              :bordered="false"
            >
              <Radar :data="state.radarData" :max="state.radarMaxCount" />
            </a-card>
            <a-card :loading="state.loading" title="团队" :bordered="false">
              <div :class="$style.members">
                <a-row>
                  <a-col :span="12" v-for="(item, index) in state.notice" :key="index">
                    <a>
                      <a-avatar size="small" :src="item.logo" />
                      <span :class="$style.member">{{ item.title }}</span>
                    </a>
                  </a-col>
                </a-row>
              </div>
            </a-card>
          </a-col>
        </a-row>
      </div>
    </div>
  </g-pro-page-container>
</template>

<script setup lang="ts">
import { ref, computed, reactive, onMounted, inject } from 'vue'
import { useStore } from '@gx-vuex'
import { Statistic, PageHeader } from 'ant-design-vue'
import { PlusOutlined, RedoOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { notice, activities, radar } from '@/services/workplace'
import useMediaQuery from '@/hooks/event/useMediaQuery'
import { timeFix, momentFromNow } from '@/utils/util'
import Radar from './components/Radar.vue'

interface stateTypes {
  timeFix: string
  notice: any[]
  activities: any[]
  axisData: any[]
  radarData: any[]
  loading: boolean
  radarMaxCount: number
  dynamicLoading: boolean
  radarLoading: boolean
}

const store = useStore()
const colSize = useMediaQuery()

const reloadCurrentPage: any = inject('reloadPage')

const welcome = ref('祝你开心每一天！')

const state: stateTypes = reactive({
  timeFix: timeFix(),
  notice: [],
  loading: true,
  dynamicLoading: true,
  radarLoading: true,
  activities: [],
  radarData: [],
  radarMaxCount: 10,
  chart: null,
  axisData: [
    { item: '引用', a: 70, b: 30, c: 40 },
    { item: '口碑', a: 60, b: 70, c: 40 },
    { item: '产量', a: 50, b: 60, c: 40 },
    { item: '贡献', a: 40, b: 50, c: 40 },
    { item: '热度', a: 60, b: 70, c: 40 },
    { item: '引用', a: 70, b: 50, c: 40 }
  ]
})

const isMobile = computed(() => colSize.value === 'sm' || colSize.value === 'xs')

onMounted(() => {
  getProjects()
  getActivity()
  getRadar()
})

const getProjects = async () => {
  const response: any = await notice()
  state.notice = response.data || []
  state.loading = false
}

const getActivity = async () => {
  const response: any = await activities()
  state.activities = response.data || []
  state.dynamicLoading = false
}

const getRadar = async () => {
  const { data = {} }: any = await radar()
  const { radarData = [] } = data
  state.radarMaxCount = handelMaxRandar(radarData)
  let datasource: any = []
  let indicatorList: {
    name: string
    max: number
  }[] = []
  radarData.map((item) => {
    if (indicatorList.every((el) => el.name !== item.label)) {
      indicatorList.push({
        name: item.label,
        max: state.radarMaxCount
      })
    }
    if (datasource.every((el) => el.name !== item.name)) {
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
      datasource = datasource.map((el: { name: string; value: number[]; label: number[] }) => {
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
  state.radarLoading = false
}
const handelMaxRandar = (datasource) => {
  return (
    datasource.sort((obj1, obj2) => {
      const val1 = obj1.value
      const val2 = obj2.value
      let result = 0
      if (val1 < val2) {
        result = 1
      } else if (val1 > val2) {
        result = -1
      }
      return result
    })[0]?.value || 0
  )
}
</script>

<style lang="less" module>
@import './style';
</style>
