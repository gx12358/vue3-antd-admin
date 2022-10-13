<template>
  <div :class="$style.filterCardList">
    <a-spin :spinning="loading">
      <a-card :bordered="false" :bodyStyle="{ padding: 0 }">
        <a-form :class="$style['page-list-search']" :model="listParams">
          <a-form-item
            :class="$style['form-list-row']"
            style="padding-bottom: 11px"
            label="所属类目"
          >
            <g-tag-select v-model:value="listParams.category" expandable @change="changeSearch">
              <g-tag-select-option :key="item" v-for="item in 12" :value="`cat${item}`">
                {{ `类目${item}` }}
              </g-tag-select-option>
            </g-tag-select>
          </a-form-item>
          <a-form-item
            :class="[$style['form-list-row'], $style['form-list-row-last']]"
            label="其它选项"
          >
            <a-row :gutter="16">
              <a-col :lg="8" :md="10" :sm="10" :xs="24">
                <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="作者">
                  <a-select
                    v-model:value="listParams.author"
                    placeholder="不限"
                    allow-clear
                    style="width: 100%; max-width: 200px"
                    @change="changeSearch"
                  >
                    <a-select-option value="lisa">王昭君</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :lg="8" :md="10" :sm="10" :xs="24">
                <a-form-item :wrapper-col="formItemLayout.wrapperCol" label="好评度">
                  <a-select
                    v-model:value="listParams.rate"
                    placeholder="不限"
                    allow-clear
                    style="width: 100%; max-width: 200px"
                    @change="changeSearch"
                  >
                    <a-select-option value="good">优秀</a-select-option>
                    <a-select-option value="normal">普通</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
          </a-form-item>
        </a-form>
      </a-card>
      <br />
      <a-list
        rowKey="id"
        :grid="{
          gutter: 16,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4
        }"
        :data-source="listSource"
      >
        <template #renderItem="{ item }">
          <a-list-item :key="item.id">
            <a-card :class="$style.cardItem" hoverable :body-style="{ paddingBottom: '20px' }">
              <template #actions>
                <a-tooltip key="download" title="下载">
                  <DownloadOutlined />
                </a-tooltip>
                <a-tooltip key="edit" title="编辑">
                  <EditOutlined />
                </a-tooltip>
                <a-tooltip key="share" title="分享">
                  <ShareAltOutlined />
                </a-tooltip>
                <a-dropdown key="ellipsis" title="下载">
                  <template #overlay>
                    <a-menu>
                      <a-menu-item>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                          1st menu item
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                          2st menu item
                        </a>
                      </a-menu-item>
                      <a-menu-item>
                        <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                          3st menu item
                        </a>
                      </a-menu-item>
                    </a-menu>
                  </template>
                  <EllipsisOutlined />
                </a-dropdown>
              </template>
              <a-card-meta :title="item.title">
                <template #avatar>
                  <a-avatar size="small" :src="item.avatar" />
                </template>
              </a-card-meta>
              <div :class="$style.cardItemContent">
                <div :class="$style.cardInfo">
                  <div>
                    <p>活跃用户</p>
                    <p>
                      <span>
                        {{ formatWan(item.activeUser) }}
                        <span
                          v-if="(item.activeUser || 0) > 10000"
                          style="
                            position: relative;
                            top: -2px;
                            margin-left: 2px;
                            font-size: 14px;
                            font-style: normal;
                          "
                        >
                          万
                        </span>
                      </span>
                    </p>
                  </div>
                  <div>
                    <p>新增用户</p>
                    <p><Statistic :value="item.newUser" /></p>
                  </div>
                </div>
              </div>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </a-spin>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { Statistic } from 'ant-design-vue'
import {
  DownloadOutlined,
  EditOutlined,
  ShareAltOutlined,
  EllipsisOutlined
} from '@ant-design/icons-vue'
import { onMountedOrActivated } from '@gx-admin/hooks/core'
import type { ListItemDataType } from '@/services/list/search'
import { queryFakeList } from '@/services/list/search'
import { formItemLayout } from '../utils/config'

interface articleStateType {
  pageConfig: any
  listParams: any
  loading: boolean
  listSource: any[]
}

export default defineComponent({
  components: {
    Statistic,
    DownloadOutlined,
    EditOutlined,
    ShareAltOutlined,
    EllipsisOutlined
  },
  setup() {
    const state: articleStateType = reactive({
      pageConfig: {
        pageNum: 1,
        pageSize: 8
      },
      listParams: {
        category: [],
        author: undefined,
        rate: undefined
      },
      loading: false,
      listSource: []
    })
    onMountedOrActivated(() => {
      onActiveLoad()
    })
    const onActiveLoad = (title?: string) => {
      if (state.listSource.length === 0) {
        state.loading = true
        setTimeout(() => {
          getFakeList(title)
        }, 500)
      }
    }
    const refresh = (title?: string) => {
      state.listSource = []
      state.listParams = {
        category: [],
        author: undefined,
        rate: undefined
      }
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
      }
      state.loading = false
    }
    const changeSearch = () => {
      onActiveLoad()
    }
    const formatWan = (val: number) => {
      const v = val * 1
      if (!v || Number.isNaN(v)) return 0
      if (val > 10000) return Math.floor(val / 10000)
      return val
    }
    return {
      ...toRefs(state),
      formItemLayout,
      refresh,
      formatWan,
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
