<script setup lang="ts">
import type { TableRecord } from '@gx-mock/datasSource/table'
import { getTableList } from '@/services/tableCenter'
import { useRequest } from '@gx-admin/hooks/core'
import { cloneDeep } from 'lodash-es'
import { ref, watchEffect } from 'vue'

const ready = ref(false)
const count = ref(0)

const paramsState = reactive({
  name: 1
})

const { data, loading, run, cancel, params } = useRequest<
  PageResult<TableRecord>,
  typeof paramsState, PageResult<TableRecord>
>(getTableList, {
  params: paramsState,
  ready,
  defaultData: {
    totalCount: 0,
    list: []
  },
  refreshDeps: [ () => count.value ]
})

watchEffect(() => {
  console.log(cloneDeep(params.value))
  console.log(data.value)
})

onMounted(() => {
  setTimeout(() => {
    paramsState.name = 2
  }, 2000)
})

onBeforeRouteLeave(() => {
  cancel?.()
})
</script>

<template>
  <g-pro-page-container>
    <div class="text-5 mb-15px font-500">
      useRequest-请打开F12查看效果
    </div>
    
    <a-button :loading="loading" type="primary" @click="() => run()">
      手动请求
    </a-button>
  </g-pro-page-container>
</template>
