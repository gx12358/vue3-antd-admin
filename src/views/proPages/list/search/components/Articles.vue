<script setup lang="ts">
import type { ListItemDataType } from '@gx-mock/datasSource/list'
import type { SearchState } from './typings'
import Empty from '@/components/GlobalLayout/Empty/index.vue'
import { getArticleList } from '@/services/listCenter'
import { useDict } from '@gx-admin/hooks/system'
import { useScrollPageList } from '@gx-admin/hooks/web'
import { GProCard } from '@gx-design-vue/pro-card'
import dayjs from 'dayjs'
import { useSearchListContext } from '../context'
import { owners } from '../utils/config'
import CommonSearch from './components/CommonSearch.vue'
import useSearchForm from './hooks/useSearchForm'

const { dictState } = useDict('sys_common_author')

const { searchParams } = useSearchForm()
const { loading: spinning } = useSearchListContext()

const {
  list: articleData,
  hasEmpty,
  state,
  loading,
  initLoading
} = useScrollPageList<ListItemDataType, SearchState>(
  getArticleList,
  {
    fetchNextType: 'scroll',
    otherParmas: searchParams,
    scrollBotomm: 124 + 24 * 2 + 200
  }
)

const authorOptions = computed(() => [ owners ].concat(
  dictState.sys_common_author?.data?.map(item => ({
    label: item.dictLabel,
    value: item.dictValue
  })) || [] as any
))
const authorFetchLoading = computed(() => dictState.sys_common_author?.loading === undefined
  ? true
  : dictState.sys_common_author?.loading)

const filterOption = (input: string, option: { label: string; value: string; }) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}

watchEffect(() => {
  spinning.value = loading?.value
})
</script>

<template>
  <GProCard>
    <CommonSearch v-model:state="searchParams" :disabled="loading">
      <template #author>
        <div class="max-md-flex-wrap form-item">
          <div class="label shrink-0 max-md-w-full max-md-mb-8px mr-15px text-hex-999">
            所属作者：
          </div>
          <div class="flex items-center flex-main gap-10px">
            <a-select
              v-model:value="searchParams.authorList"
              class="max-md-w-60% w-220px max-w-550px"
              mode="multiple"
              placeholder="请选择所示作者"
              :options="authorOptions"
              :filter-option="filterOption"
              :not-found-content="authorFetchLoading ? undefined : null"
            >
              <template v-if="authorFetchLoading" #notFoundContent>
                <a-spin size="small" />
              </template>
            </a-select>
            <a class="shrink-0" @click="searchParams.authorList = [ owners.value ]">只看自己的</a>
          </div>
        </div>
      </template>
    </CommonSearch>
  </GProCard>
  <GProCard class="mt-24px">
    <g-spin :spinning="initLoading">
      <div class="min-h-100px" :class="hasEmpty ? 'flex-center py-20px' : ''">
        <Empty v-if="hasEmpty" />
        <template v-else>
          <div
            v-for="(item, sort) in articleData"
            :key="item.id"
            class="pb-16px border-b-width-1px border-b-width-1px border-b-hex-0e050505 border-b-solid"
            :class="sort === 0 ? '' : 'pt-16px'"
          >
            <div class="text-hex-#e0000000 text-16px leading-18px mb-12px">
              {{ item.title }}
            </div>
            <div class="flex items-center gap-8px">
              <a-tag class="m-0">
                Ant Design
              </a-tag>
              <a-tag class="m-0">
                设计语言
              </a-tag>
              <a-tag class="m-0">
                蚂蚁金服
              </a-tag>
            </div>
            <div class="leading-22px max-w-720px mt-16px">
              {{ item.description }}
            </div>
            <div class="flex items-center mt-16px">
              <a-avatar :src="item.avatar" size="small" />
              <a class="ml-4px" :href="item.href">{{ item.owner }}</a> <span class="mx-4px">发布在</span> <a :href="item.href">{{ item.href }}</a>
              <span class="ml-16px">{{ dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss') }}</span>
            </div>
            <div class="mt-16px flex items-center text-hex-8c8c8c gap-16px">
              <div class="flex items-center gap-8px">
                <star-outlined />
                {{ item.star }}
              </div>
              <i class="h-14px w-1px bg-hex-ccc" />
              <div class="flex items-center gap-8px">
                <like-outlined />
                {{ item.like }}
              </div>
              <i class="h-14px w-1px bg-hex-ccc" />
              <div class="flex items-center gap-8px">
                <message-outlined />
                {{ item.message }}
              </div>
            </div>
          </div>
          <div v-if="state.init && loading" class="flex-center mt-24px">
            <g-spin />
          </div>
          <div v-if="!state.isMore" class="flex-center mt-24px text-hex-ccc text-12px">
            已经到底部了哦~
          </div>
        </template>
      </div>
    </g-spin>
  </GProCard>
</template>

<style scoped lang="less">
.form-item {
  --at-apply: flex items-start leading-32px border-b-hex-f0f0f0 pb-10px border-b-1px border-b-solid mb-15px;
}
</style>
