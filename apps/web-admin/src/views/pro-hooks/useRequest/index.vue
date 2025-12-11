<script setup lang="ts">
import type { PageResult } from '@gx/types/request'
import type { MockTableRecord } from '@/services/demo/table'
import { useRequest } from '@gx/hooks'
import { ref } from 'vue'
import { getList } from '@/services/demo'

const count = ref(0)

const paramsState = reactive({
  name: 1,
  pageSize: 1
})

const { loading, run, data } = useRequest<PageResult<MockTableRecord>>(getList, {
  params: paramsState,
  cancel: {
    level: true,
    next: true
  },
  refreshDeps: [ () => count.value ],
})

watchEffect(() => {
  console.log(data.value)
})
</script>

<template>
  <g-pro-page-container>
    <div class="mb-15px flex items-center gap-20px">
      <a-button type="primary" @click="() => run()">
        手动请求 - 打断上次请求
      </a-button>
      <span class="font-500 text-4 text-var-[gx-warning-color]">useRequest-请打开F12查看效果</span>
    </div>
    <g-spin :spinning="loading" />
  </g-pro-page-container>
</template>
