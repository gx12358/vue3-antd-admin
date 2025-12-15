<script setup lang="ts">
import type { SearchState, TableRow } from './typing'
import dayjs from 'dayjs'
import GInputSearch from '@/components/design/g-input-search/index.vue'
import { useProPageTable } from '@/hooks/web'
import { deleteList, getList } from '@/services/demo'
import OperateModal from './components/OperateModal.vue'

const operate = useTemplateRef<InstanceType<typeof OperateModal>>('operate')
const tableRef = ref()

const [
  { reload, tableState }
] = useProPageTable<TableRow, SearchState>(tableRef, {
  state: {
    headerTitle: '基本列表',
    params: {
      type: 'all',
      title: ''
    },
    pagination: {
      pageSize: 5
    },
    columns: [],
  },
  request: getList,
  deleteProps: {
    requestFn: deleteList
  }
})
</script>

<template>
  <g-pro-page-container :use-page-card="false">
    <div class="gx-card">
      <div class="gx-card-body flex">
        <div class="flex-center flex-col gap-4px flex-1 bd-r-split">
          <span class="leading-22px text-description">我的待办</span>
          <span class="text-24px leading-32px">8个任务</span>
        </div>
        <div class="flex-center flex-col gap-4px flex-1 bd-r-split">
          <span class="leading-22px text-description">本周任务平均处理时间</span>
          <span class="text-24px leading-32px">32分钟</span>
        </div>
        <div class="flex-center flex-col gap-4px flex-1">
          <span class="leading-22px text-description">本周完成任务数</span>
          <span class="text-24px leading-32px">24个任务</span>
        </div>
      </div>
    </div>
    <div class="mt-24px gx-card">
      <div class="gx-card-body">
        <g-pro-table ref="tableRef" v-bind="tableState">
          <template #actions>
            <a-radio-group v-model:value="tableState.params.type">
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
            <GInputSearch v-model:value="tableState.params.title" class="w-300px" placeholder="请输入" allow-clear />
          </template>
          <template #customRender="{ dataSource }: { dataSource: TableRow[] }">
            <div v-for="item in dataSource" :key="item.id" class="flex items-center justify-between px-24px py-16px bd-b-split">
              <div class="max-w-full flex-1 flex items-start gap-16px">
                <a-avatar :src="item.logo" :size="48" shape="square" />
                <div class="flex-1 w-0">
                  <div class="leading-base mb-4px">
                    <a class="gx-admin-a text-base">{{ item.title }}</a>
                  </div>
                  <div class="leading-base text-description">
                    {{ item.subDescription }}
                  </div>
                </div>
              </div>
              <div class="flex gap-40px items-center">
                <div class="flex flex-col gap-4px text-secondary">
                  <div class="leading-20px">
                    Owner
                  </div>
                  <div class="leading-22px">
                    {{ item.owner }}
                  </div>
                </div>
                <div class="flex flex-col gap-4px text-secondary">
                  <div class="leading-20px">
                    开始时间
                  </div>
                  <div class="leading-22px">
                    {{ dayjs(item.createTime).format('YYYY-MM-DD HH:mm') }}
                  </div>
                </div>
                <a-progress
                  :percent="item.percent"
                  :status="item.status"
                  :size="6"
                  class="w-300px"
                />
              </div>
              <div class="flex-auto-0 ml-48px flex items-center gap-8px">
                <a class="gx-admin-a text-description">编辑</a>
                <a-dropdown>
                  <a class="gx-admin-a text-description">
                    更多 <down-outlined />
                  </a>
                  <template #overlay>
                    <a-menu>
                      <a-menu-item key="update-1">
                        操作一
                      </a-menu-item>
                      <a-menu-item key="update-2">
                        操作二
                      </a-menu-item>
                    </a-menu>
                  </template>
                </a-dropdown>
              </div>
            </div>
          </template>
        </g-pro-table>
      </div>
    </div>
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
