<template>
  <g-pro-modal
    title="ModalTable"
    :isFail="isFail"
    :visible="visible"
    :spinning="spinning"
    :skeletonLoading="skeletonLoading"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <g-pro-table
      align="center"
      :options="false"
      :modalScroll="true"
      :searchMap="searchMap"
      :waitRequest="waitRequest"
      :columns="columns.operationModal"
      :request="(params, sort, filter) => getTableData(params, sort, filter)"
      @reset="onReset"
    >
      <template #headerCell="{ column }">
        <template v-if="column.dataIndex === 'name'"> FullName </template>
      </template>
      <template #bodyCell="{ column, record }">
        <template v-if="column.dataIndex === 'name'">
          这是高级列表的FullName的字段（测试溢出展示）：{{ record.title }}
        </template>
        <template v-if="column.dataIndex === 'action'">
          <a-space :size="20">
            <a>编辑</a>
            <a>删除</a>
          </a-space>
        </template>
      </template>
    </g-pro-table>
  </g-pro-modal>
</template>

<script setup lang="ts">
import { reactive, ref, unref, watchEffect } from 'vue'
import { Form } from 'ant-design-vue'
import { getList } from '@/services/table'
import { useDict } from '@gx-admin/hooks/web'
import { deepCopy } from '@/utils/util'
import columns from '../../../utils/columns'

const useForm = Form.useForm

const emits = defineEmits(['handleOk'])

const { getDictData } = useDict(['sys_common_status'])

const visible = ref(false)
const isFail = ref(false)
const spinning = ref(false)
const waitRequest = ref(true)
const skeletonLoading = ref(false)

const tableData = ref([])
const searchMap = ref([
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
])

const params = reactive({
  adress: '',
  age: ''
})

watchEffect(() => {
  searchMap.value[0].loading = unref(getDictData.value).sys_common_status?.loading
  searchMap.value[0].valueEnum = (unref(getDictData.value).sys_common_status?.data || []).map(
    (item) => {
      return {
        text: item.dictLabel,
        value: item.dictValue
      }
    }
  )
})

const getTableData = async (params) => {
  const response: any = await getList(params)
  tableData.value = deepCopy(response?.data || [])
  return {
    data: deepCopy(response?.data || []),
    success: response && response.code === 200,
    total: response.total,
    msg: (response && response.msg) || '系统出错，请稍后再试！'
  }
}

const resetModalState = () => {
  visible.value = false
  isFail.value = false
  spinning.value = false
  skeletonLoading.value = false
}

const open = () => {
  visible.value = true
  searchMap.value[0]['initialValue'] = '0'
  setTimeout(() => {
    waitRequest.value = false
  }, 500)
}

const onReset = () => {
  params.age = ''
  params.adress = ''
}

const handleSubmit = () => {
  resetModalState()
}

const handleCancel = () => {
  resetModalState()
}

defineExpose({
  open
})
</script>

<style lang="less" module></style>
