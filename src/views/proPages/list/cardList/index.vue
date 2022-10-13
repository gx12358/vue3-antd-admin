<template>
  <g-pro-page-container>
    <div :class="$style.cardList">
      <a-list
        rowKey="id"
        :loading="loading"
        :grid="{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4
        }"
        :dataSource="[nullData, ...list]"
      >
        <template #renderItem="{ item }">
          <a-list-item v-if="item && item.id">
            <a-card hoverable :class="$style.card">
              <template #actions>
                <a key="option1">操作一</a>
                <a key="option2">操作二</a>
              </template>
              <a-card-meta>
                <template #avatar>
                  <img :class="$style.cardAvatar" :src="item.avatar" alt="" />
                </template>
                <template #title>
                  <a>{{ item.title }}</a>
                </template>
                <template #description>
                  <a-typography-paragraph :ellipsis="{ rows: 3 }" :content="item.description" />
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
          <a-list-item v-else>
            <a-button type="dashed" :class="$style.newButton">
              <PlusOutlined />
              新增产品
            </a-button>
          </a-list-item>
        </template>
      </a-list>
    </div>
  </g-pro-page-container>
</template>

<script lang="ts">
import { computed, defineComponent, onActivated, reactive, ref, toRefs } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import type { CardListItemDataType } from '@/services/list/card'
import { getCardList } from '@/services/list/card'

export default defineComponent({
  components: {
    PlusOutlined
  },
  setup() {
    const operation = ref()
    const nullData: Partial<CardListItemDataType> = reactive({})
    const state = reactive({
      loading: false,
      list: [],
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      }
    })
    const paginationProps = computed(() => {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: state.pageConfig.pageSize,
        pageSizeOptions: ['5', '10', '30', '50', '100'],
        total: state.pageConfig.total,
        onChange: (page: number, pageSize: number) => {
          state.pageConfig.pageNum = page
          state.pageConfig.pageSize = pageSize
          getListData()
        }
      }
    })
    onActivated(() => {
      getListData()
    })
    const getListData = async () => {
      state.loading = true
      const response: any = await getCardList({
        ...state.pageConfig
      })
      if (response) {
        state.list = response.data?.list || []
        state.pageConfig.total = response.data?.total || 0
      }
      state.loading = false
    }
    return {
      ...toRefs(state),
      nullData,
      operation,
      paginationProps,
      getListData
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
