<script setup lang="ts">
import type { TabsProps } from 'ant-design-vue'
import type { TabsStateActiveKey } from './utile/config'
import { GProCard, GProCardTabPane } from '@gx-design-vue/pro-card'
import { getCurrentInstance, reactive } from 'vue'
import Table from './Table.vue'
import { tabPaneState } from './utile/config'

const instance = getCurrentInstance()

const tabsState = reactive<Omit<TabsProps, 'activeKey'> & { activeKey: TabsStateActiveKey }>({
  activeKey: 'table1',
  onChange: (key: any) => {
    tabsState.activeKey = key
    
    nextTick(() => {
      const tableRef = instance?.refs?.[`tableRef_${key}`]?.[0] as any
      tableRef && tableRef?.reload?.()
    })
  }
})
</script>

<template>
  <GProCard :tabs="tabsState">
    <GProCardTabPane v-for="item in tabPaneState" :key="item.key" :tab="item.name" :tab-key="item.key">
      <Table :ref="`tableRef_${item.key}`" :type="item.key" :request="item.request" />
    </GProCardTabPane>
  </GProCard>
</template>

<style scoped lang="less">

</style>
