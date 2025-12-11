<script setup lang="ts" name="SearchList">
import type { ComputedRef } from 'vue'
import { useDict } from '@/hooks/system'
import { provideSearchListContext } from './context'

type ListType = 'articles' | 'projects' | 'applications'

useDict('sys_common_category')

const route = useRoute()
const router = useRouter()
const { dict } = useStore()

const state = reactive({
  keyword: '',
  keywordStr: ''
})
const loading = ref(false)
const listType: ComputedRef<ListType> = computed(() => route.path.split('/').reverse()?.[0] as ListType || 'articles')

const changeListType = (value: ListType) => {
  router.push({ path: '/pro-pages/list/search/' + value })
}

const classData = computed(() => dict.sys_common_category.data || [])

provideSearchListContext({
  classData,
  keyword: computed(() => state.keyword),
  loading
})
</script>

<template>
  <g-pro-page-container :loading="loading" :page-header-style="{ paddingBottom: 0 }" :use-page-card="false">
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
      <a-tabs :active-key="listType" @change="val => changeListType(val as ListType)">
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
</style>
