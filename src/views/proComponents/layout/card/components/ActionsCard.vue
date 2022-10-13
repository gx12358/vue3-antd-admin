<template>
  <a-typography style="margin-top: 16px" id="actionsCard">
    <a-typography-title :level="4" :style="{ color: '#454d64' }"> 操作项 </a-typography-title>
  </a-typography>
  <div style="margin: 16px 0; font-size: 15px; line-height: 24px">
    配置
    <span class="gx-markdown-code">actions</span>
    属性来配置卡片操作项。
  </div>
  <div class="gx-markdown-demo">
    <g-pro-card title="Actions 操作项" style="max-width: 300px">
      <template #actions>
        <SettingOutlined key="setting" />
        <EditOutlined key="edit" />
        <EllipsisOutlined key="ellipsis" />
      </template>
      <div>Card content</div>
      <div>Card content</div>
      <div>Card content</div>
    </g-pro-card>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import { SettingOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons-vue'

export default defineComponent({
  components: {
    EditOutlined,
    SettingOutlined,
    EllipsisOutlined
  },
  setup() {
    return {}
  }
})
</script>

<style lang="less" module></style>
