<script setup lang="ts">
import type { ProModalProps } from '@gx-design-vue/pro-modal'
import type { SystemTenantPackageApi } from '@/services/system/tenant-package'
import { SearchOutlined } from '@ant-design/icons-vue'
import {
  cloneDeep,
  forInObject,
  handleEmptyField,
  isArray,
  treeData
} from '@gx-design-vue/pro-utils'
import { useRequest } from '@gx/hooks'
import { message } from 'ant-design-vue'
import { h, reactive } from 'vue'
import { z } from 'zod'
import { useForm, useModalState } from '@/hooks/state'
import { getMenuList } from '@/services/system/menu'
import { createTenantPackage, getTenantPackage, updateTenantPackage } from '@/services/system/tenant-package'
import { antOptionsValue, buildTreeMaps, cleanInvalidParents, fillParentKeys, treeAntDataNode } from '@/utils/util'

const emits = defineEmits<{
  (e: 'ok'): void
}>()

const { dict } = useStore()

const { state, resetState } = useModalState({
  title: '租户',
  type: 'add' as 'add' | 'edit',
  expand: false,
  selectAll: false,
  searchValue: '',
  autoExpandParent: false,
  expandedKeys: [] as number[],
  menusTreeMap: null as Map<number, number[]> | null,
  levelMenus: [] as SystemMenuItem[],
})

const { run, data: menuList } = useRequest<AntDataNode[], any, SystemMenuItem[]>(
  getMenuList,
  {
    defaultData: [],
    manual: true,
    onSuccess: (data) => {
      state.levelMenus = cloneDeep(data)
      const antTrees = treeAntDataNode<SystemMenuItem, AntDataNode>(
        treeData(cloneDeep(data || []), {
          emptyChildren: false,
          children: 'children'
        }),
        {
          label: 'name'
        }
      )
      state.menusTreeMap = buildTreeMaps(antTrees)
      return antTrees
    }
  }
)

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
} = useForm<SystemTenantPackageApi.UpdateTenantPackageTable>({
  values: {
    id: undefined,
    name: '',
    menuIds: [],
    status: 0,
    remark: ''
  },
  dependencies: {
    name: {
      zod: z.string().min(1, { message: '请输入租户名称' })
    },
    menuIds: {
      zod: z
        .array(
          z.number({ message: '请选择正确的菜单' })
        )
        .optional(),
    },
    status: {
      zod: z.number({ message: '请选择租户状态' })
    },
  },
})

const title = computed(() => {
  return `${state.type === 'add' ? '新增' : '编辑'}${state.title}`
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
  const expanded = state.levelMenus
    .map((item) => {
      if (item.name.includes(value)) {
        return getParentKey(item.id as number, menuList.value)
      }
      return null
    })
    .filter((item, i, self) => item && self.indexOf(item) === i)
  if (expanded.length && value) {
    state.expandedKeys = expanded as number[]
    state.autoExpandParent = true
  }
})

const onCheckAll = (e: ChangeEvent<HTMLInputElement>) => {
  const checked = e.target.checked
  formState.menuIds = checked ? state.levelMenus.map(item => item.id as number) : []
}

const onCheck = (keys) => {
  formState.menuIds = isArray(keys) ? keys : keys.checked
}

const onExpand = (keys: any[]) => {
  state.expandedKeys = keys
  state.autoExpandParent = false
}

const onExpandAll = (e: ChangeEvent<HTMLInputElement>) => {
  const checked = e.target.checked
  state.expandedKeys = checked ? state.levelMenus.map(item => item.id as number) : []
}

async function onOk(values: SystemTenantPackageApi.UpdateTenantPackageTable) {
  // 提交表单
  try {
    loading.value = true
    values.menuIds = Array.from(fillParentKeys(
      new Set(values.menuIds),
      menuList.value,
      state.menusTreeMap as Map<number, number[]>
    ))
    await (values.id ? updateTenantPackage(values) : createTenantPackage(values))
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
  open: async (row?: SystemTenantPackageApi.TenantPackageTable) => {
    modalState.open = true
    state.type = row?.id ? 'edit' : 'add'
    await run()
    if (row) {
      loading.value = true
      try {
        const result = await getTenantPackage(row.id)
        forInObject(formState, (key) => {
          switch (key) {
            case 'status':
              formState[key] = result[key] ?? 0
              break
            case 'menuIds':
              formState[key] = result[key] || []
              break
            default:
              formState[key] = handleEmptyField(result[key], '').value
              break
          }
        })
        if (state.menusTreeMap) {
          formState.menuIds = Array.from(cleanInvalidParents(
            new Set(formState.menuIds),
            menuList.value,
            state.menusTreeMap
          ))
        }
        state.selectAll = formState.menuIds.length === state.levelMenus.length
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
      <a-form-item v-bind="register('name')" label="套餐名称">
        <a-input v-model:value="formState.name" placeholder="请输入套餐名称" allow-clear />
      </a-form-item>
      <a-form-item v-bind="register('menuIds')" label="菜单权限">
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
              <a-input v-model:value="state.searchValue" placeholder="请输入菜单名称" :prefix="h(SearchOutlined)" />
            </div>
            <a-tree
              v-model:expanded-keys="state.expandedKeys"
              :auto-expand-parent="state.autoExpandParent"
              :checked-keys="formState.menuIds"
              block-node
              checkable
              :tree-data="menuList"
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
      <a-form-item v-bind="register('status')" label="状态">
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
