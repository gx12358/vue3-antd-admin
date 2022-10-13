<template>
  <g-pro-page-container>
    <a-card :bordered="false">
      <Result
        status="success"
        title="提交成功"
        subTitle="提交结果页用于反馈一系列操作任务的处理结果， 如果仅是简单操作，使用 Message 全局提示反馈即可。 本文字区域可以展示简单的补充说明，如果有类似展示 “单据”的需求，下面这个灰色区域可以呈现比较复杂的内容。"
        style="margin-bottom: 16px"
      >
        <template #extra>
          <a-button type="primary">返回列表</a-button>
          <a-button>查看项目</a-button>
          <a-button>打印</a-button>
        </template>
        <Descriptions>
          <DescriptionsItem label="项目 ID">23421</DescriptionsItem>
          <DescriptionsItem label="负责人">曲丽丽</DescriptionsItem>
          <DescriptionsItem label="生效时间">2016-12-12 ~ 2017-12-12</DescriptionsItem>
        </Descriptions>
        <br />
        <Steps progressDot :current="1">
          <Step>
            <template #title>
              <span style="font-size: 14px">创建项目</span>
            </template>
            <template #description>
              <div :class="$style.title">
                <div style="margin: 8px 0 4px">
                  <span>曲丽丽</span>
                  <DingdingOutlined style="margin-left: 8px; color: #00a0e9" />
                </div>
                <div>2016-12-12 12:32</div>
              </div>
            </template>
          </Step>
          <Step>
            <template #title>
              <span style="font-size: 14px">部门初审</span>
            </template>
            <template #description>
              <div style="font-size: 12px" :class="$style.title">
                <div style="margin: 8px 0 4px">
                  <span>周毛毛</span>
                  <a>
                    <DingdingOutlined style="margin-left: 8px; color: #00a0e9" />
                    <span>催一下</span>
                  </a>
                </div>
              </div>
            </template>
          </Step>
          <Step>
            <template #title>
              <span style="font-size: 14px">财务复核</span>
            </template>
          </Step>
          <Step>
            <template #title>
              <span style="font-size: 14px">完成</span>
            </template>
          </Step>
        </Steps>
      </Result>
    </a-card>
  </g-pro-page-container>
</template>

<script lang="ts" setup>
import { Result, Steps, Descriptions } from 'ant-design-vue'
import { DingdingOutlined } from '@ant-design/icons-vue'

const Step = Steps.Step
const DescriptionsItem = Descriptions.Item
</script>

<style lang="less" module>
.title {
  position: relative;
  font-size: 12px;
  color: @text-color;
  text-align: center;
}

.head-title {
  margin-bottom: 20px;
  font-size: 16px;
  font-weight: 500;
  color: @heading-color;
}
</style>
