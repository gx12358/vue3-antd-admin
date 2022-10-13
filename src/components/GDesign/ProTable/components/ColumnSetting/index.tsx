import type { FunctionalComponent as FC, Ref } from 'vue'
import { ref, unref, renderSlot, defineComponent, computed, watchEffect } from 'vue'
import { Popover, Tooltip, Tree, Checkbox, Space } from 'ant-design-vue'
import type { DataNode } from 'ant-design-vue/lib/tree'
import {
  SettingOutlined,
  VerticalAlignTopOutlined,
  VerticalAlignMiddleOutlined,
  VerticalAlignBottomOutlined
} from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'
import { useRefFunction } from '@gx-design/utils/hooks/useRefFunction'
import { getRandomNumber } from '@/utils/util'
import { genColumnKey } from '../../utils'
import type { ProColumn } from '../../types/column'
import { useTableContext } from '../../context/TableContext'
import type { ColumnsState } from '../../hooks/useColumnSetting'

import './style.less'

export type ColumnSettingProps = {
  draggable?: boolean
  checkable?: boolean
  extra?: VueNode
  checkedReset?: boolean
}

const ToolTipIcon: FC<{
  title: string
  treeKey: string
  show: boolean
  fixed: 'left' | 'right' | undefined
}> = ({ title, show, treeKey, fixed }, { slots }) => {
  const { cacheColumns, settingsAction } = useTableContext()

  if (!show) {
    return null
  }
  return (
    <Tooltip title={title}>
      <span
        onClick={(e) => {
          e.stopPropagation()
          e.preventDefault()
          const columnKey = unref(cacheColumns).find((item) => item.uuid === treeKey)?.key || ''
          const config = settingsAction?.columnsMap[columnKey] || {}
          const disableIcon =
            typeof config.disable === 'boolean' ? config.disable : config.disable?.icon
          if (disableIcon) return
          const columnKeyMap = {
            ...settingsAction?.columnsMap,
            [columnKey]: { ...config, fixed } as ColumnsState
          }
          settingsAction?.setColumnsMap(columnKeyMap, 'fixed')
        }}
      >
        {slots?.default()}
      </span>
    </Tooltip>
  )
}

const CheckboxListItem: FC<{
  treeKey: string
  className?: string
  title?: VueNode
  autoScroll?: Ref<boolean>
  fixed?: boolean | 'left' | 'right'
}> = ({ treeKey, title, className, fixed, autoScroll }) => {
  const { cacheColumns } = useTableContext()
  const columnKey = unref(cacheColumns).find((item) => item.uuid === treeKey)?.key || ''

  const actionStatus = computed(() => columnKey === 'action' && autoScroll.value)

  const dom = (
    <span class={`${className}-list-item-option`}>
      <ToolTipIcon
        treeKey={treeKey}
        fixed="left"
        title="固定在列首"
        show={fixed !== 'left' && !actionStatus.value}
      >
        <VerticalAlignTopOutlined />
      </ToolTipIcon>
      <ToolTipIcon
        treeKey={treeKey}
        fixed={undefined}
        title="不固定"
        show={!!fixed && !actionStatus.value}
      >
        <VerticalAlignMiddleOutlined />
      </ToolTipIcon>
      <ToolTipIcon treeKey={treeKey} fixed="right" title="固定在列尾" show={fixed !== 'right'}>
        <VerticalAlignBottomOutlined />
      </ToolTipIcon>
    </span>
  )
  return (
    <span class={`${className}-list-item`} key={treeKey}>
      <div class={`${className}-list-item-title`}>{title}</div>
      {dom}
    </span>
  )
}

