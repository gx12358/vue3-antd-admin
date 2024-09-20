<script setup lang="ts" name="SearchList">
import type { ComputedRef } from 'vue'
import type { TagsListItem } from './components/typings'
import { useDict } from '@gx-admin/hooks/system'
import { provideSearchListContext } from './context'

type ListType = 'articles' | 'projects' | 'applications'

const route = useRoute()
const router = useRouter()
const { dictState } = useDict('sys_common_category')

const state = reactive({
  keyword: '',
  keywordStr: ''
})
const loading = ref(false)
const listType: ComputedRef<ListType> = computed(() => route.path.split('/').reverse()?.[0] as ListType || 'articles')

const changeListType = (value: ListType) => {
  router.push({ path: '/proPage/list/search/' + value })
}

const classData: ComputedRef<TagsListItem[]> = computed(() => dictState.sys_common_category?.data?.map(item => ({
  label: item.dictLabel,
  value: item.dictValue as string
})) || [])

provideSearchListContext({
  classData,
  keyword: computed(() => state.keyword),
  loading
})
</script>

<template>
  <g-pro-page-container :page-header-style="{ paddingBottom: 0 }" :use-page-card="false">
    <template #contentRender>
      <div class="flex-center my-16px">
        <a-input-search
          v-model:value="state.keywordStr"
          placeholder="请输入关键字"
          enter-button="搜索"
          class="max-w-552px"
          size="large"
          allow-clear
          :loading="loading"
          @search="value => state.keyword = value"
        />
      </div>
      <a-tabs class="search-list-tabs" :active-key="listType" @change="changeListType">
        <a-tab-pane key="articles" class="!hidden" tab="文章" />
        <a-tab-pane key="projects" class="!hidden" tab="项目" />
        <a-tab-pane key="applications" class="!hidden" tab="应用" />
      </a-tabs>
    </template>
    <router-view>
      <template #default="{ Component }">
        <keep-alive>
          <component :is="Component" />
        </keep-alive>
      </template>
    </router-view>
  </g-pro-page-container>
</template>

<style lang="less" scoped>
.search-list-tabs {
  &:deep(.ant-tabs-nav) {
    --at-apply: mb-0;
    
    &::before {
      --at-apply: border-bottom-0;
    }
    
    .ant-tabs-tab {
      --at-apply: text-16px;
    }
  }
}
</style>
