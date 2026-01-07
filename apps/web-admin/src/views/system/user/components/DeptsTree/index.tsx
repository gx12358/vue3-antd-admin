import type { PropType } from 'vue'
import { SearchOutlined } from '@ant-design/icons-vue'
import { classNames, cloneDeep, getLevelData } from '@gx-design-vue/pro-utils'
import { GScrollbars } from '@gx-design-vue/scrollbar'
import { refThrottled } from '@vueuse/core'
import { Input, Tree } from 'ant-design-vue'
import { defineComponent } from 'vue'

const DeptsTree = defineComponent({
  name: 'DeptsTree',
  props: {
    class: {
      type: String as PropType<string>,
      default: ''
    },
    treeData: {
      type: Array as PropType<DeptTreeData[]>,
      default: () => []
    },
    levelData: {
      type: Array as PropType<DeptTreeData[]>,
    },
    onSelect: {
      type: Function as PropType<(key: number) => void>
    }
  },
  emits: [ 'select' ],
  setup(props) {
    const inputValue = shallowRef<string>('')
    const searchValue = refThrottled(inputValue, 200)
    const autoExpandParent = ref<boolean>(true)
    const selectedDepts = ref<number[]>([])
    const levelData = ref(props.levelData || [])
    const expandedKeys = ref<number[]>(props.levelData?.map(item => item.key) || [])

    watch([
      () => props.levelData,
      () => props.treeData
    ], () => {
      if (props.levelData) {
        levelData.value = props.levelData
      } else {
        levelData.value = getLevelData(props.treeData)
      }
      expandedKeys.value = levelData.value.map(item => item.key)
    }, { deep: true })

    const getParentKey = (
      key: number,
      tree: DeptTreeData[]
    ): number | undefined => {
      let parentKey
      for (let i = 0; i < tree.length; i++) {
        const node = tree[i]
        if (node.children) {
          if (node.children.some(item => item.key === key)) {
            parentKey = node.key
          } else if (getParentKey(key, node.children)) {
            parentKey = getParentKey(key, node.children)
          }
        }
      }
      return parentKey
    }

    const onExpand = (keys: any[]) => {
      expandedKeys.value = keys
      autoExpandParent.value = false
    }

    watch(searchValue, (value) => {
      const expanded = levelData.value
        .map((item) => {
          if (item.title.includes(value)) {
            return getParentKey(item.key, levelData.value)
          }
          return null
        })
        .filter((item, i, self) => item && self.indexOf(item) === i)
      expandedKeys.value = expanded as number[]
      searchValue.value = value
      autoExpandParent.value = true
    })

    const renderTitle = (strTitle: string, key: string) => {
      const index = strTitle.indexOf(searchValue.value)
      const beforeStr = strTitle.substring(0, index)
      const afterStr = strTitle.slice(index + searchValue.value.length)

      const title = index > -1 && searchValue.value
        ? (
          <span key={key}>
            {beforeStr}
            <span class="text-error">{searchValue.value}</span>
            {afterStr}
          </span>
        )
        : <span key={key}>{strTitle}</span>

      return title
    }

    return () => {
      if (props.treeData?.length) {
        return (
          <div class={classNames('flex flex-col h-full', props.class)}>
            <Input
              class="mb-8px"
              value={inputValue.value}
              placeholder="请输入部门名称"
              prefix={<SearchOutlined />}
              onChange={e => inputValue.value = e.target.value as string}
            />
            <GScrollbars style={{ width: '100%', flex: 1 }}>
              <Tree
                blockNode
                defaultExpandAll
                autoExpandParent={autoExpandParent.value}
                expandedKeys={expandedKeys.value}
                selectedKeys={selectedDepts.value}
                treeData={props.treeData as any}
                onExpand={onExpand}
                onSelect={(keys, { selected }) => {
                  if (selected) {
                    selectedDepts.value = cloneDeep(keys as number[])

                    props.onSelect?.(selectedDepts.value[0])
                  }
                }}
                v-slots={{
                  title: ({ title, key }) => {
                    return renderTitle(title, key)
                  }
                }}
              />
            </GScrollbars>
          </div>
        )
      }

      return null
    }
  }
})

export default DeptsTree
