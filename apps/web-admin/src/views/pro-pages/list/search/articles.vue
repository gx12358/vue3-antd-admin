<script setup lang="ts">
import type { ListItemDataType, SearchState } from './typing'
import dayjs from 'dayjs'
import { useScrollPageList } from '@/hooks/web'
import { getList } from '@/services/demo'
import CommonSearch from './components/CommonSearch.vue'
import { useSearchListContext } from './context'
import useSearchForm from './hooks/useSearchForm'
import { authorList } from './utils/config'

const { searchParams } = useSearchForm()
const { loading: spinning } = useSearchListContext()

const {
  list,
  hasEmpty,
  state,
  loading,
} = useScrollPageList<ListItemDataType, SearchState>(
  getList,
  {
    reloadClear: false,
    fetchNextType: 'scroll',
    params: searchParams,
    scrollBottom: 200
  }
)

watchEffect(() => {
  spinning.value = loading.value
})

const filterOption = (input: string, option: { label: string; value: string; }) => {
  return option.label.toLowerCase().includes(input.toLowerCase())
}
</script>

<template>
  <div class="gx-card">
    <div class="gx-card-body">
      <CommonSearch v-model:state="searchParams" :disabled="loading">
        <template #author>
          <div class="max-md-flex-wrap form-item">
            <div class="label shrink-0 mr-15px">
              所属作者：
            </div>
            <div class="flex items-center flex-main gap-10px">
              <a-select
                v-model:value="searchParams.authorList"
                class="max-md-w-60% w-220px max-w-550px"
                mode="multiple"
                placeholder="请选择所示作者"
                :options="authorList"
                :filter-option="filterOption"
              />
              <a class="shrink-0" @click="searchParams.authorList = [ 'wzj' ]">只看自己的</a>
            </div>
          </div>
        </template>
      </CommonSearch>
    </div>
  </div>
  <div class="gx-card mt-24px">
    <div class="gx-card-body">
      <div class="min-h-100px" :class="hasEmpty ? 'flex-center py-20px' : ''">
        <g-empty v-if="hasEmpty" />
        <template v-else>
          <div
            v-for="(item, sort) in list"
            :key="item.id"
            class="pb-16px bd-b-split"
            :class="sort === 0 ? '' : 'pt-16px'"
          >
            <div class="text-16px leading-lg font-600 mb-12px">
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
              {{ item.content }}
            </div>
            <div class="flex items-center mt-16px">
              <a-avatar :src="item.logo" size="small" />
              <a class="ml-4px" :href="item.href">{{ item.owner }}</a>
              <span class="mx-4px">发布在</span> <a :href="item.href">{{ item.href }}</a>
              <span class="ml-16px">{{ dayjs(item.updateTime).format('YYYY-MM-DD HH:mm:ss') }}</span>
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
    </div>
  </div>
</template>

<style scoped lang="less">
@import "./style";
</style>
