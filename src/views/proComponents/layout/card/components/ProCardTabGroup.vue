<template>
  <a-typography style="margin-top: 16px" id="proCardTabGroup">
    <a-typography-title :level="4" :style="{ color: '#454d64' }">
      ProCard.Group
    </a-typography-title>
  </a-typography>
  <div style="margin-top: 16px">属性同 ProCard，会取消卡片内容边距，用于将多个卡片进行分组。</div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
