<template>
  <a-typography style="margin-top: 15px" id="g-pro-table-api">
    <a-typography-title :level="2" :style="{ color: '#454d64' }">API</a-typography-title>
    <a-typography-paragraph>
      g-pro-table 在 antd 的 Table
      上进行了一层封装，支持了一些预设，并且封装了一些行为（自适应横向滚动）。这里只列出与 antd
      Table 不同的 api。 （<a
        href="https://procomponents.ant.design/components/table#api"
        target="_blank"
        >参照react-pro-components：pro-table</a
      >）
    </a-typography-paragraph>
  </a-typography>
  <a-typography style="margin-top: 15px" id="request-api">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64">
      request
    </a-typography-title>
    <a-typography-paragraph>
      <a-typography-text type="danger" code style="font-size: 14px">request</a-typography-text>
      是 ProTable 最重要的 API，
      <a-typography-text type="danger" code style="font-size: 14px">request</a-typography-text>
      会接收一个对象。对象中必须要有
      <a-typography-text type="danger" code style="font-size: 14px">data</a-typography-text>
      和
      <a-typography-text type="danger" code style="font-size: 14px">success</a-typography-text>
      ，如果需要手动分页
      <a-typography-text type="danger" code style="font-size: 14px">total</a-typography-text>
      也是必需的。
      <a-typography-text type="danger" code style="font-size: 14px">request</a-typography-text>
      会接管
      <a-typography-text type="danger" code style="font-size: 14px">loading</a-typography-text>
      的设置，同时在查询表单查询和
      <a-typography-text type="danger" code style="font-size: 14px">params</a-typography-text>
      参数发生修改时重新执行。同时 查询表单的值和
      <a-typography-text type="danger" code style="font-size: 14px">params</a-typography-text>
      参数也会带入。
    </a-typography-paragraph>
    <a-typography-paragraph copyable class="gx-code-block">
      <pre>{{ requestCode }}</pre>
    </a-typography-paragraph>
  </a-typography>
  <a-typography style="margin-top: 15px" id="proTable-api">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64">
      ProTable
    </a-typography-title>
  </a-typography>
  <g-pro-table
    style="margin-top: 15px"
    :showIndex="false"
    :pagination="false"
    :options="false"
    size="default"
    :columns="proTable"
    :dataSource="proTableData"
    row-key="attributes"
  >
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'typesof'">
        <template v-if="record.attributes === 'search'">
          false | <a @click="handleTarget('#search-SearchConfig')">SearchConfig</a>
        </template>
        <template v-else-if="record.attributes === 'searchMap'">
          <a @click="handleTarget('#search-proSearchMap')">ProSearchMap</a>
        </template>
        <template v-else-if="record.attributes === 'columnsState'">
          <a>ColumnsStateType</a>
        </template>
        <template v-else>{{ record.typesof }}</template>
      </template>
    </template>
  </g-pro-table>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  emits: ['targetTo'],
  setup(_, { emit }) {
    const state = reactive({
      typesof: config.typesof,
      proTable: columns.proTable,
      requestCode: config.requestCode,
      proTableData: config.proTableData
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
