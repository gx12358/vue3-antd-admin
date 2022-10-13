<template>
  <a-typography id="search-SearchConfig" style="margin-top: 15px">
    <!--Search-->
    <a-typography-title style="margin-top: 12px" :level="3" :style="{ color: '#454d64' }">
      Search - SearchConfig
    </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="searchConfig"
    :dataSource="searchTableData"
    row-key="attributes"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'typesof'">
        <template v-if="record.attributes === 'span'">
          <a @click="handleTarget('#search-colConfig')">ColConfig</a>
        </template>
        <template v-else>{{ record.typesof }}</template>
      </template>
    </template>
  </g-pro-table>
  <!--ColConfig-->
  <a-typography-title
    id="search-colConfig"
    style="margin-top: 15px"
    :level="4"
    :style="{ color: '#454d64' }"
  >
    Pro Table - Search ColConfig示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code-block">
    <pre>{{ searchColConfig }}</pre>
  </a-typography-paragraph>
  <!--SearchMap-->
  <a-typography-title
    id="search-type-dataSouce"
    style="margin-top: 15px"
    :level="4"
    :style="{ color: '#454d64' }"
  >
    Pro Table - Search SearchMap示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code-block">
    <pre>{{ searchDataCode }}</pre>
  </a-typography-paragraph>
  <a-typography-title
    id="search-type-slots"
    style="margin-top: 15px"
    :level="4"
    :style="{ color: '#454d64' }"
  >
    Pro Table - Search slots示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code-block">
    <pre>{{ searchSlotsCode }}</pre>
  </a-typography-paragraph>
  <a-typography-title
    id="search-type-columns"
    style="margin-top: 15px"
    :level="4"
    :style="{ color: '#454d64' }"
  >
    Pro Table - Search columns示例：
  </a-typography-title>
  <a-typography-paragraph style="margin-top: 15px" copyable class="gx-code-block">
    <pre>{{ searchColumnsCode }}</pre>
  </a-typography-paragraph>
  <a-typography id="search-proSearchMap" style="margin-top: 15px">
    <a-typography-title style="margin-top: 12px" :level="3" :style="{ color: '#454d64' }">
      Pro Table - Search：ProSearchMap（searchMap和columns的表单数据配置）
    </a-typography-title>
  </a-typography>
  <g-pro-table
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="searchDataConfig"
    :dataSource="searchCommonData"
    row-key="attributes"
  />
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  emits: ['targetTo'],
  setup(_, { emit }) {
    const state = reactive({
      searchConfig: columns.searchConfig,
      searchDataConfig: columns.searchDataConfig,
      searchTableData: config.searchTableData,
      searchCommonData: config.searchCommonData,
      searchColConfig: config.searchColConfig,
      searchDataCode: config.searchDataCode,
      searchSlotsCode: config.searchSlotsCode,
      searchColumnsCode: config.searchColumnsCode
    })

    const handleTarget = (value) => {
      emit('targetTo', value)
    }

    return {
      ...toRefs(state),
      handleTarget
    }
  }
})
</script>

<style scoped></style>
