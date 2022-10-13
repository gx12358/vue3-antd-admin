<template>
  <g-pro-page-container>
    <div :class="$style['search-header-row']">
      <div :class="$style['search-header-content']">
        <a-input-search
          style="max-width: 550px"
          allow-clear
          v-model:value="searchValue"
          placeholder="请输入"
          size="large"
          @search="changeSearch"
        >
          <template #enterButton>
            <a-button type="primary">搜索</a-button>
          </template>
        </a-input-search>
      </div>
    </div>
    <div :class="$style['search-content-warp']">
      <Tabs v-model:activeKey="tabActiveKey" @change="handleTabChange">
        <TabPane v-for="item in tabList" :key="item.key" :tab="item.tab">
          <a-card :bordered="false">
            <Articles ref="articles" v-if="item.key === 'articles'" />
            <Projects ref="projects" v-if="item.key === 'projects'" />
            <Applications ref="applications" v-if="item.key === 'applications'" />
          </a-card>
        </TabPane>
        <template #rightExtra>
          <RedoOutlined
            @click="refreshData(tabActiveKey)"
            style="font-size: 18px; color: #8c8c8c; cursor: pointer"
          />
        </template>
      </Tabs>
    </div>
    <g-back-top />
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, onMounted, Ref, ref } from 'vue'
import { Tabs } from 'ant-design-vue'
import { RedoOutlined } from '@ant-design/icons-vue'
import Articles from './articles/index.vue'
import Projects from './projects/index.vue'
import Applications from './applications/index.vue'

const TabPane = Tabs.TabPane

const tabList = [
  {
    key: 'articles',
    tab: '文章'
  },
  {
    key: 'projects',
    tab: '项目'
  },
  {
    key: 'applications',
    tab: '应用'
  }
]

export default defineComponent({
  components: {
    Tabs,
    TabPane,
    Projects,
    Articles,
    Applications,
    RedoOutlined
  },
  setup() {
    const articles = ref()
    const projects = ref()
    const applications = ref()
    const searchValue = ref('')
    const tabActiveKey: Ref<string> = ref('')
    onMounted(() => {
      setTimeout(() => {
        tabActiveKey.value = 'articles'
      }, 200)
    })
    const getDefaultResults = (key: string, title?: string) => {
      switch (key) {
        case 'articles':
          articles.value?.onActiveLoad(title)
          break
        case 'projects':
          projects.value?.onActiveLoad(title)
          break
        case 'applications':
          applications.value?.onActiveLoad(title)
          break
      }
    }
    const refreshData = (key: string, title?: string) => {
      switch (key) {
        case 'articles':
          articles.value?.refresh(title)
          break
        case 'projects':
          projects.value?.refresh(title)
          break
        case 'applications':
          applications.value?.refresh(title)
          break
      }
    }
    const changeSearch = () => {
      getDefaultResults(tabActiveKey.value, searchValue.value)
    }
    const handleTabChange = (key: string) => {
      getDefaultResults(key)
    }
    return {
      articles,
      projects,
      applications,
      tabActiveKey,
      tabList,
      searchValue,
      changeSearch,
      refreshData,
      handleTabChange
    }
  }
})
</script>

<style lang="less" module>
.search-header-row {
  display: flex;
  width: 100%;

  .search-header-content {
    flex: auto;
    width: 100%;
    text-align: center;
  }
}
</style>
