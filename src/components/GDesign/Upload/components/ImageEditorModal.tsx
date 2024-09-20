import global from '@/common/global'
import { useState } from '@gx-design-vue/pro-hooks'
import { GProModal } from '@gx-design-vue/pro-modal'
import { isBase64 } from '@gx-design-vue/pro-utils'
import { defineComponent, reactive } from 'vue'

let filerobotImageEditor

const { TABS } = window.FilerobotImageEditor
const imageEditorId = 'gx-image-editor'

export default defineComponent({
  name: 'GImageEditorModal',
  inheritAttrs: false,
  emits: [ 'ok' ],
  setup(_, { emit, expose }) {
    const [ open, setOpen ] = useState(false)
    const [ spinning, changeSpinning ] = useState(false)
    const [ spinningTip, changeSpinningTip ] = useState('初始化中')

    const state = reactive({
      backstate: null
    })

    const renderFileBotEditor = (url: string) => {
      filerobotImageEditor = new FilerobotImageEditor(document.querySelector(`#${imageEditorId}`), {
        ...global.editorConfig,
        tabsIds: Object.keys(TABS).map(key => TABS[key]).filter(name => name !== 'Watermark'),
        source: url,
        defaultSavedImageType: state.backstate?.suffix || 'png'
      })
      filerobotImageEditor.render({
        onSave: () => {
          return new Promise<void>((resolve) => {
            resolve()
          })
        }
      })
    }

    const clearFileBotEditor = () => {
      if (filerobotImageEditor)
        filerobotImageEditor.terminate()
      filerobotImageEditor = null
      window.editorConfig = {}
      window.editorConfig.isFirstRenderCropUpdated = false
    }

    const handleCancel = () => {
      setOpen(false)
      changeSpinning(false)
      changeSpinningTip('初始化中...')
      setTimeout(() => clearFileBotEditor(), 250)
    }

    const handleOk = () => {
      changeSpinning(true)
      changeSpinningTip('正在截取中...')
      const { imageData } = filerobotImageEditor.getCurrentImgData()
      if (imageData.imageBase64 && isBase64(imageData.imageBase64)) {
        emit('ok', imageData.imageBase64, { ...state.backstate })
        handleCancel()
      } else {
        changeSpinning(false)
        changeSpinningTip('')
      }
    }

    expose({
      openModal: (url: string, params?: any) => {
        setOpen(true)
        changeSpinning(true)
        state.backstate = params

        nextTick(() => {
          renderFileBotEditor(url)

          changeSpinning(false)
        })
      }
    })

    return () => {
      return (
        <GProModal
          title="图片剪裁"
          width={782}
          open={open.value}
          spinning={spinning.value}
          spinningTip={spinningTip.value}
          type="normal"
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <div id={imageEditorId} class="w-full" />
        </GProModal>
      )
    }
  }
})
