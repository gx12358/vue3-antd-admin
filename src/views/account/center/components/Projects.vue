<template>
  <a-list
    :class="$style.coverCardList"
    row-key="id"
    :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }"
    :dataSource="listData || []"
  >
    <template #renderItem="{ item }">
      <a-list-item>
        <a-card :class="$style.card" hoverable>
          <template #cover>
            <img :src="item.cover" :alt="item.title" />
          </template>
          <a-card-meta>
            <template #title
              ><a>{{ item.title }}</a></template
            >
            <template #description>{{ item.subDescription }}</template>
          </a-card-meta>
          <div :class="$style.cardItemContent">
            <span>{{ item.updatedAt }}</span>
            <div :class="$style.avatarList">
              <AvatarList size="small">
                <AvatarListItem
                  v-for="member in item.members"
                  :key="`${item.id}-avatar-${member.id}`"
                  :src="member.avatar"
                  :tips="member.name"
                />
              </AvatarList>
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
import AvatarList from './AvatarList'

const AvatarListItem = AvatarList.Item

export default defineComponent({
  props: {
    datasource: Array,
    default: () => []
  },
  components: {
    AvatarList,
    AvatarListItem
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
            updatedAt: dayjs(item.updatedAt).fromNow()
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
.coverCardList {
  .card {
    :global {
      .ant-card-meta-title {
        margin-bottom: 4px;

        & > a {
          display: inline-block;
          max-width: 100%;
          color: @heading-color;
        }
      }

      .ant-card-meta-description {
        height: 44px;
        overflow: hidden;
        line-height: 22px;
      }
    }

    &:hover {
      :global {
        .ant-card-meta-title > a {
          color: var(--ant-primary-color);
        }
      }
    }
  }

  .cardItemContent {
    display: flex;
    height: 20px;
    margin-top: 16px;
    margin-bottom: -4px;
    line-height: 20px;

    & > span {
      flex: 1;
      font-size: 12px;
      color: @text-color-secondary;
    }

    .avatarList {
      flex: 0 1 auto;
    }
  }

  .cardList {
    margin-top: 24px;
  }

  :global {
    .ant-list .ant-list-item-content-single {
      max-width: 100%;
    }
  }
}
</style>
