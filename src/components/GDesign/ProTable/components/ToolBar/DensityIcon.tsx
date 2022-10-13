import type { FunctionalComponent as FC } from 'vue'
import { Dropdown, Menu, Tooltip } from 'ant-design-vue'
import { ColumnHeightOutlined } from '@ant-design/icons-vue'
import type { SizeType } from '@gx-admin/utils'
import { useTableContext } from '../../context/TableContext'

const DensityIcon: FC = () => {
  const { action, tableSize } = useTableContext()

  return (
    <Dropdown
      overlay={
        <Menu
          selectedKeys={[tableSize.value as string]}
          onClick={({ key }) => {
            action.setTableSize?.(key as SizeType)
          }}
          style={{
            width: 80
          }}
        >
          <Menu.Item key="large">默认</Menu.Item>
          <Menu.Item key="middle">中等</Menu.Item>
          <Menu.Item key="small">紧凑</Menu.Item>
        </Menu>
      }
      trigger={['click']}
    >
      <Tooltip title="表格密度">
        <ColumnHeightOutlined />
      </Tooltip>
    </Dropdown>
  )
}

export default DensityIcon
