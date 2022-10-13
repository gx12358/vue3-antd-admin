<template>
  <g-pro-page-container>
    <a-card :bordered="false">
      <Result
        status="error"
        title="提交失败"
        subTitle="请核对并修改以下信息后，再重新提交。"
        style="margin-top: 48px; margin-bottom: 16px"
      >
        <template #extra>
          <a-button type="primary">
            <span>返回修改</span>
          </a-button>
        </template>
        <div :class="$style.title">
          <span>您提交的内容有如下错误：</span>
        </div>
        <div style="margin-bottom: 16px">
          <CloseCircleOutlined style="margin-right: 8px" :class="$style.error_icon" />
          <span>您的账户已被冻结</span>
          <a style="margin-left: 16px">
            <span>立即解冻</span>
            <RightOutlined />
          </a>
        </div>
        <div>
          <CloseCircleOutlined style="margin-right: 8px" :class="$style.error_icon" />
          <span>您的账户还不具备申请资格</span>
          <a style="margin-left: 16px">
            <span>立即升级</span>
            <RightOutlined />
          </a>
        </div>
      </Result>
    </a-card>
  </g-pro-page-container>
</template>

<script lang="ts" setup>
import { Result } from 'ant-design-vue'
import { CloseCircleOutlined, RightOutlined } from '@ant-design/icons-vue'
</script>

<style lang="less" module>
.error_icon {
  color: @highlight-color;
}

.title {
  margin-bottom: 16px;
  font-size: 16px;
  font-weight: 500;
  color: @heading-color;
}
</style>
