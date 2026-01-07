<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SelectOption } from '@gx/types'
import type { Dayjs } from 'dayjs'
import type { SystemTenantApi } from '@/services/system/tenant'
import { forInObject, handleEmptyField } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import dayjs from 'dayjs'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createTenant, getTenant, updateTenant } from '@/services/system/tenant'
import { getTenantPackageList } from '@/services/system/tenant-package'
import { antOptionsValue } from '@/utils/util'

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '租户',
  type: 'add' as 'add' | 'edit',
  tenantPackageList: [] as SelectOption[]
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
} = useForm<SystemTenantApi.UpdateTenantTableRecord>({
  values: {
    id: undefined,
    name: '',
    packageId: undefined,
    contactName: '',
    contactMobile: '',
    username: '',
    password: '',
    accountCount: undefined,
    expireTime: undefined,
    status: 0,
    websites: []
  },
  dependencies: {
    name: {
      zod: z.string().min(1, { message: '请输入租户名称' })
    },
    contactName: {
      zod: z.string().min(1, { message: '请输入联系人' })
    },
    username: {
      show: values => !values.id,
      zod: z.string().min(1, { message: '请输入用户名称' })
    },
    password: {
      show: values => !values.id,
      zod: z.string().min(1, { message: '请输入用户密码' })
    },
    accountCount: {
      required: false,
      zod: z.number({ message: '请输入正确的账号额度' }).nullable().optional()
    },
    packageId: {
      zod: z.number({ message: '请选择租户套餐' })
    },
    status: {
      zod: z.number({ message: '请选择租户状态' })
    },
    expireTime: {
      zod: z
        .custom<Dayjs>(
          val => dayjs.isDayjs(val),
          { message: '请选择过期时间' }
        )
    },
    websites: {
      zod: z
        .array(
          z.string().regex(/^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/, '请输入正确的网站地址')
        )
        .optional(),
    },
    contactMobile: {
      required: false,
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

async function onOk(values: SystemTenantApi.UpdateTenantTableRecord) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateTenant(values) : createTenant(values))
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
  open: async (row?: SystemTenantApi.TenantTableRecord) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    try {
      const tenantPackageList = await getTenantPackageList()
      state.tenantPackageList = tenantPackageList.map(item => ({ label: item.name, value: item.id }))
    } catch {}
    if (row) {
      loading.value = true
      try {
        const tenant = await getTenant(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'packageId':
              formState[key] = tenant[key] || undefined
              break
            case 'expireTime':
              formState[key] = tenant[key] ? dayjs(tenant[key]) : undefined
              break
            case 'status':
              formState[key] = tenant[key] ?? 0
              break
            case 'websites':
              formState[key] = tenant[key] || []
              break
            default:
              formState[key] = handleEmptyField(tenant[key], '').value
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
      <a-form-item v-bind="register('name')" label="租户名称">
        <a-input v-model:value="formState.name" placeholder="请输入租户名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('packageId')" label="租户套餐">
        <a-select
          v-model:value="formState.packageId"
          placeholder="请选择租户套餐"
          :options="state.tenantPackageList"
          allow-clear
        />
      </a-form-item>
      <a-form-item v-bind="register('contactName')" label="联系人">
        <a-input v-model:value="formState.contactName" placeholder="请输入联系人" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('contactMobile')" label="联系手机">
        <a-input v-model:value="formState.contactMobile" placeholder="请输入联系手机" allow-clear />
      </a-form-item>
      <a-form-item v-if="!formState.id" v-bind="register('username')" label="用户名称">
        <a-input v-model:value="formState.username" placeholder="请输入用户名称" allow-clear />
      </a-form-item>
      <a-form-item v-if="!formState.id" v-bind="register('password')" label="用户密码">
        <a-input-password v-model:value="formState.password" placeholder="请输入用户密码" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('accountCount')" label="账号额度">
        <a-input-number
          v-model:value="formState.accountCount"
          style="width: 100%"
          placeholder="请输入账号额度"
          :min="0"
        />
      </a-form-item>
      <a-form-item v-bind="register('expireTime')" label="过期时间">
        <a-date-picker
          v-model:value="formState.expireTime"
          style="width: 100%"
          placeholder="请输入过期时间"
          :min="0"
        />
      </a-form-item>
      <a-form-item v-bind="register('websites')" label="绑定域名">
        <a-select
          v-model:value="formState.websites"
          mode="multiple"
          style="width: 100%"
          placeholder="请输入绑定域名"
        />
      </a-form-item>
      <a-form-item v-bind="register('status')" label="租户状态">
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
