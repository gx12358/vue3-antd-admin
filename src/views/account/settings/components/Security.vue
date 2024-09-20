<script setup lang="ts">
const securityViewData = [
  {
    title: '账户密码',
    description: '当前密码强度：强',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: '密保手机',
    description: '已绑定手机：138****8293',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    actions: {
      key: 'Set',
      text: '设置'
    }
  },
  {
    title: '备用邮箱',
    description: '已绑定邮箱：ant***sign.com',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    actions: {
      key: 'bind',
      text: '绑定'
    }
  }
]
</script>

<template>
  <div class="leading-28px text-20px mb-12px font-500 text-rgba-[0-0-0-0.88]">
    基本设置
  </div>
  <a-list item-layout="horizontal" :data-source="securityViewData">
    <template #renderItem="{ item }">
      <a-list-item class="!px-0">
        <template #actions>
          <a :key="item.actions.key">{{ item.actions.text }}</a>
        </template>
        <a-list-item-meta :title="item.title" :description="item.description" />
      </a-list-item>
    </template>
  </a-list>
</template>

<style scoped lang="less">

</style>
