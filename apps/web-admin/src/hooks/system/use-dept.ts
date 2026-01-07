import type { SystemDeptApi } from '@/services/system/dept'
import { getLevelData, treeData } from '@gx-design-vue/pro-utils'
import { useThrottleFn } from '@vueuse/core'
import { ref } from 'vue'
import { getSimpleDeptList } from '@/services/system/dept'
import { treeAntDataNode } from '@/utils/util'

export function useDept(props?: {
  init?: boolean;
  onSuccess?: (data: SystemDeptApi.Dept[]) => void;
}) {
  const depts = ref<SystemDeptApi.Dept[]>([])
  const deptTrees = ref<DeptTreeData[]>([])

  const deptLevels = computed<DeptTreeData[]>(() => getLevelData(deptTrees.value))

  const throttledGetSimpleDeptList = useThrottleFn(async () => {
    try {
      const data = await getSimpleDeptList()
      depts.value = data || []

      const treeList = treeData(data || [], {
        emptyChildren: false,
        children: 'children'
      })

      deptTrees.value = treeAntDataNode<SystemDeptApi.Dept, DeptTreeData>(treeList, {
        label: 'name'
      })

      if (props?.onSuccess) props.onSuccess(data)
    } catch {}
  }, 500)

  if (props?.init !== false) {
    throttledGetSimpleDeptList()
  }

  return {
    get: throttledGetSimpleDeptList,
    depts,
    deptTrees,
    deptLevels,
  }
}
