<script setup lang="ts">
import type { MockTableRecord, SearchConfig } from './typings'
import { deepCopy } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive, ref, watch } from 'vue'
import { useDict, useUpdateTableSearchMap } from '@/hooks/system'
import { useProTable } from '@/hooks/web'
import { getList } from '@/services/demo'
import OperationModal from './components/OperationModal.vue'
import ScrollBreakpointModal from './components/ScrollBreakpointModal.vue'
import ScrollModal from './components/ScrollModal.vue'
import { columns } from './utils/columns'

const emits = defineEmits([ 'changePageCard' ])

useDict([ 'common_status' ])

const tableRef = ref()
const operationRef = useTemplateRef<InstanceType<typeof OperationModal>>('operation')
const scrollModalRef = useTemplateRef<InstanceType<typeof ScrollModal>>('scroll-modal')
const scrollBreakpointModalRef = useTemplateRef<InstanceType<typeof ScrollBreakpointModal >>('scroll-breakpoint-modal')

const state = reactive({
  inputSearchRef: '',
  showCard: false,
  showCustomize: false,
  showOptionsExtra: false,
  showScroll: true,
  showScrollBreakpoint: false,
  tableData: [] as MockTableRecord[],
  selectedRowKeys: [] as any[],
  selectedRowItems: [] as MockTableRecord[]
})

const { tableState, reload, updateSearchMap } = useProTable<MockTableRecord, SearchConfig>(
  tableRef,
  {
    state: {
      polling: 2000,
      options: true,
      titleTip: true,
      showIndex: true,
      autoScroll: true,
      neverScroll: false,
      cardBordered: state.showCard,
      scrollBreakpoint: 'xl',
      draggable: true,
      waitRequest: true,
      params: {
        adress: ''
      },
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
      columns,
      rowSelection: {
        onChange: (keys, items) => {
          state.selectedRowKeys = keys
          state.selectedRowItems = items
        }
      },
      rowKey: 'id',
      scroll: { x: 1850 }
    },
    request: async (params) => {
      const { list = [], total = 0 } = await getList<PageResult<MockTableRecord>>(params)
      state.tableData = list
      return {
        data: list,
        success: true,
        total
      }
    }
  }
)

useUpdateTableSearchMap<keyof MockTableRecord>('common_status', {
  key: 'status',
  callback: updateSearchMap
})

