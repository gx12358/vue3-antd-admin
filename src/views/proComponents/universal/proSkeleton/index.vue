<template>
  <g-pro-page-container :contentStyle="{ position: 'relative' }" :class="$style['skeleton-block']">
    <g-doc :anchorLinks="links">
      <BasicSkelecton />
      <ListSkelecton />
      <ResultSkelecton />
      <DescriptionsSkelecton />
    </g-doc>
  </g-pro-page-container>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import BasicSkelecton from './components/BasicSkelecton.vue'
import ListSkelecton from './components/ListSkelecton.vue'
import ResultSkelecton from './components/ResultSkelecton.vue'
import DescriptionsSkelecton from './components/DescriptionsSkelecton.vue'

export default defineComponent({
  components: {
    BasicSkelecton,
    ListSkelecton,
    ResultSkelecton,
    DescriptionsSkelecton
  },
  setup() {
    const state = reactive({
      links: [
        {
          link: '#g-skeleton-demo',
          name: 'Skeleton'
        },
        {
          link: '#g-skeleton-api',
          name: 'Skeleton-API'
        },
        {
          link: '#g-pro-skeleton',
          name: 'ProSkeleton'
        },
        {
          link: '#g-pro-skeleton-list',
          level: 2,
          name: 'List'
        },
        {
          link: '#g-pro-skeleton-result',
          level: 2,
          name: '结果页'
        },
        {
          link: '#g-pro-skeleton-descriptions',
          level: 2,
          name: '详情页'
        },
        {
          link: '#g-pro-skeleton-api',
          name: 'ProSkeleton-API'
        }
      ]
    })
    return {
      ...toRefs(state)
    }
  }
})
</script>

<style lang="less" module>
.skeleton-block {
  :global {
    .ant-divider-horizontal.ant-divider-with-text-left::before {
      width: 0;
    }

    .ant-divider-inner-text {
      padding-left: 0;
    }
  }
}
</style>
