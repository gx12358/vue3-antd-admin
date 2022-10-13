import type { FunctionalComponent as FC } from 'vue'
import { useFullscreen } from '@vueuse/core'
import { Tooltip } from 'ant-design-vue'
import { FullscreenExitOutlined, FullscreenOutlined } from '@ant-design/icons-vue'

const FullScreenIcon: FC = () => {
  const { isFullscreen } = useFullscreen()

  return isFullscreen.value ? (
    <Tooltip title="退出全屏">
      <FullscreenExitOutlined />
    </Tooltip>
  ) : (
    <Tooltip title="全屏">
      <FullscreenOutlined />
    </Tooltip>
  )
}

export default FullScreenIcon
