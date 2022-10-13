<template>
  <a-list
    :class="$style.articleList"
    row-key="id"
    itemLayout="vertical"
    :dataSource="listData || []"
  >
    <template #renderItem="{ item }">
      <a-list-item :key="item.id">
        <template #actions>
          <span key="star"> <StarTwoTone /> {{ item.star }} </span>
          <span key="like"> <LikeOutlined /> {{ item.like }} </span>
          <span key="message"> <MessageFilled /> {{ item.message }} </span>
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
        <div :class="$style.listContent">
          <div :class="$style.description">{{ item.content }}</div>
          <div :class="$style.extra">
            <a-avatar :src="item.avatar" size="small" />
            <a :href="item.href">{{ item.owner }}</a> 发布在
            <a :href="item.href">{{ item.href }}</a>
            <em>{{ item.updatedAt }}</em>
          </div>
        </div>
      </a-list-item>
    </template>
  </a-list>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs, watch } from 'vue'
import dayjs from 'dayjs'
import { Tag } from 'ant-design-vue'
import { StarTwoTone, LikeOutlined, MessageFilled } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    Tag,
    StarTwoTone,
    LikeOutlined,
    MessageFilled
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
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" module>
.articleList {
  :global {
    .ant-list-item:first-child {
      padding-top: 0;
    }
  }
}

a.listItemMetaTitle {
  color: @heading-color;
}

.listContent {
  .description {
    max-width: 720px;
    line-height: 22px;
  }

  .extra {
    margin-top: 16px;
    line-height: 22px;
    color: @text-color-secondary;

    & > :global(.ant-avatar) {
      position: relative;
      top: 1px;
      width: 20px;
      height: 20px;
      margin-right: 8px;
      vertical-align: top;
    }

    & > em {
      margin-left: 16px;
      font-style: normal;
      color: @disabled-color;
    }
  }
}

@media screen and (max-width: @screen-xs) {
  .listContent {
    .extra {
      & > em {
        display: block;
        margin-top: 8px;
        margin-left: 0;
      }
    }
  }
}
</style>
