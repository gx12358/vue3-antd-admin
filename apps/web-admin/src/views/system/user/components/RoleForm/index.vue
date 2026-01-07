<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SelectOption } from '@gx/types'
import type { SystemPermissionApi } from '@/services/system/permission'
import type { SystemUserApi } from '@/services/system/user'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { useForm, useModalState } from '@/hooks/state'
import { assignUserRole, getUserRoleList } from '@/services/system/permission'
import { getSimpleRoleList } from '@/services/system/role'

type FormState = PartialFields<SystemPermissionApi.AssignUserRoleReqVO, 'userId'> & Pick<SystemUserApi.UpdateUserTableRecord, 'username' | 'nickname'>

const { state } = useModalState({
  rolesOptions: [] as SelectOption[]
})

const modalState = reactive<ProModalProps>({
  width: 520,
  title: '分配角色',
  open: false
})

const {
  register,
  formState,
  loading,
  resetFields,
  handleSubmit
} = useForm<FormState>({
  values: {
    username: '',
    nickname: '',
    userId: undefined,
    roleIds: []
  },
})

async function onOk(values: FormState) {
  // 提交表单
  try {
    if (!values.userId) return
    loading.value = true
    await assignUserRole({
      userId: values.userId,
      roleIds: values.roleIds
    })
    onClose()
    message.success('操作成功')
  } finally {
    loading.value = false
  }
}

function onClose() {
  resetFields()
  modalState.open = false
}

defineExpose({
  open: async (row: SystemUserApi.UserTableRecord) => {
    if (!row.id) return
    modalState.open = true
    loading.value = true
    try {
      formState.userId = row.id
      formState.nickname = row.nickname
      formState.username = row.username
      const [ roleList, roleIds ] = await Promise.all([
        getSimpleRoleList(),
        getUserRoleList(row.id)
      ])
      state.rolesOptions = roleList.map(item => ({ label: item.name, value: item.id }))
      formState.roleIds = roleIds || []
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
      <a-form-item v-bind="register('username')" label="用户名称">
        <a-input disabled :value="formState.username" />
      </a-form-item>
      <a-form-item v-bind="register('nickname')" label="用户昵称">
        <a-input disabled :value="formState.username" />
      </a-form-item>
      <a-form-item v-bind="register('roleIds')" label="角色">
        <a-select v-model:value="formState.roleIds" mode="multiple" :options="state.rolesOptions" />
      </a-form-item>
    </a-form>
  </g-pro-modal>
</template>

<style scoped lang="less">

</style>
