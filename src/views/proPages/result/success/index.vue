<template>
  <g-pro-page-container>
    <a-result
      status="success"
      title="提交成功"
      sub-title="提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
      class="mb-16px"
    >
      <template #extra>
        <a-button type="primary">
          返回列表
        </a-button>
        <a-button>查看项目</a-button>
        <a-button>打印</a-button>
      </template>
      <a-descriptions>
        <a-descriptions-item label="项目 ID">
          23421
        </a-descriptions-item>
        <a-descriptions-item label="负责人">
          曲丽丽
        </a-descriptions-item>
        <a-descriptions-item label="生效时间">
          2016-12-12 ~ 2017-12-12
        </a-descriptions-item>
      </a-descriptions>
      <br>
      <a-steps progress-dot :current="1">
        <a-step>
          <template #title>
            <span class="text-16px">创建项目</span>
          </template>
          <template #description>
            <div class="relative text-12px text-rgba-[0-0-0-0.85] text-center">
              <div class="mt-8px mb-4px">
                <span>曲丽丽</span>
                <dingding-outlined class="text-hex-main ml-8px" />
              </div>
              <div>2016-12-12 12:32</div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template #title>
            <span class="text-14px">部门初审</span>
          </template>
          <template #description>
            <div class="relative text-12px text-rgba-[0-0-0-0.85] text-center">
              <div class="mt-8px mb-4px">
                <span>周毛毛</span>
                <a>
                  <dingding-outlined class="text-hex-main ml-8px" />
                  <span>催一下</span>
                </a>
              </div>
            </div>
          </template>
        </a-step>
        <a-step>
          <template #title>
            <span class="text-14px">财务复核</span>
          </template>
        </a-step>
        <a-step>
          <template #title>
            <span class="text-14px">完成</span>
          </template>
        </a-step>
      </a-steps>
    </a-result>
  </g-pro-page-container>
</template>
