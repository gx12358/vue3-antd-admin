<script setup lang="ts">
import type { ListItemDataType, SearchState } from './typings'
import dayjs from 'dayjs'
import { useScrollPageList } from '@/hooks/web'
import { getList } from '@/services/demo'
import CommonSearch from './components/CommonSearch.vue'
import { useSearchListContext } from './context'
import useSearchForm from './hooks/useSearchForm'

const { searchParams } = useSearchForm()
const { loading: spinning } = useSearchListContext()

const {
  list,
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
</script>

<template>
  <div class="gx-card">
    <div class="gx-card-body">
      <CommonSearch v-model:state="searchParams" :disabled="loading" />
    </div>
  </div>
  <a-row :gutter="[16, 16]" class="mt-24px">
    <a-col v-for="item in list" :key="item.id" :span="6">
      <div class="gx-card hover">
        <div class="gx-card-cover">
          <div class="w-full relative rd-t-8px overflow-hidden cursor-pointer" :style="{ paddingBottom: `${(0.59) * 100}%` }">
            <g-admin-image
              class="max-w-full absolute inset-0 z-1"
              :src="item.cover"
              fit="cover"
              :preview="false"
            />
          </div>
        </div>
        <div class="gx-card-body">
          <div class="text-heading text-16px font-600 text-hidden-1 mb-8px">
            {{ item.title }}
          </div>
          <div class="leading-base text-hidden-3 mb-14px">
            {{ item.subDescription }}
          </div>
          <div class="flex items-center justify-between">
            <span class=" text-rgba-[0-0-0-0.65] text-12px">
              {{ dayjs(item.updateTime).fromNow() }}
            </span>

            <a-avatar-group size="small" :max-count="4">
              <template v-for="member in item.members" :key="member.id">
                <a-tooltip placement="top" :title="member.name">
                  <a-avatar :src="member.avatar" />
                </a-tooltip>
              </template>
            </a-avatar-group>
          </div>
        </div>
      </div>
    </a-col>
  </a-row>
</template>

<style scoped lang="less">

</style>
