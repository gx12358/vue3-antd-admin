<script setup lang="ts">
import type { SystemDictTypeApi } from '@/services/system/dict'
import DataTable from './components/DataTable/index.vue'
import TypeTable from './components/TypeTable/index.vue'
import { provideDictContext } from './context'

const rowSelect = ref<SystemDictTypeApi.DictTypeTableRecord>()

provideDictContext({
  rowSelect
})
</script>

<template>
  <g-pro-page-container :use-page-card="false" height="fit">
    <a-row :gutter="16" class="h-full">
      <a-col :span="12" class="h-full overflow-hidden">
        <TypeTable />
      </a-col>
      <a-col :span="12" class="h-full overflow-hidden">
        <DataTable />
      </a-col>
    </a-row>
  </g-pro-page-container>
</template>

<style scoped lang="less">

</style>
