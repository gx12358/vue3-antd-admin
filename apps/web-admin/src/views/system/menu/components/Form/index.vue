<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SelectOption } from '@gx/types'
import { isHttpUrl } from '@gx-core/shared/utils'
import { cloneDeep, forInObject, handleEmptyField, treeData } from '@gx-design-vue/pro-utils'
import { message } from 'ant-design-vue'
import { reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { createMenu, getMenu, getMenuList, updateMenu } from '@/services/system/menu'
import { antOptionsValue, treeAntDataNode } from '@/utils/util'

type FormState = PartialFields<SystemMenuItem, 'id'>

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '菜单',
  type: 'add' as 'add' | 'edit',
  menusList: [] as SelectOption<SystemMenuItem>[]
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
  clearValidate
} = useForm<FormState>({
  values: {
    id: undefined,
    parentId: undefined,
    name: '',
    type: 1,
    icon: '',
    path: '',
    component: '',
    permission: '',
    sort: undefined,
    status: 0,
    linkStatus: 1,
    keepAlive: true
  },
  dependencies: {
    parentId: {
      zod: z.number({ message: '请选择上级菜单' }),
    },
    name: {
      zod: z.string().min(1, '菜单名称不能为空'),
    },
    sort: {
      zod: z.number({ message: '请输入显示顺序' }),
    },
    path: {
      show: values => values.type ? [1, 2].includes(values.type) : true,
      triggerFields: ['parentId', 'type'],
      zod: z.string().min(1, '路由地址不能为空'),
      rules: (values, options) => {
        if (values.type === 1 && isHttpUrl(values.path)) {
          return `'目录' 路由地址不能是外链`
        }
        if (isHttpUrl(values.path)) return true
        if (values.parentId === 0) {
          return options.zod.refine(
            path => path.charAt(0) === '/',
            '路径必须以 / 开头',
          )
        }
        return options.zod.refine(
          path => path.charAt(0) !== '/',
          '路径不能以 / 开头',
        )
      }
    }
  }
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
})

async function onOk(values: FormState) {
  // 提交表单
  try {
    loading.value = true
    await (values.id ? updateMenu(values) : createMenu(values))
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
  open: async (row?: Partial<SystemMenuItem>) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    try {
      const result = await getMenuList<SystemMenuItem[]>()
      const menus = treeData(cloneDeep(result || []), {
        emptyChildren: false,
        children: 'children',
      })
      const trees = treeAntDataNode<SystemMenuItem, SelectOption<SystemMenuItem>>(menus, {
        label: 'name',
        value: 'id'
      })
      state.menusList = [
        {
          id: 0,
          name: '顶级菜单',
          label: '顶级菜单',
          value: 0,
          children: trees
        }
      ]
    } catch {}
    if (row?.id) {
      loading.value = true
      try {
        const result = await getMenu(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'type':
              formState[key] = result[key] ?? 1
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
    nextTick(() => {
      clearValidate(['path'])
    })
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
      <a-form-item v-bind="register('parentId')" label="上级菜单">
        <a-tree-select
          v-model:value="formState.parentId"
          show-search
          :tree-default-expanded-keys="[0]"
          :tree-data="state.menusList"
          :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
          placeholder="请选择上级菜单"
          tree-node-filter-prop="label"
        />
      </a-form-item>
      <a-form-item v-bind="register('name')" label="菜单名称">
        <a-input v-model:value="formState.name" placeholder="请输入菜单名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('type')" label="菜单类型" required>
        <a-radio-group
          v-model:value="formState.type"
          button-style="solid"
          option-type="button"
          :options="antOptionsValue(dict.system_menu_type.data)"
        />
      </a-form-item>
      <a-form-item v-if="formState.type && [1, 2].includes(formState.type)" v-bind="register('icon')" label="菜单图标">
        <a-input v-model:value="formState.icon" placeholder="请输入菜单图标" allow-clear />
      </a-form-item>
      <a-form-item v-if="formState.type && [1, 2].includes(formState.type)" v-bind="register('path')">
        <template #label>
          <span class="mr-4px">路由地址</span>
          <a-tooltip
            title="访问的路由地址，如：`user`，如外网地址需内链访问则以`http(s)://`开头"
            placement="top"
          >
            <question-circle-outlined />
          </a-tooltip>
        </template>
        <a-input
          v-model:value="formState.path"
          placeholder="请输入路由地址"
          allow-clear
        />
      </a-form-item>
      <a-form-item v-if="formState.type === 2 && !isHttpUrl(formState.path)" label="组件地址">
        <a-input
          v-model:value="formState.component"
          placeholder="请输入组件地址"
          allow-clear
        />
      </a-form-item>
      <a-form-item v-if="formState.type === 2 && isHttpUrl(formState.path)" label="外链类型">
        <a-radio-group
          v-model:value="formState.linkStatus"
          button-style="solid"
          option-type="button"
          :options="[
            { label: '系统外', value: 1 },
            { label: '系统内', value: 0 },
          ]"
        />
      </a-form-item>
      <a-form-item label="权限标识">
        <a-input v-model:value="formState.permission" placeholder="请输入权限标识" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('sort')" label="显示顺序">
        <a-input-number
          v-model:value="formState.sort"
          style="width: 100%"
          placeholder="请输入显示顺序"
          :min="0"
        />
      </a-form-item>
      <a-form-item v-if="formState.type === 2" v-bind="register('keepAlive')">
        <template #label>
          <span class="mr-4px">缓存状态</span>
          <a-tooltip title="选择缓存时，则会被 `keep-alive` 缓存，必须填写「组件名称」字段" placement="top">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
        <a-radio-group
          v-model:value="formState.keepAlive"
          button-style="solid"
          option-type="button"
          :options="[
            { label: '缓存', value: true },
            { label: '不缓存', value: false },
          ]"
        />
      </a-form-item>
      <a-form-item v-bind="register('status')">
        <template #label>
          <span class="mr-4px">菜单状态</span>
          <a-tooltip title="选择停用则路由将不会出现在侧边栏，也不能被访问" placement="top">
            <QuestionCircleOutlined />
          </a-tooltip>
        </template>
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
