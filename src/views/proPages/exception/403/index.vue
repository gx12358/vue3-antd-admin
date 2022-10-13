<template>
  <Result
    status="403"
    title="403"
    style="background: none"
    subTitle="Sorry, you don't have access to this page."
  >
    <template #extra>
      <router-link to="/">
        <a-button type="primary">返回首页</a-button>
      </router-link>
    </template>
  </Result>
</template>

<script lang="ts" setup>
import { Result } from 'ant-design-vue'
</script>

<style scoped></style>
