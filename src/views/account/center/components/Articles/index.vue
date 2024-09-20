<script setup lang="ts">
import type { ListRecord } from '../../hooks/useChildState'
import { getArticlesList } from '@/services/projectCenter'
import dayjs from 'dayjs'
import WrapScroll from '../Layout/WrapScroll.vue'
</script>

<template>
  <WrapScroll :serve="getArticlesList">
    <template #renderItem="{ item }: { item: ListRecord }">
      <div class="text-rgba-[0-0-0-0.88] mb-12px text-16px leading-25px">
        {{ item.title }}
      </div>
      <div class="flex items-center mb-16px flex-wrap">
        <a-tag v-for="el in item.tagList" :key="el">
          {{ el }}
        </a-tag>
      </div>
      <div v-if="item.description" class="mb-16px text-hidden-3 leading-20px">
        {{ item.description }}
      </div>
      <div class="flex items-center gap-8px mb-16px flex-wrap">
        <g-admin-image :src="item.avatar" :width="24" :height="24" class="rd-50% flex-shrink-0">
          <template #renderHolder>
            <user-outlined class="!text-12px" />
          </template>
        </g-admin-image>
        <a :href="item.href">{{ item.owner }}</a>发布在<a :href="item.href">{{ item.href }}</a>
        <span class="text-rgba-[0-0-0-0.25]">{{ dayjs(item.updatedAt).fromNow() }}</span>
      </div>
      <div class="flex items-center gap-16px text-rgba-[0-0-0-0.45] flex-wrap">
        <span key="star"> <star-two-tone /> {{ item.star }} </span>
        <a-divider type="vertical" class="m-0" />
        <span key="like"> <like-outlined /> {{ item.like }} </span>
        <a-divider type="vertical" class="m-0" />
        <span key="message"> <message-filled /> {{ item.message }} </span>
      </div>
    </template>
  </WrapScroll>
</template>

<style scoped lang="less">

</style>
