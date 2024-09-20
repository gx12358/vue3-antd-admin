<script setup lang="ts">
const notificationViewData = [
  {
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
    checkedValue: true
  },
  {
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
    checkedValue: true
  },
  {
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
    checkedValue: true
  }
]
</script>

<template>
  <div class="leading-28px text-20px mb-12px font-500 text-rgba-[0-0-0-0.88]">
    新消息通知
  </div>
  <a-list item-layout="horizontal" :data-source="notificationViewData">
    <template #renderItem="{ item }">
      <a-list-item class="!px-0">
        <template #actions>
          <a-switch
            v-model:checked="item.checkedValue"
            checked-children="开"
            un-checked-children="关"
          />
        </template>
        <a-list-item-meta :title="item.title" :description="item.description" />
      </a-list-item>
    </template>
  </a-list>
</template>

<style scoped lang="less">

</style>
