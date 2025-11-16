import type { IDomEditor, IEditorConfig, IToolbarConfig } from '@wangeditor-next/editor'
import type { PropType } from 'vue'
import { unit } from '@gx-design-vue/pro-provider'
import { deepMerge, getRandomNumber } from '@gx-design-vue/pro-utils'
import { defineComponent, onBeforeUnmount, ref, shallowRef, watch } from 'vue'
import Editor from './components/Editor'
import Toolbar from './components/Toolbar'
import '@wangeditor-next/editor/dist/css/style.css'

const GProEditor = defineComponent({
  props: {
    height: {
      type: [ String, Number ] as PropType<string | number>,
      default: 400
    },
    value: {
      type: String as PropType<string>,
      default: ''
    },
    toolbarConfig: {
      type: Object as PropType<Partial<IToolbarConfig>>,
      default: () => ({})
    },
    editorConfig: {
      type: Object as PropType<Partial<IEditorConfig>>,
      default: () => ({
        placeholder: '请输入内容...'
      })
    },
    onChange: {
      type: Function as PropType<(val: string) => void>,
      default: () => {}
    },
    'onUpdate:value': Function as PropType<(val: string) => void>,
  },
  setup(props) {
    const toolbarKey = ref(getRandomNumber().uuid(4))
    const editorRef = shallowRef<IDomEditor>()

    // 内容 HTML
    const valueHtml = ref(props.value)
    const toolbarConfig = ref<Partial<IToolbarConfig>>({})

    watch(() => props.value, (value) => {
      if (value !== valueHtml.value) {
        valueHtml.value = value
      }
    })

    watch(() => props.toolbarConfig, (value) => {
      toolbarConfig.value = deepMerge(toolbarConfig.value, value, {
        omitNil: true,
        omitEmpty: true
      })
      toolbarKey.value = getRandomNumber().uuid(4)
    }, { deep: true })

    // 组件销毁时，也及时销毁编辑器，重要！
    onBeforeUnmount(() => {
      const editor = editorRef.value
      if (editor == null) return

      editor.destroy()
    })

    return () => {
      return (
        <div style={{ border: '1px solid #ccc' }}>
          <Toolbar key={toolbarKey.value} editor={editorRef.value} defaultConfig={toolbarConfig.value} style={{ borderBottom: '1px solid #ccc' }} />
          <Editor
            style={{ height: unit(props.height) }}
            defaultConfig={props.editorConfig}
            value={valueHtml.value}
            onChange={(editor: IDomEditor) => {
              valueHtml.value = editor.getHtml()
            }}
            onCreated={(editor: IDomEditor) => {
              editorRef.value = editor // 记录 editor 实例，重要！
            }}
          />
        </div>
      )
    }
  }
})

export default GProEditor