watch(
  () => state.showScroll,
  () => {
    state.showScroll = !!tableState.scroll
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => tableState.autoScroll,
  (value) => {
    if (value) {
      state.showScrollBreakpoint = true
      tableState.scrollBreakpoint = 'xl'
    } else {
      state.showScrollBreakpoint = false
      tableState.scrollBreakpoint = undefined
    }
  },
  {
    deep: true,
    immediate: true
  }
)

watch(
  () => tableState.neverScroll,
  (value) => {
    if (value) {
      state.showScroll = false
      state.showScrollBreakpoint = false
      tableState.scroll = undefined
      tableState.autoScroll = false
      tableState.scrollBreakpoint = undefined
    } else {
      state.showScroll = true
      state.showScrollBreakpoint = true
      tableState.scroll = { x: 1850 }
      tableState.autoScroll = true
      tableState.scrollBreakpoint = 'xl'
    }
  },
  {
    deep: true,
    immediate: true
  }
)

onMounted(() => {
  setTimeout(() => {
    if (tableState.searchMap) {
      tableState.searchMap[0]['initialValue'] = '0'
    }
    tableState.waitRequest = false
  }, 200)
  setTimeout(() => {
    tableState.polling = undefined
  }, 1000)
})

const handlePolling = () => {
  if (tableState.polling) {
    tableState.polling = undefined
    return
  }
  tableState.polling = 2000
}

const changeScroll = (value) => {
  if (value) {
    tableState.scroll = { x: 1850 }
    scrollModalRef.value?.open()
  } else {
    tableState.scroll = undefined
  }
}

const handleScroll = (params) => {
  tableState.scroll = params
}

const changeScrollBreakpoint = (value) => {
  if (value) {
    tableState.scrollBreakpoint = 'xl'
    scrollBreakpointModalRef.value?.open(tableState.scrollBreakpoint)
  }
}

const handleScrollBreakpoint = (params) => {
  tableState.scrollBreakpoint = params
}

const onReset = () => tableState.params.adress = ''

const onSearchReset = () => onReset()

const batchOperation = (key) => {
  message.success(`你点击了${key.domEvent.target.textContent}`)
}

const removeTable = async () => {

}

function changeTableCard(val: boolean) {
  state.showCard = val
  tableState.cardBordered = val
  emits('changePageCard', val)
}
</script>

<template>
  <g-pro-page-container :use-page-card="!state.showCard">
    <a-typography id="g-pro-table">
      <a-typography-title :level="2">
        ProTable - 高级表格
      </a-typography-title>
    </a-typography>
    <div class="mb-16px" :class="state.showCard ? 'p-20px pb-4px rd-6px' : 'bd-b-split'">
      <a-form :class="[$style['pro-table']]" layout="inline">
        <a-form-item label="Table 和 Search 分割">
          <a-switch v-model:checked="state.showCard" @change="val => changeTableCard(!!val)" />
        </a-form-item>
        <a-form-item>
          <template #label>
            自定义
            <a-tooltip title="每一项自定义展示，其他遵循table">
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
            :disabled="tableState.neverScroll"
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
          <a-switch v-model:checked="tableState.autoScroll" :disabled="tableState.neverScroll" />
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
            :disabled="tableState.neverScroll || !tableState.autoScroll"
            @change="changeScrollBreakpoint"
          />
        </a-form-item>
        <a-form-item label="NeverScroll">
          <a-switch v-model:checked="tableState.neverScroll" />
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
          <a-switch v-model:checked="tableState.options as boolean" />
        </a-form-item>
        <a-form-item label="Draggabled">
          <a-switch v-model:checked="tableState.draggable" />
        </a-form-item>
        <a-form-item>
          <template #label>
            序号
            <a-tooltip title="是否展示表格序号">
              <InfoCircleOutlined class="ml-5px" />
            </a-tooltip>
          </template>
          <a-switch v-model:checked="tableState.showIndex" />
        </a-form-item>
        <a-form-item label="Bordered">
          <a-switch v-model:checked="tableState.bordered" />
        </a-form-item>
        <a-form-item label="Align">
          <a-radio-group v-model:value="tableState.align">
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
    </div>
    <g-pro-table
      ref="tableRef"
      v-bind="tableState"
      @reset="onReset"
      @search-reset="onSearchReset"
    >
      <template v-if="state.showCustomize" #customRender="{ dataSource } : CustomRenderResult<TableRecord<MockTableRecord>>">
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
          :data-source="dataSource"
        >
          <template #renderItem="{ item }: { item: TableRecord<MockTableRecord> }">
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
        <a-button key="button" type="primary" @click="operationRef?.open()">
          新建
        </a-button>
        <a-button key="button" type="primary" @click="handlePolling">
          <loading-outlined v-if="tableState.polling" />
          <reload-outlined v-else />
          {{ tableState.polling ? '停止轮询' : '开始轮询' }}
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
        <a-input-number
          v-model:value="tableState.params.age"
          allow-clear
          placeholder="请输入年龄"
          style="width: 100%"
        />
        <a-input
          v-model:value="tableState.params.adress"
          allow-clear
          placeholder="请选择地址"
          style="width: 100%"
        />
      </template>
      <template v-if="state.showOptionsExtra" #optionsExtra>
        <a-button>这是一个右侧额外的元素</a-button>
      </template>
      <template #bodyCell="{ column, record }: ProTableBodyCellProps<MockTableRecord>">
        <template v-if="column.dataIndex === 'title'">
          这是高级列表的FullName的字段（测试溢出展示）：{{ record.title }}
        </template>
        <template v-if="column.dataIndex === 'percent'">
          <a-progress :percent="record.percent" :show-info="false" />
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a>这是高级列表的action的字段（测试溢出展示并且可复制）</a>
        </template>
      </template>
    </g-pro-table>
    <ScrollModal ref="scroll-modal" @handle-ok="handleScroll" />
    <OperationModal ref="operation" @handle-ok="reload" />
    <ScrollBreakpointModal ref="scroll-breakpoint-modal" @handle-ok="handleScrollBreakpoint" />
  </g-pro-page-container>
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
