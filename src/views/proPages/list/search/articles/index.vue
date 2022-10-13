<template>
  <a-spin :spinning="loading">
    <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
      <a-form :class="$style['page-list-search']" layout="inline" :model="listParams">
        <a-form-item :class="$style['form-list-row']" style="padding-bottom: 11px" label="所属类目">
          <g-tag-select v-model:value="listParams.category" expandable @change="changeSearch">
            <g-tag-select-option :key="item" v-for="item in 12" :value="`cat${item}`">
              {{ `类目${item}` }}
            </g-tag-select-option>
          </g-tag-select>
        </a-form-item>
        <a-form-item :class="$style['form-list-row']" label="owner">
          <a-select
            v-model:value="listParams.owner"
            mode="tags"
            allowClear
            :style="{
              width: listParams.owner.length === 0 ? undefined : 'auto',
              minWidth: listParams.owner.length === 0 ? '150px' : undefined
            }"
            placeholder="选择 owner"
            :options="owners"
            @change="changeSearch"
          />
          <a :class="$style.selfTrigger" @click="setOwner"> 只看自己的 </a>
        </a-form-item>
        <a-form-item
          :class="[$style['form-list-row'], $style['form-list-row-last']]"
          label="其它选项"
        >
          <a-row>
            <a-col :xl="8" :lg="10" :md="12" :sm="24" :xs="24">
              <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="活跃用户">
                <a-select
                  v-model:value="listParams.user"
                  placeholder="不限"
                  allow-clear
                  style="width: 100%; max-width: 200px"
                  @change="changeSearch"
                >
                  <a-select-option value="lisa">李三</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <a-col :xl="8" :lg="10" :md="12" :sm="24" :xs="24">
              <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="好评度">
                <a-select
                  v-model:value="listParams.rate"
                  placeholder="不限"
                  allow-clear
                  style="width: 100%; max-width: 200px"
                  @change="changeSearch"
                >
                  <a-select-option value="good">优秀</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
          </a-row>
        </a-form-item>
      </a-form>
    </a-card>
    <a-card
      :bordered="false"
      :body-style="{ padding: '8px 32px 32px 32px' }"
      style="margin-top: 24px"
    >
      <a-list size="large" rowKey="id" item-layout="vertical" :data-source="listSource">
        <template #loadMore>
          <div v-if="!loading || loadingMore" :style="{ textAlign: 'center', marginTop: '16px' }">
            <a-button @click="loadMore">
              <span v-if="loadingMore"> <LoadingOutlined /> 加载中... </span>
              <template v-else>加载更多</template>
            </a-button>
          </div>
        </template>
        <template #renderItem="{ item }">
          <a-list-item>
            <template #actions>
              <span>
                <StarOutlined style="margin-right: 8px" />
                {{ item.star }}
              </span>
              <span>
                <LikeOutlined style="margin-right: 8px" />
                {{ item.like }}
              </span>
              <span>
                <MessageOutlined style="margin-right: 8px" />
                {{ item.message }}
              </span>
            </template>
            <a-list-item-meta>
              <template #title>
                <a :class="$style.listItemMetaTitle" :href="item.href">
                  {{ item.title }}
                </a>
              </template>
              <template #description>
                <span>
                  <Tag>Ant Design</Tag>
                  <Tag>设计语言</Tag>
                  <Tag>蚂蚁金服</Tag>
                </span>
              </template>
            </a-list-item-meta>
            <ArticleListContent :data="item" />
          </a-list-item>
        </template>
      </a-list>
    </a-card>
  </a-spin>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Tag } from 'ant-design-vue'
import { StarOutlined, LikeOutlined, MessageOutlined, LoadingOutlined } from '@ant-design/icons-vue'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import type { ListItemDataType } from '@/services/list/search'
import { queryFakeList } from '@/services/list/search'
import ArticleListContent from './components/ArticleListContent.vue'
import { owners, formItemLayout } from '../utils/config'

interface articleStateType {
  pageConfig: any
  listParams: any
  loading: boolean
  loadMore: boolean
  loadingMore: boolean
  listSource: any[]
}

export default defineComponent({
  components: {
    Tag,
    StarOutlined,
    LikeOutlined,
    LoadingOutlined,
    MessageOutlined,
    ArticleListContent
  },
  setup() {
    const state: articleStateType = reactive({
      pageConfig: {
        pageNum: 1,
        pageSize: 10
      },
      listParams: {
        category: [],
        owner: ['wjh', 'zxx'],
        user: undefined,
        rate: undefined
      },
      loading: false,
      loadMore: true,
      loadingMore: false,
      listSource: []
    })
    onMountedOrActivated(() => {
      onActiveLoad()
    })
    const onActiveLoad = (title?: string) => {
      if (state.listSource.length === 0) {
        state.loading = true
        state.listParams = {
          category: [],
          owner: ['wjh', 'zxx'],
          user: undefined,
          rate: undefined
        }
        setTimeout(() => {
          getFakeList(title)
        }, 500)
      }
    }
    const refresh = (title?: string) => {
      state.listSource = []
      state.loading = true
      setTimeout(() => {
        getFakeList(title)
      }, 500)
    }
    const getFakeList = async (title?: string) => {
      state.loading = true
      const response = await queryFakeList({
        query: state.pageConfig,
        data: { ...state.listParams, title }
      })
      if (response) {
        const list: ListItemDataType[] = response?.data || []
        state.listSource = [...state.listSource, ...list]
        state.loadMore = list.length === 0
      }
      state.loading = false
      state.loadingMore = false
    }
    const loadMore = () => {
      state.loading = true
      state.loadingMore = true
      state.pageConfig.pageNum += 1
      setTimeout(() => {
        getFakeList()
      }, 500)
    }
    const setOwner = () => {
      state.listParams.owner = ['wzj']
      changeSearch()
    }
    const changeSearch = () => {
      onActiveLoad()
    }
    return {
      ...toRefs(state),
      owners,
      formItemLayout,
      refresh,
      setOwner,
      loadMore,
      changeSearch,
      onActiveLoad
    }
  }
})
</script>

<style lang="less" module>
@import './style';
@import '../style';
</style>
