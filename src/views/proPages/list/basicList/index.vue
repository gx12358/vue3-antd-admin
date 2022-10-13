<template>
  <g-pro-page-container>
    <div :class="$style.standardList">
      <a-card :bordered="false">
        <a-row>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>我的待办</span>
              <p>8个任务</p>
              <em></em>
            </div>
          </a-col>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>本周任务平均处理时间</span>
              <p>32分钟</p>
              <em></em>
            </div>
          </a-col>
          <a-col :sm="8" :xs="24">
            <div :class="$style.headerInfo">
              <span>本周完成任务数</span>
              <p>24个任务</p>
            </div>
          </a-col>
        </a-row>
      </a-card>

      <a-card
        style="margin-top: 24px"
        title="基本列表"
        :bodyStyle="{ padding: '0 32px 40px 32px' }"
        :class="$style.listCard"
        :bordered="false"
      >
        <template #extra>
          <a-space :size="16">
            <a-radio-group v-model:value="listParams.status" @change="changeSearch">
              <a-radio-button value="all">全部</a-radio-button>
              <a-radio-button value="normal">等待中</a-radio-button>
              <a-radio-button value="active">进行中</a-radio-button>
              <a-radio-button value="exception">失败</a-radio-button>
              <a-radio-button value="success">成功</a-radio-button>
            </a-radio-group>
            <a-input-search
              v-model:value="listParams.title"
              placeholder="请输入"
              allow-clear
              enter-button
              @search="changeSearch"
            />
            <RedoOutlined
              @click="getListData"
              style="font-size: 18px; color: #8c8c8c; cursor: pointer"
            />
          </a-space>
        </template>
        <a-list
          size="large"
          rowKey="id"
          :loading="loading"
          :dataSource="list"
          :pagination="paginationProps"
        >
          <template #renderItem="{ item }">
            <a-list-item>
              <template #actions>
                <a key="edit" @click="$refs.operation.edit(item.id, item)">编辑</a>
                <a-dropdown>
                  <template #overlay>
                    <a-menu @click="({ key }) => editAndDelete(key, item)">
                      <a-menu-item key="edit">编辑</a-menu-item>
                      <a-menu-item key="delete">删除</a-menu-item>
                    </a-menu>
                  </template>
                  <a>
                    更多
                    <DownOutlined />
                  </a>
                </a-dropdown>
              </template>
              <a-list-item-meta :description="item.subDescription">
                <template #title>
                  <a :href="item.href">{{ item.title }}</a>
                </template>
                <template #avatar>
                  <a-avatar :src="item.logo" shape="square" size="large" />
                </template>
              </a-list-item-meta>
              <div :class="$style.listContent">
                <div :class="$style.listContentItem">
                  <span>Owner</span>
                  <p>{{ item.owner }}</p>
                </div>
                <div :class="$style.listContentItem">
                  <span>开始时间</span>
                  <p>{{ item.createdAt }}</p>
                </div>
                <div :class="$style.listContentItem">
                  <Progress
                    style="width: 180px"
                    :strokeWidth="6"
                    :percent="item.percent"
                    :status="item.status"
                  />
                </div>
              </div>
            </a-list-item>
          </template>
        </a-list>
      </a-card>
    </div>
    <a-button type="dashed" style="width: 100%; margin-bottom: 8px" @click="$refs.operation.open()">
      <PlusOutlined />
      添加
    </a-button>
    <OperationModal ref="operation" @handleOk="getListData" />
  </g-pro-page-container>
</template>

<script lang="ts">
import { computed, createVNode, defineComponent, onActivated, reactive, ref, toRefs } from 'vue'
import { message, Modal, Progress } from 'ant-design-vue'
import {
  PlusOutlined,
  DownOutlined,
  ExclamationCircleOutlined,
  RedoOutlined
} from '@ant-design/icons-vue'
import type { BasicListItemDataType } from '@/services/list/basic'
import { getBasicList, removeBasicList } from '@/services/list/basic'
import OperationModal from './components/OperationModal.vue'

export default defineComponent({
  components: {
    Progress,
    RedoOutlined,
    PlusOutlined,
    DownOutlined,
    OperationModal
  },
  setup() {
    const operation = ref()
    const state = reactive({
      loading: false,
      list: [] as BasicListItemDataType[],
      listParams: {
        title: '',
        status: 'all'
      } as Partial<BasicListItemDataType>,
      pageConfig: {
        pageNum: 1,
        pageSize: 5,
        total: 0
      }
    })
    const paginationProps = computed(() => {
      return {
        showSizeChanger: true,
        showQuickJumper: true,
        pageSize: state.pageConfig.pageSize,
        pageSizeOptions: ['5', '10', '30', '50', '100'],
        total: state.pageConfig.total,
        onChange: (page: number, pageSize: number) => {
          state.pageConfig.pageNum = page
          state.pageConfig.pageSize = pageSize
          getListData()
        }
      }
    })
    onActivated(() => {
      getListData()
    })
    const getListData = async () => {
      state.loading = true
      const response = await getBasicList({
        ...state.pageConfig,
        ...state.listParams
      })
      if (response) {
        state.list = response.data?.list || []
        state.pageConfig.total = response.data?.total || 0
      }
      state.loading = false
    }
    const changeSearch = () => {
      getListData()
    }
    const editAndDelete = (key: string | number, currentItem: BasicListItemDataType) => {
      if (key === 'edit') operation.value?.edit(currentItem.id, currentItem)
      else if (key === 'delete') {
        Modal.confirm({
          title: '确定要删除吗?',
          icon: createVNode(ExclamationCircleOutlined),
          okText: '确定',
          cancelText: '取消',
          class: 'gx-pro-confirm-delete',
          onOk() {
            deleteItem(currentItem.id)
          }
        })
      }
    }
    const deleteItem = async (id: string) => {
      state.loading = true
      const response: any = await removeBasicList({ id })
      if (response) {
        message.success('操作成功！')
        await getListData()
      }
      state.loading = false
    }
    return {
      ...toRefs(state),
      operation,
      paginationProps,
      changeSearch,
      getListData,
      editAndDelete
    }
  }
})
</script>

<style lang="less" module>
@import './style';
</style>
