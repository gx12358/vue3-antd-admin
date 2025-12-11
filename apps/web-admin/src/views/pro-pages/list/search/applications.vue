<script setup lang="ts">
import type { ListItemDataType, SearchState } from './typings'
import { useScrollPageList } from '@/hooks/web'
import { getList } from '@/services/demo'
import { numeral } from '@/utils/util'
import CommonSearch from './components/CommonSearch.vue'
import { useSearchListContext } from './context'
import useSearchForm from './hooks/useSearchForm'

const { searchParams } = useSearchForm()
const { loading: spinning } = useSearchListContext()

const { list, loading } = useScrollPageList<ListItemDataType, SearchState>(
  getList,
  {
    pageSize: 20,
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
  <div class="mt-24px grid grid-cols-4 gap-16px">
    <div v-for="item in list" :key="item.id" class="gx-card">
      <div class="gx-card-body">
        <div class="flex gap-16px">
          <a-avatar :src="item.logo" :size="22" class="shrink-0" />
          <div class="flex flex-col gap-16px flex-1">
            <div class="text-16px leading-lg font-600">
              {{ item.title }}
            </div>
            <div class="flex">
              <div class="flex-1">
                <div class="text-12px text-secondary leading-20px mb-4px">
                  活跃用户
                </div>
                <div class="text-24px leading-32px">
                  <template v-if="item.activeUser && item.activeUser > 10000">
                    <span>{{ Math.floor(item.activeUser / 10000) }}</span>
                    <span class="text-14px ml-2px">万</span>
                  </template>
                  <template v-else>
                    {{ item.activeUser }}
                  </template>
                </div>
              </div>
              <div class="flex-1">
                <div class="text-12px text-secondary leading-20px mb-4px">
                  活跃用户
                </div>
                <div class="text-24px leading-32px">
                  {{ numeral(item.newUser).format('0,0') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="bd-t-border-secondary flex">
        <a-tooltip title="下载">
          <div class="card-actions">
            <download-outlined key="setting" />
            <div class="bg-border-secondary w-1px absolute position-center-y right-0 h-[calc(100%-24px)]" />
          </div>
        </a-tooltip>
        <a-tooltip title="编辑">
          <div class="card-actions">
            <edit-outlined key="edit" />
            <div class="bg-border-secondary w-1px absolute position-center-y right-0 h-[calc(100%-24px)]" />
          </div>
        </a-tooltip>
        <a-tooltip title="分享">
          <div class="card-actions">
            <share-alt-outlined key="share" />
            <div class="bg-border-secondary w-1px absolute position-center-y right-0 h-[calc(100%-24px)]" />
          </div>
        </a-tooltip>
        <a-dropdown>
          <div class="card-actions">
            <ellipsis-outlined key="ellipsis" />
          </div>
          <template #overlay>
            <a-menu>
              <a-menu-item><a>操作一</a></a-menu-item>
              <a-menu-item><a>操作二</a></a-menu-item>
              <a-menu-item><a>操作三</a></a-menu-item>
            </a-menu>
          </template>
        </a-dropdown>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.card-actions {
  --at-apply: py-12px flex-1 hover\:text-primary duration-200 flex-center relative cursor-pointer;
}
</style>
