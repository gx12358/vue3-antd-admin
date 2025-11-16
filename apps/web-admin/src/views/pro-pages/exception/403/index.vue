<template>
  <g-pro-page-container>
    <a-result
      status="403"
      title="403"
      style="background: none"
      sub-title="Sorry, you don't have access to this page."
    >
      <template #extra>
        <router-link to="/">
          <a-button type="primary">
            返回首页
          </a-button>
        </router-link>
      </template>
    </a-result>
  </g-pro-page-container>
</template>
