<template>
  <g-pro-page-container>
    <a-result
      status="500"
      title="500"
      style="background: none"
      sub-title="Sorry, the server is reporting an error."
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