const CheckboxList = defineComponent({
  props: {
    list: Array as PropType<ProColumn[]>,
    keys: Array as PropType<(string | number)[]>,
    className: String as PropType<string>,
    title: String as PropType<string>,
    checkable: Boolean as PropType<boolean>,
    draggable: Boolean as PropType<boolean>,
    showTitle: {
      type: Boolean as PropType<boolean>,
      default: true
    }
  },
  setup(props) {
    const treeKey: Ref<string> = ref(getRandomNumber().uuid(15))
    const show = computed(() => props.list && props.list.length > 0)
    const treeData: Ref<DataNode[]> = ref([])
    const checkedKeys: Ref<(string | number)[]> = ref([])

    const { cacheColumns, slots, settingsAction } = useTableContext()

    const loopData = (data: any[], parentConfig?: ColumnsState): DataNode[] =>
      data.map(({ key, dataIndex, children, uuid, ...rest }) => {
        const config = settingsAction?.columnsMap[key || 'null'] || { show: true }
        let checked = false
        if (config.show !== false && parentConfig?.show !== false && !children) checked = true
        const item: DataNode = {
          key: uuid,
          ...rest,
          checked,
          selectable: false,
          disabled: config.disable === true,
          disableCheckbox:
            typeof config.disable === 'boolean' ? config.disable : config.disable?.checkbox,
          isLeaf: true
        }
        if (children) {
          item.children = loopData(children, config)
        }
        return item
      })

    watchEffect(() => {
      const treeList = loopData(props.list)
      treeData.value = treeList
      checkedKeys.value = treeList.filter((item) => item.checked).map((item) => item.key)
      // 此举解决Ant-design-Tree 报错 Tree missing follow keys: ...
      if (settingsAction?.operationType.value === 'fixed') {
        treeKey.value = getRandomNumber().uuid(15)
      }
    })

    /** 移动到指定的位置 */
    const move = useRefFunction((id: Key, targetId: Key, dropPosition: number) => {
      const key = unref(cacheColumns).find((item) => item.uuid === id)?.key || ''
      const targetKey = unref(cacheColumns).find((item) => item.uuid === targetId)?.key || ''
      const newMap = { ...settingsAction?.columnsMap }
      const newColumns = [...settingsAction.sortKeyColumns.value]
      const findIndex = newColumns.findIndex((columnKey) => columnKey === key)
      const targetIndex = newColumns.findIndex((columnKey) => columnKey === targetKey)
      const isDownWord = dropPosition > findIndex
      if (findIndex < 0) {
        return
      }
      const targetItem = newColumns[findIndex]
      newColumns.splice(findIndex, 1)
      if (dropPosition === 0) {
        newColumns.unshift(targetItem)
      } else {
        newColumns.splice(isDownWord ? targetIndex : targetIndex + 1, 0, targetItem)
      }
      // 重新生成排序数组
      newColumns.forEach((key, order) => {
        newMap[key] = { ...(newMap[key] || {}), order }
      })
      // 更新数组
      settingsAction?.setColumnsMap(newMap, 'drop')
      settingsAction?.setSortKeyColumns(newColumns)
    })

    /** 选中反选功能 */
    const onCheckTree = useRefFunction((e) => {
      const treeKey = e.node.key
      const columnKey = unref(cacheColumns).find((item) => item.uuid === treeKey)?.key || ''
      const tempConfig = settingsAction?.columnsMap[columnKey] || {}
      const newSetting = { ...tempConfig }
      newSetting.show = e.checked
      const columnKeyMap = {
        ...settingsAction?.columnsMap,
        [columnKey]: newSetting as ColumnsState
      }

      settingsAction?.setColumnsMap(columnKeyMap, 'show')
    })

    const treeTitleSlots = (record) => {
      const columnsItem: any = unref(cacheColumns).find((item) => item.uuid === record.key)
      return (
        record.title ||
        renderSlot(
          slots,
          'headerCell',
          {
            title: columnsItem.title,
            column: columnsItem
          },
          () => [columnsItem.title as any]
        )
      )
    }

    const listDom = () => (
      <Tree
        key={treeKey.value}
        draggable={props.draggable && !!treeData.value?.length && treeData.value?.length > 1}
        checkable={props.checkable}
        blockNode
        showLine={false}
        checkedKeys={checkedKeys.value}
        height={280}
        onDrop={(info) => {
          const dropKey = info.node.key
          const dragKey = info.dragNode.key
          const { dropPosition, dropToGap } = info
          const position = dropPosition === -1 || !dropToGap ? dropPosition + 1 : dropPosition
          move(dragKey, dropKey, position)
        }}
        onCheck={(_, e) => onCheckTree(e)}
        treeData={treeData.value}
        v-slots={{
          title: (_node) => {
            const node = {
              ..._node,
              children: undefined,
              title: treeTitleSlots(_node),
              autoScroll: settingsAction?.autoScroll
            }
            return <CheckboxListItem className={props.className} {...node} treeKey={node.key} />
          }
        }}
      />
    )

    return () => {
      if (!show.value) return null

      return (
        <>
          {props.showTitle && <span class={`${props.className}-list-title`}>{props.title}</span>}
          {listDom()}
        </>
      )
    }
  }
})

