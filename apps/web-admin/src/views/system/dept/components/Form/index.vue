<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SelectOption } from '@gx/types'
import type { SystemDeptApi } from '@/services/system/dept'
import { cloneDeep, forInObject, handleEmptyField, treeData } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createDept, getDept, getDeptList, updateDept } from '@/services/system/dept'
import { getSimpleUserList } from '@/services/system/user'
import { antOptionsValue, treeAntDataNode } from '@/utils/util'

type FormState = Omit<PartialFields<SystemDeptApi.Dept, 'leaderUserId' | 'sort'>, 'id' | 'createTime'> & {
  id?: any
}

type AntTreeSelectOptions = SelectOption<Omit<Partial<SystemDeptApi.Dept>, 'children'>>

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '部门',
  type: 'add' as 'add' | 'edit',
  userList: [] as SelectOption[],
  deptList: [] as AntTreeSelectOptions[]
})

const modalState = reactive<ProModalProps>({
  width: 600,
  open: false
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit,
} = useForm<FormState>({
  values: {
    id: undefined,
    parentId: undefined,
    name: '',
    sort: undefined,
    leaderUserId: undefined,
    phone: '',
    email: '',
    status: 0
  },
  dependencies: {
    parentId: {
      zod: z.number({ message: '请选择上级部门' }),
    },
    name: {
      zod: z.string().min(1, '请输入部门名称'),
    },
    sort: {
      zod: z.number({ message: '请输入显示顺序' }),
    },
    phone: {
      zod: z
        .string()
        .trim()
        .min(1, '请输入手机号码')
        .refine(v => /^1[3-9]\d{9}$/.test(v), { message: '请输入正确的手机号码' })
    },
    email: {
      required: false,
      zod: z
        .email({ message: '请输入正确的邮箱' })
        .optional()
        .or(z.literal('')),
    },
  }
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: FormState) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateDept(values) : createDept(values))
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
  open: async (row?: Partial<SystemDeptApi.Dept>) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    try {
      const [ deptList, userList ] = await Promise.all([
        getDeptList<SystemDeptApi.Dept[]>(),
        getSimpleUserList()
      ])
      state.userList = userList.map(item => ({ label: item.username, value: item.id }))
      const depts = treeData(cloneDeep(deptList || []), {
        emptyChildren: false,
        children: 'children',
      })
      state.deptList = [
        {
          id: 0,
          name: '顶级部门',
          label: '顶级部门',
          value: 0,
          children: treeAntDataNode<SystemDeptApi.Dept, AntTreeSelectOptions>(depts, {
            label: 'name',
            value: 'id'
          })
        }
      ]
    } catch {}
    if (row?.id) {
      loading.value = true
      try {
        const result = await getDept(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'status':
              formState[key] = result[key] ?? 0
              break
            case 'parentId':
              formState[key] = result[key] ?? undefined
              break
            case 'sort':
              formState[key] = result[key] ?? undefined
              break
            case 'leaderUserId':
              formState[key] = result[key] ?? undefined
              break
            default:
              formState[key] = handleEmptyField(result[key], '').value
              break
          }
        })
      } catch {}
      loading.value = false
    }
    if (row?.parentId) formState.parentId = row.parentId
  }
})
</script>

<template>
  <g-pro-modal
    v-bind="modalState"
    :spinning="loading"
    :title="title"
    @ok="handleSubmit(onOk)"
    @cancel="onClose"
  >
    <a-form class="gx-pro-form" :colon="false" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }">
      <a-form-item v-bind="register('parentId')" label="上级部门">
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          :tree-default-expanded-keys="[0]"
          :tree-data="state.deptList"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级部门"
          tree-node-filter-prop="label"
        />
      </a-form-item>
      <a-form-item v-bind="register('name')" label="部门名称">
        <a-input v-model:value="formState.name" placeholder="请输入部门名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('sort')" label="显示顺序">
        <a-input-number
          v-model:value="formState.sort"
          style="width: 100%"
          placeholder="请输入显示顺序"
          :min="0"
        />
      </a-form-item>
      <a-form-item label="负责人">
        <a-select
          v-model:value="formState.leaderUserId"
          placeholder="请选择负责人"
          :options="state.userList"
          allow-clear
        />
      </a-form-item>
      <a-form-item v-bind="register('phone')" label="联系电话">
        <a-input v-model:value="formState.phone" placeholder="请输入联系电话" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('email')" label="邮箱">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('status')" label="状态">
        <a-radio-group
          v-model:value="formState.status"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.common_status.data)"
        />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
