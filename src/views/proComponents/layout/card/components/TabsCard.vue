<template>
  <a-typography style="margin-top: 16px" id="tabsCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 页签 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0">
    配置
    <span class="gx-markdown-code">tabs</span>
    属性配合
    <span class="gx-markdown-code">ProCard.TabPane</span>
    子组件可以配置卡片的标签栏。
  </div>
  <div class="gx-markdown-demo">
    <a-space style="margin-bottom: 16px">
      Tab position：
      <a-select
        v-model:value="tabPosition"
        @change="
          (value) => {
            tabPosition = value
          }
        "
        :dropdownMatchSelectWidth="false"
      >
        <a-select-option value="top">top</a-select-option>
        <a-select-option value="bottom">bottom</a-select-option>
        <a-select-option value="left">left</a-select-option>
        <a-select-option value="right">right</a-select-option>
      </a-select>
    </a-space>
    <g-pro-card
      :tabs="{
        tabPosition,
        activeKey: tab,
        onChange: (key) => {
          setTab(key)
        }
      }"
    >
      <g-pro-card-tab-pane key="tab1" tab="产品一"> 内容一 </g-pro-card-tab-pane>
      <g-pro-card-tab-pane key="tab2" tab="产品二"> 内容二 </g-pro-card-tab-pane>
    </g-pro-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, Ref } from 'vue'
import type { ProCardTabsProps } from '@gx-design/ProCard'

export default defineComponent({
  setup() {
    const tab: Ref<string> = ref('')
    const tabPosition: Ref<ProCardTabsProps['tabPosition']> = ref('top')

    onMounted(() => {
      setTimeout(() => {
        tab.value = 'tab2'
      }, 200)
    })

    const setTab = (val: string) => {
      tab.value = val
    }

    return {
      tab,
      tabPosition,
      setTab
    }
  }
})
</script>
