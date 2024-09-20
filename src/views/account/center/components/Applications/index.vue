<script setup lang="ts">
import type { ListRecord } from '../../hooks/useChildState'
import { getArticlesList } from '@/services/projectCenter'
import { GProCard } from '@gx-design-vue/pro-card'
import WrapScroll from '../Layout/WrapScroll.vue'
</script>

<template>
  <WrapScroll :serve="getArticlesList" :grid="{ gutter: 24, xxl: 3, xl: 2, lg: 2, md: 2, sm: 2, xs: 1 }" :listStyle="{ paddingBlock: '24px' }">
    <template #renderItem="{ item }: { item: ListRecord }">
      <GProCard hoverable :body-style="{ padding: '16px 20px' }" bordered>
        <div class="flex items-center gap-16px">
          <g-admin-image :src="item.avatar" :width="22" :height="22" class="rd-50% flex-shrink-0">
            <template #renderHolder>
              <user-outlined class="!text-12px" />
            </template>
          </g-admin-image>
          <span>{{ item.title }}</span>
        </div>
        <div class="pl-38px flex">
          <div class="flex-main">
            <div class="mb-4px text-12px leading-20px text-rgba-[0-0-0-0.65]">
              活跃用户
            </div>
            <div class="text-24px leading-32px">
              {{ item.activeUserObj.numberValue }}
              <span class="ml-[-2px] text-14px relative top-[-2px]">
                {{ item.activeUserObj.countStr }}
              </span>
            </div>
          </div>
          <div class="flex-main">
            <div class="mb-4px text-12px leading-20px text-rgba-[0-0-0-0.65]">
              新增用户
            </div>
            <a-statistic :value="item.newUser" />
          </div>
        </div>
        <template #actions>
          <a-tooltip key="download" title="下载">
            <download-outlined />
          </a-tooltip>
          <a-tooltip key="edit" title="编辑">
            <edit-outlined />
          </a-tooltip>
          <a-tooltip key="share" title="分享">
            <share-alt-outlined />
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
      </GProCard>
    </template>
  </WrapScroll>
</template>

<style scoped lang="less">

</style>
