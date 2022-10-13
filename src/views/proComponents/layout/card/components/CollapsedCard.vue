<template>
  <a-typography style="margin-top: 16px" id="collapsedCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 可折叠 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    <ul style="margin-top: 16px; list-style-type: disc">
      <li>
        你可以使用
        <span class="gx-markdown-code">padding</span>
        来配置卡片是否可折叠，通过
        <span class="gx-markdown-code">defaultCollapsed</span>
        属性配置是否默认折叠
      </li>
      <li>或者你可以通过<span class="gx-markdown-code">collapsed</span>属性受控进行自定义。</li>
    </ul>
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card title="可折叠" headerBordered collapsible defaultCollapsed>
      <template #extra>
        <a-button size="small" @click="(e) => e.stopPropagation()">提交</a-button>
      </template>
      内容
    </g-pro-card>
    <g-pro-card
      style="margin-top: 16px"
      title="可折叠-受控自定义"
      headerBordered
      :collapsed="collapsed"
    >
      <template #extra>
        <RightOutlined
          :rotate="!collapsed ? 90 : undefined"
          @click="
            () => {
              setCollapsed(!collapsed)
            }
          "
        />
      </template>
      内容
    </g-pro-card>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref } from 'vue'
import { RightOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    RightOutlined
  },
  setup() {
    const collapsed: Ref<boolean> = ref(true)
    const setCollapsed = (value: boolean) => {
      collapsed.value = value
    }
    return {
      collapsed,
      setCollapsed
    }
  }
})
</script>

<style lang="less" module></style>
