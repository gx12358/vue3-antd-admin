<template>
  <g-pro-page-container>
    <a-result
      status="404"
      title="404"
      style="background: none"
      sub-title="Sorry, the page you visited does not exist."
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
