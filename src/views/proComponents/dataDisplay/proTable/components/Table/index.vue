<script setup lang="ts">
import type { ProTableProps, ProTableRef, RequsetFunction } from '@gx-design-vue/pro-table'
import type { TableRecord } from '@gx-mock/datasSource/table'
import { doDelete, getTableList } from '@/services/tableCenter'
import { useDict } from '@gx-admin/hooks/system'
import { useTable } from '@gx-design-vue/pro-table'
import { deepCopy } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import OperationModal from './components/OperationModal.vue'
import ScrollBreakpointModal from './components/ScrollBreakpointModal.vue'
import ScrollModal from './components/ScrollModal.vue'
import columns from './utils/columns'

const { dictState } = useDict([ 'sys_common_status' ])

const operationRef = ref(null)
const scrollModalRef = ref(null)
const scrollBreakpointModalRef = ref(null)

const tableRef = ref<ProTableRef>()

const { changeLoading, reload } = useTable(tableRef)

const state = reactive({
  inputSearchRef: '',
  showCustomize: false,
  showOptionsExtra: false,
  showScroll: true,
  showScrollBreakpoint: false,
  tableData: [] as TableRecord[],
  selectedRowKeys: [],
  selectedRowItems: []
})

const onSelectChange = (keys, items) => {
  state.selectedRowKeys = keys
  state.selectedRowItems = items
}

const tableConfig = reactive<Omit<ProTableProps, 'options'> & { options: boolean }>({
  align: 'center',
  polling: 2000,
  options: true,
  titleTip: true,
  bordered: true,
  showIndex: true,
  autoScroll: true,
  neverScroll: false,
  scrollBreakpoint: 'xl',
  draggabled: true,
  waitRequest: true,
  params: {
    adress: '',
    age: ''
  },
  search: { showSearch: true },
  searchMap: [
    {
      name: 'status',
      valueType: 'select',
      placeholder: '请选择操作状态',
      loading: true,
      valueEnum: []
    },
    {
      name: 'date',
      valueType: 'date',
      placeholder: '请选择'
    }
  ],
  columns: columns.index,
  rowSelection: {
    onChange: onSelectChange
  },
  rowKey: 'id',
  scroll: { x: 1850 }
})

