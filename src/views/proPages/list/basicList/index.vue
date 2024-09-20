<script setup lang="ts">
import type { ProTableProps, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type {
  BasicCountState,
  BasicListItemDataType,
  BasicSearchParmas
} from '@gx-mock/datasSource/list/basic'
import type { CountState } from './utils/config'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { deleteBasicList, getBasicCount, getBasicList } from '@/services/listCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { GProCard } from '@gx-design-vue/pro-card'
import { useTable } from '@gx-design-vue/pro-table'
import { useMounted } from '@vueuse/core'
import { message } from 'ant-design-vue'
import { Teleport } from 'vue'
import OperateModal from './components/OperateModal.vue'
import { defaultCountState } from './utils/config'

const isMount = useMounted()

const operate = ref()
const tableRef = ref<ProTableRef>()

const countState = reactive<CountState>({ ...defaultCountState })
const tableState = reactive<Omit<ProTableProps, 'params'> & { params: BasicSearchParmas }>({
  params: {
    status: 'all',
    title: ''
  },
  pagination: {
    pageSize: 5
  },
  columns: [],
  options: false,
  showLoading: false
})

const { reload, changeLoading } = useTable(tableRef)

const { loading } = useRequest<BasicCountState>(getBasicCount, {
  onSuccess: (data) => {
    for (const key in data) {
      if (countState[key])
        countState[key as keyof BasicCountState].count = data[key]
    }

    tableState.showLoading = true
  }
})

const getList: RequsetFunction<BasicListItemDataType, BasicSearchParmas> = async (params) => {
  const response = await getBasicList<PageResult<BasicListItemDataType>>(params)

  return {
    data: response?.data?.list || [],
    total: response?.data?.totalCount || 0,
    success: !!response
  }
}

const operateBtn = (key: 'update' | 'delete', record: BasicListItemDataType) => {
  switch (key) {
    case 'delete':
      globalConfirm({
        content: '是否确认删除？',
        async onOk() {
          changeLoading(false)
          const response = await deleteBasicList({ id: record.id })
          if (response) {
            message.success('操作成功')
            await reload({ immediate: true, removeKeys: [record.id] })
          }
          changeLoading(false)
        }
      })
      break
    case 'update':
      operate.value?.open(record.id)
      break
  }
}
</script>

<template>
  <g-pro-page-container :use-page-card="false" :loading="loading">
    <GProCard>
      <a-row>
        <a-col v-for="item in Object.keys(countState) as (keyof BasicCountState)[]" :key="item" :sm="8" :xs="24">
          <div class="flex-center flex-col gap-4px relative">
            <span class="leading-22px text-rgba-[0-0-0-0.65]">{{ countState[item].name }}</span>
            <span class="text-24px leading-32px text-rgba-[0-0-0-0.88]">{{ countState[item].count
              + countState[item].unit }}</span>
            <em
              v-if="item !== 'done'"
              class="lt-sm:relative lt-sm-h-0 lt-sm:my-10px absolute right-0 top-0 w-1px h-56px bg-rgba-[5-5-5-0.06]"
            />
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
          <g-input-search v-model:value="tableState.params.title" placeholder="请输入" allow-clear />
        </div>
      </template>
      <g-pro-table ref="tableRef" v-bind="tableState" :request="getList">
        <template #customRender="dataSource">
          <a-list size="large" row-key="id" :loading="loading" :data-source="dataSource">
            <template #renderItem="{ item }: { item: BasicListItemDataType }">
              <a-list-item>
                <template #actions>
                  <a key="update" @click="operateBtn('update', item)">编辑</a>
                  <a key="delete" @click="operateBtn('delete', item)">删除</a>
                </template>
                <a-list-item-meta>
                  <template #title>
                    <a :href="item.href" class="text-hidden-1">{{ item.title }}</a>
                  </template>
                  <template #avatar>
                    <g-admin-image :src="item.logo" :width="48" :height="48" class="rd-4px" />
                  </template>
                  <template #description>
                    <a-tooltip :title="item.subDescription">
                      <div class="text-hidden-1">
                        {{ item.subDescription }}
                      </div>
                    </a-tooltip>
                  </template>
                </a-list-item-meta>
                <div class="listContent">
                  <div class="listContentItem">
                    <span>Owner</span>
                    <p>{{ item.owner }}</p>
                  </div>
                  <div class="listContentItem">
                    <span>开始时间</span>
                    <p>{{ item.createTime }}</p>
                  </div>
                  <div class="listContentProgress">
                    <a-progress :stroke-width="6" :percent="item.percent" :status="item.status" />
                  </div>
                </div>
              </a-list-item>
            </template>
          </a-list>
        </template>
      </g-pro-table>
    </GProCard>
    <Teleport v-if="isMount" to=".ant-layout-has-sider>.ant-layout">
      <div class="mt-32px h-49px" />
    </Teleport>
    <Teleport to="body">
      <div class="footer-bar">
        <a-button @click="operate?.open()">
          <template #icon>
            <plus-outlined />
          </template>
          添加
        </a-button>
      </div>
    </Teleport>
    <OperateModal ref="operate" @ok="reload" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
@import "./style";
</style>
