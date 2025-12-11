<script setup lang="ts">
import type { TabsStateActiveKey } from './utile/config'
import Table from './Table.vue'
import { tabPaneState } from './utile/config'

const activeKey = ref<TabsStateActiveKey>('table1')

const currentTabPane = computed(() => tabPaneState.find(item => item.key === activeKey.value))
</script>

<template>
  <div class="gx-card">
    <div class="gx-card-header">
      <a-tabs v-model:active-key="activeKey">
        <a-tab-pane v-for="item in tabPaneState" :key="item.key" :tab="item.name" />
      </a-tabs>
    </div>
    <div class="gx-card-body">
      <Table :key="activeKey" :type="currentTabPane?.key" :request="currentTabPane?.request" />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "../../style";

&:deep(.ant-tabs-nav) {
  margin-bottom: 0;

  .ant-tabs-tab {
    padding-block: 16px;
  }
}
</style>
