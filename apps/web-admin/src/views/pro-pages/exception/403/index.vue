<script setup lang="ts">
import GAdminResult from '@/components/layout/result'
</script>

<template>
  <g-pro-page-container>
    <GAdminResult status="403">
      <template #extra>
        <a-button type="primary">
          返回首页
        </a-button>
      </template>
    </GAdminResult>
  </g-pro-page-container>
</template>