watch(
  () => dictState.sys_common_status,
  (data) => {
    tableConfig.searchMap[0].loading = !!data?.loading
    tableConfig.searchMap[0].valueEnum = data?.data?.map((item) => {
      return {
        text: item.dictLabel,
        value: item.dictValue
      } as any
    }) || []
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => state.showScroll,
  () => {
    state.showScroll = !!tableConfig.scroll
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => tableConfig.autoScroll,
  (value) => {
    if (value) {
      state.showScrollBreakpoint = true
      tableConfig.scrollBreakpoint = 'xl'
    } else {
      state.showScrollBreakpoint = false
      tableConfig.scrollBreakpoint = undefined
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => tableConfig.neverScroll,
  (value) => {
    if (value) {
      state.showScroll = false
      state.showScrollBreakpoint = false
      tableConfig.scroll = undefined
      tableConfig.autoScroll = false
      tableConfig.scrollBreakpoint = undefined
    } else {
      state.showScroll = true
      state.showScrollBreakpoint = true
      tableConfig.scroll = { x: 1850 }
      tableConfig.autoScroll = true
      tableConfig.scrollBreakpoint = 'xl'
    }
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  setTimeout(() => {
    tableConfig.searchMap[0]['initialValue'] = '0'
    tableConfig.waitRequest = false
  }, 200)
  setTimeout(() => {
    tableConfig.polling = undefined
  }, 1000)
})

const getTableData: RequsetFunction<TableRecord> = async (params) => {
  const response = await getTableList<PageResult<TableRecord>>(params)
  state.tableData = deepCopy(response?.data?.list || [])
  return {
    data: deepCopy(response?.data?.list || []),
    success: !!response,
    total: response?.data?.totalCount || 0
  }
}

const handlePolling = () => {
  if (tableConfig.polling) {
    tableConfig.polling = undefined
    return
  }
  tableConfig.polling = 2000
}

const changeScroll = (value) => {
  if (value) {
    tableConfig.scroll = { x: 1850 }
    scrollModalRef.value.open()
  } else {
    tableConfig.scroll = undefined
  }
}

const handleScroll = (params) => {
  tableConfig.scroll = params
}

const changeScrollBreakpoint = (value) => {
  if (value) {
    tableConfig.scrollBreakpoint = 'xl'
    scrollBreakpointModalRef.value.open(tableConfig.scrollBreakpoint)
  }
}

const handleScrollBreakpoint = (params) => {
  tableConfig.scrollBreakpoint = params
}

const onReset = () => {
  tableConfig.params = {
    adress: '',
    age: ''
  }
}

const onSearchReset = () => {
  tableConfig.params = {
    adress: '',
    age: ''
  }
}

const batchOperation = (key) => {
  message.success(`你点击了${key.domEvent.target.textContent}`)
}

const removeTable = async () => {
  changeLoading(true)
  const response = await doDelete({
    ids: state.selectedRowKeys.join()
  })
  if (response) {
    message.success('操作成功！')
    reload({ immediate: true, removeKeys: state.selectedRowKeys })
  }
  changeLoading(false)
}
</script>

<template>
  <a-form :class="[$style['pro-table']]" layout="inline" class="mb-20px px-10px">
    <a-form-item>
      <template #label>
        Customize
        <a-tooltip title="是否自定义展示">
          <info-circle-outlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch v-model:checked="state.showCustomize" />
    </a-form-item>
    <a-form-item>
      <template #label>
        Scroll
        <a-tooltip
          title="根据屏幕大小或者scrollBreakpoint或者scroll?.x是否存在判断action列是否固定"
        >
          <info-circle-outlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch
        v-model:checked="state.showScroll"
        :disabled="tableConfig.neverScroll"
        @change="changeScroll"
      />
    </a-form-item>
    <a-form-item>
      <template #label>
        AutoScroll
        <a-tooltip
          title="根据屏幕大小或者scrollBreakpoint或者scroll?.x是否存在判断action列是否固定"
        >
          <info-circle-outlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch v-model:checked="tableConfig.autoScroll" :disabled="tableConfig.neverScroll" />
    </a-form-item>
    <a-form-item>
      <template #label>
        ScrollBreakpoint
        <a-tooltip title="滚动横向断点支持数字（屏幕宽度）；也支持md、xl，xxl等字符串，默认：xl">
          <info-circle-outlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch
        v-model:checked="state.showScrollBreakpoint"
        :disabled="tableConfig.neverScroll || !tableConfig.autoScroll"
        @change="changeScrollBreakpoint"
      />
    </a-form-item>
    <a-form-item label="NeverScroll">
      <a-switch v-model:checked="tableConfig.neverScroll" />
    </a-form-item>
    <a-form-item>
      <template #label>
        OptionsExtra
        <a-tooltip title="是否展示右侧额外的元素">
          <info-circle-outlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch v-model:checked="state.showOptionsExtra" />
    </a-form-item>
    <a-form-item label="Options">
      <a-switch v-model:checked="tableConfig.options" />
    </a-form-item>
    <a-form-item label="Draggabled">
      <a-switch v-model:checked="tableConfig.draggabled" />
    </a-form-item>
    <a-form-item>
      <template #label>
        ShowIndex
        <a-tooltip title="是否展示表格序号">
          <InfoCircleOutlined class="ml-5px" />
        </a-tooltip>
      </template>
      <a-switch v-model:checked="tableConfig.showIndex" />
    </a-form-item>
    <a-form-item label="Bordered">
      <a-switch v-model:checked="tableConfig.bordered" />
    </a-form-item>
    <a-form-item label="Align">
      <a-radio-group v-model:value="tableConfig.align">
        <a-radio-button value="left">
          left
        </a-radio-button>
        <a-radio-button value="center">
          Center
        </a-radio-button>
        <a-radio-button value="right">
          Right
        </a-radio-button>
      </a-radio-group>
    </a-form-item>
  </a-form>
  <g-pro-table
    ref="tableRef"
    v-bind="tableConfig"
    :request="getTableData"
    @reset="onReset"
    @search-reset="onSearchReset"
  >
    <template v-if="state.showCustomize" #customRender="dataScouce">
      <a-list
        row-key="id"
        :grid="{
          gutter: 5,
          xs: 1,
          sm: 2,
          md: 2,
          lg: 3,
          xl: 4,
          xxl: 5,
        }"
        :data-source="dataScouce"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-card hoverable>
              <template #cover>
                <g-image :height="200" :src="item.img" class="h-200px" fit="cover">
                  <template #placeholder>
                    <div class="gx-image-slot">
                      加载中...
                    </div>
                  </template>
                </g-image>
              </template>
              <a-card-meta>
                <template #title>
                  <a-tooltip :title="item.title" placement="top">
                    <a>{{ item.title }}</a>
                  </a-tooltip>
                </template>
                <template #description>
                  <a-typography-paragraph
                    :ellipsis="{ rows: 1 }"
                    :content="item.description || '暂无简介'"
                  />
                </template>
              </a-card-meta>
            </a-card>
          </a-list-item>
        </template>
      </a-list>
    </template>
    <template #headerTitle>
      <div>高级列表</div>
    </template>
    <template #toolBarBtn>
      <a-button key="button" type="primary" @click="operationRef?.open('sys_common_status')">
        新建
      </a-button>
      <a-button key="button" type="primary" @click="handlePolling">
        <loading-outlined v-if="tableConfig.polling" />
        <reload-outlined v-else />
        {{ tableConfig.polling ? '停止轮询' : '开始轮询' }}
      </a-button>
      <a-button
        v-if="state.selectedRowKeys.length > 0"
        key="button"
        danger
        type="primary"
        @click="removeTable"
      >
        删除
      </a-button>
      <a-dropdown :trigger="['click']">
        <template #overlay>
          <a-menu @click="(e) => batchOperation(e)">
            <a-menu-item key="0">
              1st menu item
            </a-menu-item>
            <a-menu-item key="1">
              2nd menu item
            </a-menu-item>
            <a-menu-divider />
            <a-menu-item key="3">
              3rd menu item
            </a-menu-item>
          </a-menu>
        </template>
        <a-button key="button" v-auth="'pro-table-btn'">
          批量操作
        </a-button>
      </a-dropdown>
    </template>
    <template #search>
      <a-input
        v-model:value="tableConfig.params.age"
        allow-clear
        placeholder="请输入年龄"
        style="width: 100%"
      />
      <a-input
        v-model:value="tableConfig.params.adress"
        allow-clear
        placeholder="请选择地址"
        style="width: 100%"
      />
    </template>
    <template v-if="state.showOptionsExtra" #optionsExtra>
      <a-button>这是一个右侧额外的元素</a-button>
    </template>
    <template #headerCell="{ column }">
      <template v-if="column.dataIndex === 'name'">
        FullName
      </template>
    </template>
    <template #bodyCell="{ column, record }">
      <template v-if="column.dataIndex === 'name'">
        这是高级列表的FullName的字段（测试溢出展示）：{{ record.title }}
      </template>
      <template v-if="column.dataIndex === 'action'">
        <a>这是高级列表的action的字段（测试溢出展示并且可复制）</a>
      </template>
    </template>
  </g-pro-table>
  <ScrollModal ref="scrollModalRef" @handle-ok="handleScroll" />
  <OperationModal ref="operationRef" @handle-ok="reload" />
  <ScrollBreakpointModal ref="scrollBreakpointModalRef" @handle-ok="handleScrollBreakpoint" />
</template>

<style lang="less" module>
.pro-table {
  :global {
    .ant-form-item {
      margin-bottom: 15px;
    }
  }
}
</style>
