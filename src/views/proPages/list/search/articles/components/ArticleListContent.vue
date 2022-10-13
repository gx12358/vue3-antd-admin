<template>
  <div :class="$style.listContent">
    <div :class="$style.description">{{ data.content }}</div>
    <div :class="$style.extra">
      <a-avatar :src="data.avatar" size="small" />
      <a :href="data.href">{{ data.owner }}</a> 发布在 <a :href="data.href">{{ data.href }}</a>
      <em>{{ updatedTime }}</em>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import dayjs from 'dayjs'

type ArticleListContentProps = {
  content: VueNode
  updatedAt: number
  avatar: string
  owner: string
  href: string
}

export const articleListContentProps = {
  data: Object as PropType<ArticleListContentProps>
}

export default defineComponent({
  props: articleListContentProps,
  setup(props) {
    const updatedTime = computed(() => dayjs(props.data?.updatedAt).format('YYYY-MM-DD HH:mm'))
    return {
      updatedTime
    }
  }
})
</script>

<style lang="less" module>
@import './index';
</style>
