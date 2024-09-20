<script setup lang="ts">
import type { ListGridType } from 'ant-design-vue/es/list'
import { getArticlesList } from '@/services/projectCenter'
import { Teleport } from 'vue'
import { useAccountCenterContext } from '../../context'
import useChildState, { type ListRecord } from '../../hooks/useChildState'
import PullRefresh from './PullRefresh.vue'

defineProps<{
  serve: (data: any) => Promise<ResponseResult>;
  grid?: ListGridType;
  listStyle?: CSSObject;
}>()

const {
  pullRefresh,
  scrollRef,
  contentHeight,
  scrollRoot,
  list,
  initLoading,
  reloadList,
  state,
  loading,
  openFloatBtn,
  handleScrollTop
} = useChildState(getArticlesList)

const { countLoading, isMobile } = useAccountCenterContext()

const floatReady = ref(false)

watch(() => countLoading.value, (val) => {
  if (!val)
    nextTick(() => floatReady.value = true)
}, { immediate: true })

const handleReload = () => {
  reloadList(20)
  handleScrollTop(0)
}

const pullRefreshFun = (callback) => {
  pullRefresh.value = true
  reloadList(20)
  const stopWath = watch(pullRefresh, (val) => {
    if (!val) {
      stopWath()
      callback()
    }
  })
}
</script>

<template>
  <g-spin :spinning="pullRefresh ? false : initLoading">
    <g-scrollbars ref="scrollRef" :wrap-class="scrollRoot" :max-height="contentHeight">
      <PullRefresh :scroll-y="state.y" class="px-24px relative" :style="listStyle" @refresh="pullRefreshFun">
        <a-list :data-source="list" item-layout="vertical" :grid="grid">
          <template #renderItem="{ item }: { item: ListRecord }">
            <a-list-item :key="item.id" class="!px-0">
              <slot name="renderItem" :item="item" />
            </a-list-item>
          </template>
        </a-list>
        <div v-if="state.init && loading" class="flex-center my-16px">
          <g-spin :icon-style="{ fontSize: isMobile ? '18px' : '24px' }" />
        </div>
        <div v-if="!state.isMore" class="flex-center my-16px text-hex-ccc text-12px">
          已经到底部了哦~
        </div>
      </PullRefresh>
      <Teleport v-if="floatReady" to="#list-float-btn">
        <a-float-button-group v-show="openFloatBtn" shape="square" :style="isMobile ? undefined : { position: 'absolute', right: '24px' }">
          <a-float-button @click="handleReload">
            <template #icon>
              <SyncOutlined />
            </template>
          </a-float-button>
          <a-back-top :visibility-height="0" @click="handleScrollTop(0)" />
        </a-float-button-group>
      </Teleport>
    </g-scrollbars>
  </g-spin>
</template>

<style scoped lang="less">

</style>
