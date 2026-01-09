<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemDeptApi } from '@/services/system/dept'
import type { SystemPermissionApi } from '@/services/system/permission'
import type { SystemRoleApi } from '@/services/system/role'
import { SearchOutlined } from '@ant-design/icons-vue'
import { cloneDeep, forInObject, handleEmptyField, isArray, treeData } from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { message } from 'ant-design-vue'
import { h } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { getDeptList } from '@/services/system/dept'
import { assignRoleDataScope } from '@/services/system/permission'
import { getRole } from '@/services/system/role'
import { antOptionsValue, buildTreeMaps, cleanInvalidParents, fillParentKeys, treeAntDataNode } from '@/utils/util'

type FormState = PartialFields<SystemPermissionApi.AssignRoleDataScopeReqVO, 'roleId' | 'dataScope'>

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  expand: false,
  selectAll: false,
  searchValue: '',
  autoExpandParent: false,
  expandedKeys: [] as number[],
  levelDepts: [] as SystemDeptApi.Dept[],
  deptsTreeMap: null as Map<number, number[]> | null,
  rowSelect: null as SystemRoleApi.UpdateRoleTableRecord | null
})

const { run, data: deptList } = useRequest<AntDataNode[], any, SystemDeptApi.Dept[]>(
  getDeptList,
  {
    defaultData: [],
    manual: false,
    onSuccess: (data) => {
      state.levelDepts = cloneDeep(data)
      const antTrees = treeAntDataNode<SystemDeptApi.Dept, AntDataNode>(
        treeData(cloneDeep(data || []), {
          emptyChildren: false,
          children: 'children'
        }),
        {
          label: 'name'
        }
      )
      state.deptsTreeMap = buildTreeMaps(antTrees)
      return antTrees
    }
  }
)

const modalState = reactive<ProModalProps>({
  width: 600,
  open: false,
  title: '数据权限'
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit
} = useForm<FormState>({
  values: {
    roleId: undefined,
    dataScope: undefined,
    dataScopeDeptIds: []
  },
  dependencies: {
    dataScope: {
      zod: z.number({ message: '请选择权限范围' })
    },
    dataScopeDeptIds: {
      required: false,
      zod: z
        .array(z.number(), { message: '请选择正确的部门数据' })
        .optional(),
      show: values => values.dataScope === 2
    }
  }
})

const getParentKey = (
  key: number,
  tree: DeptTreeData[]
): number | undefined => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.id === key)) {
        parentKey = node.id
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}

watch(() => state.searchValue, (value) => {
  const expanded = state.levelDepts
    .map((item) => {
      if (item.name.includes(value)) {
        return getParentKey(item.id as number, deptList.value)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)
  console.log(expanded)
  if (expanded.length && value) {
    state.expandedKeys = expanded as number[]
    state.autoExpandParent = true
  }
})

const onCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
  const checked = e.target.checked
  formState.dataScopeDeptIds = checked ? state.levelDepts.map(item => item.id as number) : []
}

const onCheck = (keys) => {
  formState.dataScopeDeptIds = isArray(keys) ? keys : keys.checked
}

const onExpand = (keys: any[]) => {
  state.expandedKeys = keys
  state.autoExpandParent = false
}

const onExpandAll = (e: ChangeEvent<HTMLInputElement>) => {
  const checked = e.target.checked
  state.expandedKeys = checked ? state.levelDepts.map(item => item.id as number) : []
}

async function onOk(values: FormState) {
  // 提交表单
  try {
    loading.value = true
    values.dataScopeDeptIds = Array.from(fillParentKeys(
      new Set(values.dataScopeDeptIds),
      deptList.value,
      state.deptsTreeMap as Map<number, number[]>
    ))
    await assignRoleDataScope({
      ...values,
      dataScopeDeptIds: values.dataScope === 2 ? values.dataScopeDeptIds : []
    } as SystemPermissionApi.AssignRoleDataScopeReqVO)
    emits('ok')
    onClose()
    message.success('操作成功')
  } finally {
    loading.value = false
  }
}

function onClose() {
  resetFields()
  resetState()
  modalState.open = false
}

defineExpose({
  open: async (row: SystemRoleApi.RoleTableRecord) => {
    modalState.open = true
    loading.value = true
    await run()
    try {
      state.rowSelect = await getRole(row.id)
      forInObject(formState, (key) => {
        switch (key) {
          case 'dataScope':
            formState[key] = row[key] ?? undefined
            break
          case 'dataScopeDeptIds':
            formState[key] = row[key] ?? []
            break
          default:
            formState[key] = handleEmptyField(row[key], '').value
            break
        }
      })
      formState.roleId = row.id
      if (state.deptsTreeMap) {
        formState.dataScopeDeptIds = Array.from(cleanInvalidParents(
          new Set(formState.dataScopeDeptIds),
          deptList.value,
          state.deptsTreeMap
        ))
      }
      state.selectAll = formState.dataScopeDeptIds.length === state.levelDepts.length
    } catch {}
    loading.value = false
  }
})
</script>

<template>
  <g-pro-modal
    v-bind="modalState"
    :spinning="loading"
    @ok="handleSubmit(onOk)"
    @cancel="onClose"
  >
    <a-form class="gx-pro-form" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item label="角色名称">
        <a-input :value="state.rowSelect?.name" disabled />
      </a-form-item>
      <a-form-item label="角色标识">
        <a-input :value="state.rowSelect?.code" disabled />
      </a-form-item>
      <a-form-item v-bind="register('dataScope')" label="权限范围" required>
        <a-select
          v-model:value="formState.dataScope"
          placeholder="请选择权限范围"
          :options="antOptionsValue(dict.system_data_scope.data)"
        />
      </a-form-item>
      <a-form-item v-if="formState.dataScope === 2" v-bind="register('dataScopeDeptIds')" label="部门范围">
        <div class="bd-border rd-6px overflow-hidden">
          <div class="bd-b-border h-32px flex items-center justify-between pl-10px pr-4px">
            <a-checkbox v-model:checked="state.selectAll" @change="onCheckAll as any">
              <span class="text-primary">{{ state.selectAll ? '取消全选' : '全选' }}</span>
            </a-checkbox>
            <div class="flex items-center gap-8px">
              <a-checkbox v-model:checked="state.expand" @change="onExpandAll as any">
                <span class="text-primary">{{ state.expand ? '收起' : '展开' }}</span>
              </a-checkbox>
            </div>
          </div>
          <div class="p-4px">
            <div class="pt-4px mb-8px px-6px">
              <a-input v-model:value="state.searchValue" placeholder="请输入部门名称" :prefix="h(SearchOutlined)" />
            </div>
            <a-tree
              v-model:expanded-keys="state.expandedKeys"
              :auto-expand-parent="state.autoExpandParent"
              :checked-keys="formState.dataScopeDeptIds"
              block-node
              checkable
              :tree-data="deptList"
              @check="onCheck"
              @expand="onExpand"
            >
              <template #title="{ title }">
                <span v-if="title.includes(state.searchValue) && state.searchValue">
                  {{ title.substring(0, title.indexOf(state.searchValue)) }}
                  <span class="text-error">{{ state.searchValue }}</span>
                  {{ title.substring(title.indexOf(state.searchValue) + state.searchValue.length) }}
                </span>
                <span v-else>{{ title }}</span>
              </template>
            </a-tree>
          </div>
        </div>
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
