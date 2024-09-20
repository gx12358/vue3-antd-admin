import type { FunctionalComponent as FC } from 'vue'
import { LoadingOutlined } from '@ant-design/icons-vue'
import { Spin } from 'ant-design-vue'

const UploadLoading: FC<{
  loadingText?: string
}> = ({ loadingText }) => {
  return (
    <Spin
      tip={loadingText || '正在准备中...'}
      indicator={<LoadingOutlined style={{ fontSize: '14px' }} spin />}
    />
  )
}

UploadLoading.inheritAttrs = false

export default UploadLoading
