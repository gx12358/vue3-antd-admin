<template>
  <a-typography id="watermark-position" style="margin-top: 15px">
    <a-typography-title :level="4" style="font-weight: normal; color: #454d64">
      前置水印
    </a-typography-title>
  </a-typography>
  <a-typography>
    <a-typography style="color: #454d64">
      水印组件默认实现为前置水印，即设想水印会显示在内容的上方，zIndex 默认设置为
      9，如果你不希望水印遮挡上层内容，可以调整该值到小于上层内容的 zIndex。
    </a-typography>
  </a-typography>
  <div style="margin-top: 15px">
    <g-pro-watermark content="gx12358" :zIndex="11">
      <g-pro-table
        style="position: relative; z-index: 10"
        :showIndex="false"
        :columns="columns"
        :dataSource="tableData"
        row-key="sortIndex"
      >
        <template #headerCell="{ column }">
          <template v-if="column.dataIndex === 'createdAt'">
            创建时间
            <a-tooltip placement="top" title="这是一段描述">
              <QuestionCircleOutlined style="margin-left: 4px" />
            </a-tooltip>
          </template>
        </template>
        <template #bodyCell="{ column, record }">
          <template v-if="column.dataIndex === 'name'">
            <a>{{ record.name }}</a>
          </template>
          <template v-if="column.dataIndex === 'action'">
            <a-space align="center">
              <a key="link">链路</a>
              <a key="link2">报警</a>
              <a key="link3">监控</a>
              <a-dropdown>
                <a @click.prevent>
                  <EllipsisOutlined />
                </a>
                <template #overlay>
                  <a-menu>
                    <a-menu-item> 复制 </a-menu-item>
                    <a-menu-item> 删除 </a-menu-item>
                  </a-menu>
                </template>
              </a-dropdown>
            </a-space>
          </template>
        </template>
      </g-pro-table>
    </g-pro-watermark>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue'
import { QuestionCircleOutlined, EllipsisOutlined } from '@ant-design/icons-vue'
import columns from '../utils/columns'
import config from '../utils/config'

export default defineComponent({
  components: { QuestionCircleOutlined, EllipsisOutlined },
  setup() {
    const state = reactive({
      columns: columns.position,
      tableData: config.positionData
    })

    return {
      ...toRefs(state)
    }
  }
})
</script>
