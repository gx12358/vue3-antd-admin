<template>
  <Result
    status="500"
    title="500"
    style="background: none"
    subTitle="Sorry, the server is reporting an error."
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
