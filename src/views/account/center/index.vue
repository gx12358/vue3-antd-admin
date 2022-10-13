<template>
  <g-pro-page-container>
    <a-row :gutter="24">
      <a-col :lg="7" :md="24">
        <a-card
          :class="$style.mainCard"
          :bordered="false"
          style="margin-bottom: 24px"
          :loading="loading"
        >
          <div v-if="!loading && currentUser">
            <div :class="$style.avatarHolder">
              <img :src="currentUser.avatar" alt="" />
              <div :class="$style.name">{{ currentUser.name }}</div>
              <div>{{ currentUser?.signature }}</div>
            </div>
            <div :class="$style.detail">
              <p>
                <ContactsOutlined style="margin-right: 8px" />
                {{ currentUser.title }}
              </p>
              <p>
                <ClusterOutlined style="margin-right: 8px" />
                {{ currentUser.group }}
              </p>
              <p>
                <HomeOutlined style="margin-right: 8px" />
                {{ (currentUser.geographic || { province: { label: '' } }).province.label }}
                {{
                  (
                    currentUser.geographic || {
                      city: {
                        label: ''
                      }
                    }
                  ).city.label
                }}
              </p>
            </div>
            <a-divider dashed />
            <TagList :tags="currentUser.tags || []" />
            <a-divider style="margin-top: 16px" dashed />
            <div :class="$style.team">
              <div :class="$style.teamTitle">团队</div>
              <a-row :gutter="36">
                <template v-if="currentUser.notice">
                  <a-col :key="item.id" v-for="item in currentUser.notice" :lg="24" :xl="12">
                    <router-link :to="item.href">
                      <a-avatar size="small" :src="item.logo" />
                      {{ item.member }}
                    </router-link>
                  </a-col>
                </template>
              </a-row>
            </div>
          </div>
        </a-card>
      </a-col>
      <a-col :lg="17" :md="24">
        <a-card
          :class="[`${$style.tabsCard}`, `${$style.mainCard}`]"
          :bordered="false"
          :tab-list="operationTabList"
          :activeTabKey="tabKey"
          @tabChange="handleTabChange"
        >
          <template #customTab="item">
            <span> {{ item.name }} <span style="font-size: 14px">(30)</span> </span>
          </template>
          <Projects v-if="tabKey === 'projects'" :datasource="listData" />
          <Applications v-if="tabKey === 'applications'" :datasource="listData" />
          <Articles v-if="tabKey === 'articles'" :datasource="listData" />
        </a-card>
      </a-col>
    </a-row>
  </g-pro-page-container>
</template>
<script lang="ts">
import { defineComponent, reactive, onActivated, toRefs } from 'vue'
import { ContactsOutlined, HomeOutlined, ClusterOutlined } from '@ant-design/icons-vue'
import type { tabKeyType } from '@/services/account/typings'
import { queryCurrent, queryFakeList } from '@/services/account/center'
import TagList from './components/TagList.vue'
import Projects from './components/Projects.vue'
import Articles from './components/Articles.vue'
import Applications from './components/Applications.vue'
import { operationTabList } from './utils/config'

export default defineComponent({
  components: {
    TagList,
    Articles,
    Projects,
    Applications,
    HomeOutlined,
    ClusterOutlined,
    ContactsOutlined
  },
  setup() {
    const state = reactive({
      tabKey: 'articles' as tabKeyType,
      loading: false,
      listData: [],
      currentUser: null
    })

    onActivated(() => {
      getCurrentUser()
      getFakeList()
    })

    const getCurrentUser = async () => {
      const response: any = await queryCurrent()
      if (response) {
        state.currentUser = response.data || {}
      }
    }

    const getFakeList = async () => {
      const response: any = await queryFakeList({
        count: 30
      })
      if (response) {
        state.listData = response.data || []
      }
    }

    const handleTabChange = (_tabKey: string) => {
      state.tabKey = _tabKey as tabKeyType
    }

    return {
      ...toRefs(state),
      operationTabList,
      handleTabChange
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
