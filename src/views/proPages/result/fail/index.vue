<template>
  <g-pro-page-container>
    <a-card :bordered="false">
      <a-result
        status="error"
        title="提交失败"
        sub-title="请核对并修改以下信息后，再重新提交。"
        class="mt-48px mb-16px"
      >
        <template #extra>
          <a-button type="primary">
            <span>返回修改</span>
          </a-button>
        </template>
        <div class="mb-16px text-16px font-500 text-rgba-[0-0-0-0.85]">
          <span>您提交的内容有如下错误：</span>
        </div>
        <div class="mb-16px">
          <close-circle-outlined class="mr-8px" />
          <span>您的账户已被冻结</span>
          <a class="ml-16px">
            <span>立即解冻</span>
            <right-outlined />
          </a>
        </div>
        <div>
          <close-circle-outlined class="mr-8px" />
          <span>您的账户还不具备申请资格</span>
          <a class="ml-16px">
            <span>立即升级</span>
            <right-outlined />
          </a>
        </div>
      </a-result>
    </a-card>
  </g-pro-page-container>
</template>
