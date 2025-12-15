<script setup lang="ts">
import type { MockTableRecord, SearchConfig } from '@/services/demo/table'
import { message } from 'ant-design-vue'
import { globalConfirm } from '@/components/layout/confirm'
import { useScrollPageList } from '@/hooks/web'
import { deleteList, getList } from '@/services/demo'
import OperateModal from './components/OperateModal.vue'

const operate = ref()
const pageSize = ref(11)

const {
  list,
  state,
  loading,
  initLoading,
  reloadList,
  handleNext,
  refreshLoading
} = useScrollPageList<MockTableRecord, Partial<SearchConfig>>(
  getList,
  {
    reloadClear: false,
    fetchNextType: 'button',
    pageSize,
    scrollBottom: 124 + 24 * 2 + 200
  }
)

watch(() => state.init, (val) => {
  if (val) {
    nextTick(() => pageSize.value = 12)
  }
})

const handleDelete = (id) => {
  globalConfirm({
    content: '是否确认删除？',
    onOk: async () => {
      loading.value = true
      const response = await deleteList({ id })
      if (response) {
        message.success('操作成功')
        await reloadList()
      }
      loading.value = false
    }
  })
}
</script>

<template>
  <g-pro-page-container :use-page-card="false" :loading="initLoading || refreshLoading">
    <template #contentRender>
      <div class="mt-8px font-600 text-rgba-[0-0-0-0.88] text-20px leading-32p text-hidden-1">
        卡片列表
      </div>
      <div class="mt-12px text-rgba-[0-0-0-0.88] leading-22px mb-14px">
        段落示意：蚂蚁金服务设计平台 ant.design，用最小的工作量，无缝接入蚂蚁金服生态， 提供跨越设计与开发的体验解决方案。
      </div>
      <div class="flex items-center gap-32px">
        <a class="flex items-center gap-8px leading-32px">
          <i class="iconfont gx-a-kuaisukaishi-weixuanzhong3x1 !text-24px" />
          <span>快速开始</span>
        </a>
        <a class="flex items-center gap-8px leading-32px">
          <i class="iconfont gx-jianjie !text-24px" />
          <span>产品简介</span>
        </a>
        <a class="flex items-center gap-8px leading-32px">
          <i class="iconfont gx-chanpinwendang !text-24px" />
          <span> 产品文档</span>
        </a>
      </div>
    </template>
    <div class="grid xl:grid-cols-4 lg:grid-cols-3 md:grid-cols-2 grid-cols-1 gap-16px">
      <div v-if="state.init" class="gx-card gx-card-add flex-center hover">
        <span class="hover:text-primary duration-200">新增</span>
      </div>
      <div v-for="item in list" :key="item.id" class="gx-card flex flex-col hover">
        <div class="flex gap-16px gx-card-body flex-1">
          <a-avatar class="shrink-0" :src="item.img" :size="48" />
          <div class="flex flex-col gap-8px">
            <div class="text-heading text-16px font-600 text-hidden-1">
              {{ item.title }}
            </div>
            <div class="text-description text-hidden-3 leading-22px min-h-66px">
              {{ item.description }}
            </div>
          </div>
        </div>
        <div class="bd-t-border-secondary flex relative">
          <div class="py-12px flex-1 hover:text-primary duration-200 flex-center" @click="operate.open(item.id)">
            更新
          </div>
          <div class="py-12px flex-1 hover:text-primary duration-200 flex-center" @click="handleDelete(item.id)">
            删除
          </div>
          <div class="bg-border-secondary w-1px absolute position-center h-[calc(100%-24px)] top-12px" />
        </div>
      </div>
    </div>
    <div class="flex-center">
      <a-button v-if="state.isMore && !initLoading" class="mt-24px" :loading="loading && !refreshLoading" @click="handleNext">
        更多
      </a-button>
    </div>
    <OperateModal ref="operate" @ok="reloadList" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
.gx-card-add {
  border-style: dashed;

  &:hover {
    --at-apply: text-primary;
    border-color: var(--gx-color-primary);
    box-shadow: none;
  }
}
</style>