const GroupCheckboxList: FC<{
  localColumns: ProColumn[]
  className?: string
  draggable: boolean
  checkable: boolean
}> = ({ localColumns, className, draggable, checkable }) => {
  const rightList: ProColumn[] = []
  const leftList: ProColumn[] = []
  const list: ProColumn[] = []
  const checkedKeys: (string | number)[] = []

  localColumns.forEach((item) => {
    /** 不在 setting 中展示的 */
    if (item.hideInSetting) {
      return
    }
    const { fixed, show, uuid } = item
    if (show || show === undefined) {
      checkedKeys.push(uuid)
    }

    if (fixed === 'left') {
      leftList.push(item)
      return
    }
    if (fixed === 'right') {
      rightList.push(item)
      return
    }
    list.push(item)
  })

  const showRight = rightList && rightList.length > 0
  const showLeft = leftList && leftList.length > 0

  return (
    <div
      class={{
        [`${className}-list`]: true,
        [`${className}-list-group`]: showRight || showLeft
      }}
    >
      <CheckboxList
        title="固定在左侧"
        list={leftList}
        keys={checkedKeys}
        draggable={draggable}
        checkable={checkable}
        className={className}
      />
      {/* 如果没有任何固定，不需要显示title */}
      <CheckboxList
        list={list}
        keys={checkedKeys}
        draggable={draggable}
        checkable={checkable}
        title="不固定"
        showTitle={showLeft || showRight}
        className={className}
      />
      <CheckboxList
        title="固定在右侧"
        list={rightList}
        keys={checkedKeys}
        draggable={draggable}
        checkable={checkable}
        className={className}
      />
    </div>
  )
}

const ColumnSetting: FC<ColumnSettingProps> = (props) => {
  const { checkedReset = true } = props
  const className = getPrefixCls({
    suffixCls: 'table-column-setting',
    isPor: true
  })

  const { columns: localColumns, settingsAction } = useTableContext()

  /**
   * 设置全部选中，或全部未选中
   *
   * @param show
   */
  const setAllSelectAction = useRefFunction((show = true) => {
    const columnKeyMap = {}
    const loopColumns = (columns: any) => {
      columns.forEach(({ key, fixed, index, children }: any) => {
        const columnKey = genColumnKey(key, index)
        if (columnKey) {
          columnKeyMap[columnKey] = {
            show,
            fixed
          }
        }
        if (children) {
          loopColumns(children)
        }
      })
    }
    loopColumns(localColumns.value)
    settingsAction?.setColumnsMap(columnKeyMap, 'show')
  })

  /** 全选和反选 */
  const checkedAll = useRefFunction((e) => {
    if (e.target.checked) {
      setAllSelectAction()
    } else {
      setAllSelectAction(false)
    }
  })

  /** 重置项目 */
  const clearClick = useRefFunction(() => {
    settingsAction?.setColumnsMap(settingsAction?.cacheColumnsMap, 'fixed')
  })

  const unCheckedKeys = computed(() =>
    Object.values(settingsAction?.columnsMap).filter((value) => !value || value.show === false)
  )

  const indeterminate = computed(
    () =>
      unref(unCheckedKeys).length > 0 && unref(unCheckedKeys).length !== localColumns.value.length
  )

  return (
    <Popover
      arrowPointAtCenter
      title={
        <div class={`${className}-title`}>
          <Checkbox
            indeterminate={indeterminate.value}
            checked={
              unref(unCheckedKeys).length === 0 &&
              unref(unCheckedKeys).length !== localColumns.value.length
            }
            onChange={(e) => checkedAll(e)}
          >
            列展示
          </Checkbox>
          {checkedReset ? (
            <a onClick={clearClick} class={`${className}-action-rest-button`}>
              重置
            </a>
          ) : null}
          {props?.extra ? (
            <Space size={12} align="center">
              {props.extra}
            </Space>
          ) : null}
        </div>
      }
      overlayClassName={`${className}-overlay`}
      trigger="click"
      placement="bottomRight"
      content={
        <GroupCheckboxList
          checkable={props.checkable ?? true}
          draggable={props.draggable ?? true}
          className={className}
          localColumns={localColumns.value}
        />
      }
    >
      <Tooltip title="列设置">
        <SettingOutlined />
      </Tooltip>
    </Popover>
  )
}

export default ColumnSetting
