<template>
  <Result
    status="404"
    title="404"
    style="background: none"
    subTitle="Sorry, the page you visited does not exist."
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
