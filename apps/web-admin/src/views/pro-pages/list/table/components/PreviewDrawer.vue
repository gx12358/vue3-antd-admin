<script setup lang="ts">
import type { MockTableRecord } from '@/services/demo/table'

const emit = defineEmits<{
  (e: 'update', state: MockTableRecord): void
}>()

const open = ref(false)

const state = reactive({
  row: {} as MockTableRecord
})

const onClose = () => open.value = false

defineExpose({
  open: (record: MockTableRecord) => {
    open.value = true
    state.row = { ...record }
  }
})
</script>

<template>
  <a-drawer
    width="600px"
    placement="right"
    :closable="false"
    :open="open"
    @close="onClose"
  >
    <a-descriptions :title="state.row.name" :column="2">
      <template #extra>
        <div class="flex items-center gap-16px">
          <a @click="emit('update', state.row)">配置</a>
          <a href="https://procomponents.ant.design/" target="_blank">订阅警报</a>
        </div>
      </template>
      <a-descriptions-item>
        <template #label>
          <div class="flex items-center gap-4px">
            规则名称
            <a-tooltip title="规则名称是唯一的 key">
              <info-circle-outlined />
            </a-tooltip>
          </div>
        </template>
        <a>{{ state.row?.name }}</a>
      </a-descriptions-item>
      <a-descriptions-item label="描述">
        {{ state.row?.description }}
      </a-descriptions-item>
      <a-descriptions-item label="服务调用次数">
        {{ state.row.callNo > 0 ? `${state.row.callNo}万` : state.row.callNo }}
      </a-descriptions-item>
      <a-descriptions-item label="状态">
        <a-badge v-if="state.row.status1 === 0" status="default" text="关闭" />
        <a-badge v-if="state.row.status1 === 1" status="processing" text="运行中" />
        <a-badge v-if="state.row.status1 === 2" status="success" text="已上线" />
        <a-badge v-if="state.row.status1 === 3" status="error" text="异常" />
      </a-descriptions-item>
      <a-descriptions-item label="上次调度时间">
        {{ state.row?.createTime }}
      </a-descriptions-item>
    </a-descriptions>
  </a-drawer>
</template>

<style scoped lang="less">
&:deep(.ant-descriptions-view) {
  .ant-descriptions-item-label {
    color: rgba(0, 0, 0, 0.45);
  }
}
</style>
