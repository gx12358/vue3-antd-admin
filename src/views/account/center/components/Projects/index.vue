<script setup lang="ts">
import type { ListRecord } from '../../hooks/useChildState'
import { getArticlesList } from '@/services/projectCenter'
import dayjs from 'dayjs'
import WrapScroll from '../Layout/WrapScroll.vue'
</script>

<template>
  <WrapScroll :serve="getArticlesList" :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }" :list-style="{ paddingBlock: '24px' }">
    <template #renderItem="{ item }: { item: ListRecord }">
      <a-card bordered hoverable>
        <template #cover>
          <g-admin-image :src="item.cover" slot-image-class="w-30%" class="h-200px" fit="cover" />
        </template>
        <div class="card-title">
          {{ item.title }}
        </div>
        <div class="text-hidden-2 leading-20px mb-14px">
          {{ item.description }}
        </div>
        <div class="flex items-center justify-between">
          <span class=" text-rgba-[0-0-0-0.65] text-12px">{{ dayjs(item.createdAt).fromNow() }}</span>
          <a-avatar-group size="small" :max-count="4">
            <template v-for="member in item.members" :key="member.id">
              <a-tooltip placement="top" :title="member.name">
                <a-avatar :src="member.avatar" />
              </a-tooltip>
            </template>
          </a-avatar-group>
        </div>
      </a-card>
    </template>
  </WrapScroll>
</template>

<style scoped lang="less">

</style>
