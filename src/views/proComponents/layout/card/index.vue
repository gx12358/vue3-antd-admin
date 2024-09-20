<script lang="ts" setup>
import { GProCard, GProCheckCard, GProCheckCardGroup } from '@gx-design-vue/pro-card'
import { GProFormSwitch } from '@gx-design-vue/pro-form'

const checkValue = ref('A')
const checkValueArray = ref([ 'A' ])
</script>

<template>
  <g-pro-page-container>
    <GProCard :gutter="[ 16, 16 ]" title="基础卡片-响应式" bordered header-bordered wrap>
      <GProCard
        :col-span="{ lg: 8, xl: 8, xxl: 8, md: 24, sm: 24, xs: 24 }"
        title="默认尺寸"
        bordered
        tooltip="这是提示"
      >
        <template #extra>
          <GProFormSwitch name="Enable" no-style checked-children="启用" un-checked-children="禁用" />
        </template>
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </GProCard>
      <GProCard
        :col-span="{ lg: 8, xl: 8, xxl: 8, md: 24, sm: 24, xs: 24 }"
        title="默认尺寸"
        bordered
        tooltip="这是提示"
        extra="extra"
        box-shadow
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </GProCard>
      <GProCard
        :col-span="{ lg: 8, xl: 8, xxl: 8, md: 24, sm: 24, xs: 24 }"
        title="默认尺寸"
        tooltip="这是提示"
        extra="extra"
      >
        <p>Card content</p>
        <p>Card content</p>
        <p>Card content</p>
      </GProCard>
    </GProCard>
    <GProCard class="mt-24px" title="CheckCard 多选卡片" bordered header-bordered split="horizontal">
      <GProCard title="基本使用">
        <GProCheckCard
          title="示例一"
          description="选择一个由流程编排提供的典型用户案例，可以从中学习到流程编排很多设计理念。"
        />
      </GProCard>
      <GProCard title="单选">
        <GProCheckCardGroup v-model:value="checkValue">
          <GProCheckCard
            title="Card A"
            value="A"
            description="选项一"
          />
          <GProCheckCard
            title="Card B"
            value="B"
            description="选项二"
          />
        </GProCheckCardGroup>
      </GProCard>
      <GProCard title="多选">
        <GProCheckCardGroup v-model:value="checkValueArray" multiple>
          <GProCheckCard
            title="Card A"
            value="A"
            description="选项一"
          >
            <template #avatar>
              <a-avatar size="large" style="backgroundColor: #7265e6">
                <template #icon>
                  <user-outlined />
                </template>
              </a-avatar>
            </template>
          </GProCheckCard>
          <GProCheckCard
            title="Card B"
            value="B"
            description="选项二"
          />
        </GProCheckCardGroup>
      </GProCard>
    </GProCard>
  </g-pro-page-container>
</template>
