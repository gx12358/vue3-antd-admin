<template>
  <a-typography id="g-pro-skeleton-result" style="margin-top: 15px">
    <a-typography-title :level="3" :style="{ color: '#454d64' }">结果页</a-typography-title>
  </a-typography>
  <div
    style="
      padding: 40px 20px;
      background-color: #ffffff;
      border: 1px solid #ebedf1;
      border-radius: 1px;
    "
  >
    <div style="padding: 24px; background: #ffffff">
      <div style="padding: 24px; background: rgb(250, 250, 250)">
        <g-pro-skeleton type="result" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  setup() {
    return {}
  }
})
</script>
