<script setup lang="ts">
import { getHokksRequest } from '@/services/dataCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { GProField } from '@gx-design-vue/pro-field'
import { ref } from 'vue'

const count = ref(0)

const paramsState = reactive({
  name: 1,
  pageSize: 1
})

const { data, loading, run, params, result } = useRequest<
  {
    name: string;
    type: string;
  },
  typeof paramsState
>(getHokksRequest, {
  params: paramsState,
  cancel: {
    level: true
  },
  refreshDeps: [ () => count.value ],
})

watchEffect(() => {
  console.log(result.value)
})

onMounted(() => {
  // setTimeout(() => {
  //   paramsState.name = 2
  // }, 2000)
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
    <g-spin :spinning="loading">
      <a-descriptions :column="{ md: 1, xl: 3, xxl: 2 }">
        <a-descriptions-item label="params">
          <GProField
            value-type="code"
            mode="read"
            :text="JSON.stringify(params, undefined, 2)"
          />
        </a-descriptions-item>
        <a-descriptions-item v-if="data" label="data">
          <GProField
            value-type="code"
            mode="read"
            :text="JSON.stringify(data, undefined, 2)"
          />
        </a-descriptions-item>
      </a-descriptions>
      <a-descriptions :column="1">
        <a-descriptions-item label="response">
          <GProField
            value-type="code"
            mode="read"
            :text="JSON.stringify(result, undefined, 2)"
          />
        </a-descriptions-item>
      </a-descriptions>
    </g-spin>
  </g-pro-page-container>
</template>
