<script setup lang="ts">
import type { ProTableProps, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { ListItemDataType } from '@gx-mock/datasSource/list'
import { getArticleList } from '@/services/listCenter'
import { toConvertNumberShow } from '@/utils/util'
import { GProCard } from '@gx-design-vue/pro-card'
import { GProTable, useTable } from '@gx-design-vue/pro-table'
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

const getTableRequest: RequsetFunction<ListItemDataType> = async (params) => {
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
            <a-list-item class="!p-0">
              <a-card bordered hoverable>
                <div class="flex gap-16px items-start">
                  <a-avatar :src="item.logo" size="small" />
                  <div class="flex flex-col gap-16px flex-auto">
                    <div class="text-16px font-600 text-hidden-1">
                      {{ item.title }}
                    </div>
                    <div class="flex flex-auto items-center justify-between">
                      <div class="flex flex-col gap-4px">
                        <div class="text-rgba-[0-0-0-0.65] text-12px  leading-20px">
                          活跃用户
                        </div>
                        <div class="text-24px leading-32px">
                          {{ toConvertNumberShow(item.activeUser, { showStr: false }).numberValue }}<span class="ml-2px text-14px relative top-[-2px]">万</span>
                        </div>
                      </div>
                      <div class="flex flex-col gap-4px">
                        <div class="text-rgba-[0-0-0-0.65] text-12px  leading-20px">
                          新增用户
                        </div>
                        <div class="text-24px leading-32px">
                          {{ toConvertNumberShow(item.newUser, { showStr: false }).numberValue }}<span class="ml-2px text-14px relative top-[-2px]">万</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <template #actions>
                  <a-tooltip title="下载">
                    <download-outlined key="setting" />
                  </a-tooltip>
                  <a-tooltip title="编辑">
                    <edit-outlined key="edit" />
                  </a-tooltip>
                  <a-tooltip title="分享">
                    <share-alt-outlined key="share" />
                  </a-tooltip>
                  <a-dropdown>
                    <ellipsis-outlined key="ellipsis" />
                    <template #overlay>
                      <a-menu>
                        <a-menu-item><a>操作一</a></a-menu-item>
                        <a-menu-item><a>操作二</a></a-menu-item>
                        <a-menu-item><a>操作三</a></a-menu-item>
                      </a-menu>
                    </template>
                  </a-dropdown>
                </template>
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
</style>
