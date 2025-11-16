<script setup lang="ts">
const bindingViewData = [
  {
    title: '绑定淘宝',
    description: '当前未绑定淘宝账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'taobao'
  },
  {
    title: '绑定支付宝',
    description: '当前未绑定支付宝账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'alipay'
  },
  {
    title: '绑定钉钉',
    description: '当前未绑定钉钉账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'dingding'
  }
]
</script>

<template>
  <div class="leading-28px text-20px mb-12px font-500 text-rgba-[0-0-0-0.88]">
    账号绑定
  </div>
  <a-list item-layout="horizontal" :data-source="bindingViewData">
    <template #renderItem="{ item }">
      <a-list-item class="!px-0">
        <template #actions>
          <a :key="item.actions.key">{{ item.actions.text }}</a>
        </template>
        <a-list-item-meta :title="item.title" :description="item.description">
          <template #avatar>
            <TaobaoOutlined v-if="item.avatar === 'taobao'" class="taobao" />
            <AlipayOutlined v-if="item.avatar === 'alipay'" class="alipay" />
            <DingdingOutlined v-if="item.avatar === 'dingding'" class="dingding" />
          </template>
        </a-list-item-meta>
      </a-list-item>
    </template>
  </a-list>
</template>

<style scoped lang="less">

</style>
