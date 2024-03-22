<script setup lang="ts">
import { reactive, getCurrentInstance } from 'vue'
import type { ProCardProps } from '@gx-design-vue/pro-card'
import { GProCard, GProCardTabPane } from '@gx-design-vue/pro-card'
import type { TabsStateActiveKey } from './utile/config'
import { tabPaneState } from './utile/config'
import Table from './Table.vue'

const instance = getCurrentInstance()

const tabsState = reactive<Omit<ProCardProps['tabs'], 'activeKey'> & { activeKey: TabsStateActiveKey }>({
  activeKey: 'table1',
  onChange: (key: TabsStateActiveKey) => {
    tabsState.activeKey = key
    
    nextTick(() => {
      const tableRef = instance.refs?.[`tableRef_${key}`]?.[0] as any
      tableRef && tableRef?.reload?.()
    })
  }
})
</script>

<template>
  <GProCard :tabs="tabsState">
    <GProCardTabPane :tab="item.name" :tab-key="item.key" v-for="item in tabPaneState" :key="item.key">
      <Table :ref="`tableRef_${item.key}`" :type="item.key" :request="item.request" />
    </GProCardTabPane>
  </GProCard>
</template>

<style scoped lang="less">

</style>
