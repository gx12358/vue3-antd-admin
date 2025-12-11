<script setup lang="ts">
import type { MockTableRecord, SearchConfig } from '@/services/demo/table'
import { GProCard } from '@gx-design-vue/pro-card'
import { useProPageTable } from '@/hooks/web'
import { deleteList, getList } from '@/services/demo'
import OperateModal from './components/OperateModal.vue'

const operate = useTemplateRef<InstanceType<typeof OperateModal>>('operate')
const tableRef = ref()

const [
  { reload, tableState, loading },
  actions
] = useProPageTable<MockTableRecord, SearchConfig>(tableRef, {
  state: {
    params: {
      status: 'all',
      title: ''
    },
    search: {
      manualRequest: false,
    },
    pagination: {
      pageSize: 5
    },
    columns: [],
    showLoading: false
  },
  request: getList,
  deleteProps: {
    requestFn: deleteList
  }
})
</script>

<template>
  <g-pro-page-container :use-page-card="false" :loading="loading">
    <GProCard>
      <a-row>
        <a-col :sm="8" :xs="24">
          <div class="flex-center flex-col gap-4px relative">
            <span class="leading-22px text-rgba-[0-0-0-0.65]">我的待办</span>
            <span class="text-24px leading-32px text-rgba-[0-0-0-0.88]">8个任务</span>
          </div>
        </a-col>
        <a-col :sm="8" :xs="24">
          <div class="flex-center flex-col gap-4px relative">
            <span class="leading-22px text-rgba-[0-0-0-0.65]">本周任务平均处理时间</span>
            <span class="text-24px leading-32px text-rgba-[0-0-0-0.88]">32分钟</span>
          </div>
        </a-col>
        <a-col :sm="8" :xs="24">
          <div class="flex-center flex-col gap-4px relative">
            <span class="leading-22px text-rgba-[0-0-0-0.65]">本周完成任务数</span>
            <span class="text-24px leading-32px text-rgba-[0-0-0-0.88]">24个任务</span>
          </div>
        </a-col>
      </a-row>
    </GProCard>
    <GProCard class="mt-24px" title="基本列表">
      <template #extra>
        <div class="flex gap-16px lt-sm:flex-wrap">
          <div class="flex-shrink-0 flex lt-sm:justify-end lt-sm:w-full">
            <a-radio-group v-model:value="tableState.params.status">
              <a-radio-button value="all">
                全部
              </a-radio-button>
              <a-radio-button value="normal">
                等待中
              </a-radio-button>
              <a-radio-button value="active">
                进行中
              </a-radio-button>
            </a-radio-group>
          </div>
          <a-input-search v-model:value="tableState.params.title" placeholder="请输入" allow-clear />
        </div>
      </template>
      <g-pro-table ref="tableRef" v-bind="tableState">
        <template #customRender="{ dataSource }">
          <a-list size="large" row-key="id" :data-source="dataSource">
            <template #renderItem="{ item }: { item: MockTableRecord }">
              <a-list-item>
                <template #actions>
                  <a key="update" @click="operate?.open(item.id)">编辑</a>
                  <a key="delete" @click="actions.remove([item.id])">删除</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a class="text-hidden-1">{{ item.title }}</a>
                  </template>
                  <template #avatar>
                    <g-admin-image :src="item.logo" :width="48" :height="48" class="rd-4px" />
                  </template>
                  <template #description>
                    <a-tooltip :title="item.description">
                      <div class="text-hidden-1">
                        {{ item.description }}
                      </div>
                    </a-tooltip>
                  </template>
                </a-list-item-meta>
                <div class="listContent">
                  <div class="listContentItem">
                    <span>Owner</span>
                    <p>{{ item.author }}</p>
                  </div>
                  <div class="listContentItem">
                    <span>开始时间</span>
                    <p>{{ item.createTime }}</p>
                  </div>
                  <div class="listContentProgress">
                    <a-progress
                      :stroke-width="6"
                      :percent="item.percent"
                      :status="item.percent < 100 ? 'active' : 'success'"
                    />
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </template>
      </g-pro-table>
    </GProCard>
    <template #footer>
      <a-button @click="operate?.open()">
        <template #icon>
          <plus-outlined />
        </template>
        添加
      </a-button>
    </template>
    <OperateModal ref="operate" @ok="reload" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
@import "./style";
</style>
