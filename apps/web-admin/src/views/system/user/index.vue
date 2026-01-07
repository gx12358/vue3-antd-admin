<script setup lang="ts">
import type { TableActionsRow } from '@/components/layout/table-actions'
import type { SystemUserApi } from '@/services/system/user'
import { downloadFileFromBlobPart } from '@gx-core/shared/utils'
import { useAuth, useDept, useDict } from '@/hooks/system'
import { useProPageTable } from '@/hooks/web'
import { deleteUserList, exportUser, getUserPage, updateUserStatus } from '@/services/system/user'
import DeptsTree from './components/DeptsTree'
import Form from './components/Form/index.vue'
import ImportForm from './components/ImportForm/index.vue'
import PasswordForm from './components/PasswordForm/index.vue'
import RoleForm from './components/RoleForm/index.vue'
import { columns } from './utils/columns'

useDict(['system_user_sex', 'common_status'])
const { hasAuth } = useAuth()
const { deptTrees, deptLevels } = useDept()

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const roleFormRef = useTemplateRef<InstanceType<typeof RoleForm>>('roleFormRef')
const importFormRef = useTemplateRef<InstanceType<typeof ImportForm>>('importFormRef')
const passwordFormRef = useTemplateRef<InstanceType<typeof PasswordForm>>('passwordFormRef')

const [
  tableRef,
  { selectedKeys, tableState, reload, reloadAndReset },
  actions
] = useProPageTable<SystemUserApi.UserTableRecord, SystemUserApi.SearchConfig>({
  state: {
    headerTitle: '用户列表',
    columns,
    cardBordered: true,
    fitPage: true,
    rowKey: 'id',
    scrollBreakpoint: 1520,
    form: {
      span: {
        xxl: 5,
        xl: 3,
        lg: 2,
        md: 1,
        sm: 1,
        xs: 1
      }
    },
    pagination: {
      pageSize: 20
    },
    rowSelection: {}
  },
  request: getUserPage,
  deleteProps: {
    requestFn: deleteUserList
  },
  changeProps: {
    requestFn: updateUserStatus
  }
})

function onChangeStatus(status: boolean, row: SystemUserApi.UserTableRecord) {
  actions.change({
    id: row.id,
    status: status ? 0 : 1
  }, {
    title: `你要将 ${row.username} 的状态切换为【${status ? '开启' : '关闭'}】吗？`
  })
}

const toolsActions = computed<TableActionsRow[]>(() => [
  {
    label: '新增用户',
    type: 'create',
    auth: 'system:user:create',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => {
      formRef.value?.open()
    }
  },
  {
    label: '导出',
    type: 'export',
    auth: 'system:user:export',
    buttonProps: {
      type: 'primary'
    },
    onClick: async () => {
      try {
        const data = await exportUser(actions.getForm())
        downloadFileFromBlobPart({ fileName: '用户数据.xls', source: data })
      } catch {}
    }
  },
  {
    label: '导入',
    type: 'import',
    auth: 'system:user:import',
    buttonProps: {
      type: 'primary'
    },
    onClick: () => importFormRef.value?.open()
  },
  {
    label: '批量删除',
    type: 'danger',
    auth: 'system:user:delete',
    visible: selectedKeys.value.length > 0,
    buttonProps: {
      danger: true,
      type: 'primary'
    },
    onClick: () => actions.remove(selectedKeys.value)
  }
])

function renderActions(row: SystemUserApi.UserTableRecord) {
  return [
    {
      label: '编辑',
      type: 'update',
      auth: 'system:user:update',
      onClick: () => {
        formRef.value?.open(row)
      }
    },
    {
      label: '删除',
      type: 'danger',
      auth: 'system:user:delete',
      onClick: () => actions.remove([ row.id ])
    },
    {
      label: '更多',
      children: [
        {
          label: '分配角色',
          auth: 'system:permission:assign-user-role',
          onClick: () => roleFormRef.value?.open(row)
        },
        {
          label: '重置密码',
          auth: 'system:user:update-password',
          onClick: () => passwordFormRef.value?.open(row)
        }
      ]
    }
  ]
}

const handelSelect = (key: number) => {
  tableState.params.deptId = key
  reloadAndReset?.()
}
</script>

<template>
  <g-pro-page-container height="fit" :use-page-card="false">
    <Form ref="formRef" :dept-trees="deptTrees" @ok="reload" />
    <ImportForm ref="importFormRef" @ok="reload" />
    <RoleForm ref="roleFormRef" />
    <PasswordForm ref="passwordFormRef" />
    <a-row :gutter="16" class="h-full">
      <a-col :span="8" :xl="6" class="h-full">
        <div class="gx-card h-full">
          <DeptsTree
            class="gx-card-body"
            :tree-data="deptTrees"
            :level-data="deptLevels"
            @select="handelSelect"
          />
        </div>
      </a-col>
      <a-col :span="16" :xl="18" class="h-full overflow-hidden">
        <g-pro-table ref="tableRef" v-bind="tableState">
          <template #actions>
            <g-table-actions :actions="toolsActions" />
          </template>
          <template #bodyCell="{ column, record }: ProTableBodyCellProps<SystemUserApi.UserTableRecord>">
            <template v-if="column.dataIndex === 'status'">
              <a-switch
                :disabled="!hasAuth('system:user:update')"
                checked-children="开启"
                un-checked-children="停用"
                :checked="[0, '0'].includes(record.status)"
                @change="val => onChangeStatus(val as boolean, record)"
              />
            </template>
            <template v-if="column.dataIndex === 'action'">
              <g-table-actions :actions="renderActions(record)" />
            </template>
          </template>
        </g-pro-table>
      </a-col>
    </a-row>
  </g-pro-page-container>
</template>

<style scoped lang="less">
</style>
