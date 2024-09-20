<script setup lang="ts">
import type { CardListItemDataType, CardSearchParmas } from '@gx-mock/datasSource/list/card'
import { globalConfirm } from '@/components/GlobalLayout/Confirm'
import { deleteCardList, getCardList } from '@/services/listCenter/card'
import { useScrollPageList } from '@gx-admin/hooks/web'
import { GProCard } from '@gx-design-vue/pro-card'
import { message } from 'ant-design-vue'
import OperateModal from './components/OperateModal.vue'
import { cardGridConfig } from './utils/config'

const operate = ref()
const pageSize = ref(11)

const {
  list,
  state,
  loading,
  initLoading,
  reloadList,
  handleNext
} = useScrollPageList<CardListItemDataType, Partial<CardSearchParmas>>(
  getCardList,
  {
    fetchNextType: 'button',
    pageSize,
    scrollBotomm: 124 + 24 * 2 + 200
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
      const response = await deleteCardList({ id })
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
  <g-pro-page-container :use-page-card="false" :loading="initLoading">
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
    <GProCard :gutter="cardGridConfig.gutter" ghost wrap>
      <GProCard
        class="card-add"
        layout="center"
        :col-span="cardGridConfig.colSpan"
        :body-style="{ padding: 0 }"
      >
        <div class="card-add-btn" @click="operate?.open()">
          <PlusOutlined />
          新增产品
        </div>
      </GProCard>
      <GProCard
        v-for="item in list"
        :key="item.id"
        :col-span="cardGridConfig.colSpan"
        hoverable
      >
        <div class="flex gap-16px">
          <g-admin-image :src="item.avatar" :width="48" :height="48" class="rd-50% flex-shrink-0" />
          <div class="flex flex-col gap-8px">
            <div class="gx-admin-a text-16px font-600 text-rgba-[0-0-0-0.88] text-hidden-1 leading-26px">
              {{ item.title }}
            </div>
            <div class="text-rgba-[0-0-0-0.88] text-hidden-3 leading-22px h-66px">
              {{ item.title }}
            </div>
          </div>
        </div>
        <template #actions>
          <span key="update" class="gx-admin-a text-rgba-[0-0-0-0.45] leading-22px" @click="operate?.open(item.id)">更新</span>
          <span key="delete" class="gx-admin-a text-rgba-[0-0-0-0.45] leading-22px" @click="handleDelete(item.id)">删除</span>
        </template>
      </GProCard>
    </GProCard>
    <div class="flex-center">
      <a-button v-if="state.isMore" class="mt-24px" :loading="loading" @click="handleNext">
        更多
      </a-button>
    </div>
    <OperateModal ref="operate" @ok="reloadList" />
  </g-pro-page-container>
</template>

<style lang="less" scoped>
.card-add {
  cursor: pointer;
  border: 1px dashed #d9d9d9;
  transition: border .3s;
  
  &:hover {
    border-color: var(--gx-primary-color);
    
    .card-add-btn {
      --at-apply: text-hex-main;
    }
  }
  
  .card-add-btn {
    transition: color .3s;
    --at-apply: h-174px flex-center gap-4px w-full;
    color: rgba(0, 0, 0, 0.65)
  }
}
</style>
