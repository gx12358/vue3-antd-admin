<script setup lang="ts">
import type { ProTableProps, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { ListItemDataType } from '@gx-mock/datasSource/list'
import type { SearchState } from './typings'
import { getArticleList } from '@/services/listCenter'
import { GProCard } from '@gx-design-vue/pro-card'
import { GProTable, useTable } from '@gx-design-vue/pro-table'
import dayjs from 'dayjs'
import { useSearchListContext } from '../context'
import CommonSearch from './components/CommonSearch.vue'
import useSearchForm from './hooks/useSearchForm'

const tableRef = ref<ProTableRef>()

const { searchParams } = useSearchForm()
const { loading: spinning } = useSearchListContext()

const state = reactive({
  listGrid: {
    gutter: 16,
    xs: 1,
    sm: 2,
    md: 3,
    lg: 3,
    xl: 4,
    xxl: 4
  }
})

const { loading } = useTable(tableRef)

const tableState = reactive<Partial<ProTableProps>>({
  rowKey: 'id',
  options: false,
  params: { ...searchParams },
  pagination: {
    current: 1,
    pageSize: 8
  }
})

watch(() => searchParams, () => {
  Object.assign(tableState.params, { ...searchParams })
}, { deep: true })

const getTableRequest: RequsetFunction<ListItemDataType, SearchState> = async (params) => {
  const response = await getArticleList<PageResult<ListItemDataType>>(params)
  return {
    success: !!response,
    data: response?.data?.list || [],
    total: response?.data?.totalCount || 0
  }
}

watchEffect(() => {
  spinning.value = loading?.value
})
</script>

<template>
  <GProCard>
    <CommonSearch v-model:state="searchParams" :disabled="loading === undefined ? true : loading" />
  </GProCard>
  <GProCard class="mt-24px">
    <GProTable ref="tableRef" v-bind="tableState" :request="getTableRequest">
      <template #customRender="dataSource: ListItemDataType[]">
        <a-list
          row-key="id"
          :grid="state.listGrid"
          :data-source="dataSource"
        >
          <template #renderItem="{ item }: { item: ListItemDataType }">
            <a-list-item class="!p-0 card-item">
              <a-card bordered hoverable>
                <template #cover>
                  <g-admin-image :src="item.cover" slot-image-class="w-30%" class="h-200px" fit="cover" />
                </template>
                <div class="card-title">
                  {{ item.title }}
                </div>
                <div class="text-hidden-2 leading-20px mb-14px">
                  {{ item.description }}
                </div>
                <div class="flex items-center justify-between">
                  <span class=" text-rgba-[0-0-0-0.65] text-12px">{{ dayjs(item.createdAt).fromNow() }}</span>
                  
                  <a-avatar-group size="small" :max-count="4">
                    <template v-for="member in item.members" :key="member.id">
                      <a-tooltip placement="top" :title="member.name">
                        <a-avatar :src="member.avatar" />
                      </a-tooltip>
                    </template>
                  </a-avatar-group>
                </div>
              </a-card>
            </a-list-item>
          </template>
        </a-list>
      </template>
    </GProTable>
  </GProCard>
</template>

<style scoped lang="less">
.form-item {
  --at-apply: flex items-start leading-32px border-b-hex-f0f0f0 pb-10px border-b-1px border-b-solid mb-15px;
}

.card-item {
  .card-title {
    --at-apply: font-600 text-16px mb-8px;
    transition: all .3s;
  }
  
  &:hover {
    .card-title {
      color: var(--gx-primary-color)
    }
  }
}
</style>
