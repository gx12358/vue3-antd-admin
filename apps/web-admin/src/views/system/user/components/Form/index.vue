<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemPostApi } from '@/services/system/post'
import type { SystemUserApi } from '@/services/system/user'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { getSimplePostList } from '@/services/system/post'
import { createUser, getUser, updateUser } from '@/services/system/user'
import { antOptionsValue } from '@/utils/util'

withDefaults(defineProps<{
  deptTrees: DeptTreeData[]
}>(), {
  deptTrees: () => []
})

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '用户',
  type: 'add' as 'add' | 'edit',
  postOptions: [] as SystemPostApi.PostTableRecord[]
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
  handleSubmit
} = useForm<SystemUserApi.UpdateUserTableRecord>({
  values: {
    id: undefined,
    username: '',
    nickname: '',
    password: '',
    deptId: undefined,
    postIds: [],
    email: '',
    mobile: '',
    sex: 1,
    status: 0,
    remark: ''
  },
  dependencies: {
    username: {
      zod: z.string().min(1, { message: '请输入用户名称' })
    },
    nickname: {
      zod: z.string().min(1, { message: '请输入用户昵称' })
    },
    password: {
      zod: z.string().min(1, { message: '请输入密码' }).optional(),
      rules: (values) => {
        if (values.id) return true
      }
    },
    email: {
      zod: z
        .email({ message: '请输入正确的邮箱' })
        .optional()
        .or(z.literal('')),
    },
    mobile: {
      zod: z
        .string()
        .trim()
        .refine(v => /^1[3-9]\d{9}$/.test(v), { message: '请输入正确的手机号码' })
        .optional()
    }
  },
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: SystemUserApi.UpdateUserTableRecord) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateUser(values) : createUser(values))
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
  open: async (row?: SystemUserApi.UserTableRecord) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    try {
      state.postOptions = await getSimplePostList()
    } catch {}
    if (row) {
      loading.value = true
      try {
        const result = await getUser(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'postIds':
              formState[key] = result[key] || []
              break
            case 'deptId':
              formState[key] = result[key] || undefined
              break
            case 'sex':
              formState[key] = result[key] ?? 1
              break
            case 'status':
              formState[key] = result[key] ?? 0
              break
            default:
              formState[key] = handleEmptyField(result[key], '').value
              break
          }
        })
      } catch {}
      loading.value = false
    }
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
      <a-form-item v-bind="register('username')" label="用户名称">
        <a-input v-model:value="formState.username" placeholder="请输入用户名称" allow-clear />
      </a-form-item>
      <a-form-item v-if="!formState.id" v-bind="register('password')" label="用户密码">
        <a-input-password v-model:value="formState.password" placeholder="请输入用户密码" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('nickname')" label="用户昵称">
        <a-input v-model:value="formState.nickname" placeholder="请输入用户昵称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('email')" label="邮箱" :required="false">
        <a-input v-model:value="formState.email" placeholder="请输入邮箱" allow-clear />
      </a-form-item>
      <a-form-item label="归属部门">
        <template v-if="deptTrees.length">
          <a-tree-select
            v-model:value="formState.deptId"
            style="width: 100%"
            :dropdown-match-select-width="false"
            :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
            :tree-data="deptTrees"
            tree-default-expand-all
            placeholder="请选择归属部门"
          />
        </template>
      </a-form-item>
      <a-form-item label="岗位">
        <a-select
          v-model:value="formState.postIds"
          mode="multiple"
          placeholder="请选择岗位"
          allow-clear
          style="width: 100%"
          :options="state.postOptions.map(item => ({ value: item.id, label: item.name }))"
        />
      </a-form-item>
      <a-form-item v-bind="register('mobile')" label="手机号码" :required="false">
        <a-input v-model:value="formState.mobile" placeholder="请输入手机号码" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('sex')" label="用户性别" required>
        <a-radio-group
          v-model:value="formState.sex"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.system_user_sex.data)"
        />
      </a-form-item>
      <a-form-item v-bind="register('status')" label="用户状态" required>
        <a-radio-group
          v-model:value="formState.status"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.common_status.data)"
        />
      </a-form-item>
      <a-form-item label="备注">
        <a-textarea v-model:value="formState.remark" :rows="2" placeholder="请输入备注" allow-clear />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
