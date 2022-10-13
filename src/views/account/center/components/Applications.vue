<template>
  <a-list
    :class="$style.filterCardList"
    row-key="id"
    itemLayout="vertical"
    :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }"
    :dataSource="listData || []"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.id">
        <a-card hoverable :bodyStyle="{ paddingBottom: 20 }">
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
            <a-dropdown key="ellipsis">
              <template #overlay>
                <a-menu>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.alipay.com/">
                      1st menu item
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.taobao.com/">
                      2nd menu item
                    </a>
                  </a-menu-item>
                  <a-menu-item>
                    <a target="_blank" rel="noopener noreferrer" href="https://www.tmall.com/">
                      3d menu item
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
                  {{ formatWan(item.activeUser) }}
                  <span
                    v-if="(item.activeUser || 0) > 10000"
                    style="font-size: 14px; font-style: normal"
                  >
                    万
                  </span>
                </p>
              </div>
              <div>
                <p>新增用户</p>
                <p>
                  <Statistic :value="item.newUser" />
                </p>
              </div>
            </div>
          </div>
        </a-card>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import dayjs from 'dayjs'
import { Statistic } from 'ant-design-vue'
import {
  DownloadOutlined,
  EditOutlined,
  ShareAltOutlined,
  EllipsisOutlined
} from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Statistic,
    DownloadOutlined,
    EditOutlined,
    ShareAltOutlined,
    EllipsisOutlined
  },
  props: {
    datasource: Array,
    default: () => []
  },
  setup(props) {
    const state = reactive({
      listData: [] as any
    })
    watch(
      () => props.datasource,
      (val) => {
        state.listData = (val || []).map((item: any) => {
          return {
            ...item,
            updatedAt: dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm')
          }
        })
      },
      {
        deep: true,
        immediate: true
      }
    )

    const formatWan = (val: number) => {
      const v = val * 1
      if (!v || Number.isNaN(v)) return 0
      if (val > 10000) return Math.floor(val / 10000)
      return val
    }

    return {
      ...toRefs(state),
      formatWan
    }
  }
})
</script>

<style lang="less" module>
.filterCardList {
  margin-bottom: -24px;

  :global {
    .ant-card-meta-content {
      margin-top: 0;
    }

    // disabled white space
    .ant-card-meta-avatar {
      font-size: 0;
    }

    .ant-list .ant-list-item-content-single {
      max-width: 100%;
    }
  }

  .cardInfo {
    margin-top: 16px;
    margin-left: 40px;
    zoom: 1;

    &::before,
    &::after {
      display: table;
      content: ' ';
    }

    &::after {
      clear: both;
      height: 0;
      font-size: 0;
      visibility: hidden;
    }

    & > div {
      position: relative;
      float: left;
      width: 50%;
      text-align: left;

      p {
        margin: 0;
        font-size: 24px;
        line-height: 32px;
      }

      p:first-child {
        margin-bottom: 4px;
        color: @text-color-secondary;
        font-size: 12px;
        line-height: 20px;
      }
    }
  }
}
</style>
