import type { IDomEditor, IEditorConfig, SlateDescendant } from '@wangeditor-next/editor'
import type { PropType } from 'vue'
import { createEditor } from '@wangeditor-next/editor'
import { defineComponent, onMounted, ref, shallowRef, toRaw, watch } from 'vue'
import { genErrorInfo } from '../utils/create-info'

type ExtractPropertyType<T, K extends keyof T> = T[K]

const Editor = defineComponent({
  props: {
    mode: {
      type: String as PropType<string>,
      default: 'default',
    },
    /** 编辑器默认内容 */
    defaultContent: {
      type: Array as PropType<SlateDescendant[]>,
      default: [],
    },
    defaultHtml: {
      type: String as PropType<string>,
      default: '',
    },
    /** 编辑器默认配置 */
    defaultConfig: {
      type: Object as PropType<Partial<IEditorConfig>>,
      default: {},
    },
    /* 自定义 v-model */
    value: {
      type: String as PropType<string>,
      default: '',
    },
    'onUpdate:value': {
      type: Function as PropType<(val: string) => void>,
      default: () => {},
    },
    onCreated: Function as PropType<(editor: IDomEditor) => void>,
    onChange: Function as PropType<(editor: IDomEditor) => void>,
    onDestroyed: Function as PropType<(editor: IDomEditor) => void>,
    onMaxLength: Function as PropType<(editor: IDomEditor) => void>,
    onFocus: Function as PropType<(editor: IDomEditor) => void>,
    onBlur: Function as PropType<(editor: IDomEditor) => void>,
    onCustomAlert: Function as PropType<ExtractPropertyType<IEditorConfig, 'customAlert'>>,
    onCustomPaste: Function as PropType<(editor: IDomEditor, event: ClipboardEvent, cb: (v: boolean) => void) => void>,
  },
  emits: {
    'update:value': (_val: string) => true,
    created: (_editor: IDomEditor) => true,
    change: (_editor: IDomEditor) => true,
    destroyed: (_editor: IDomEditor) => true,
    maxLength: (_editor: IDomEditor) => true,
    focus: (_editor: IDomEditor) => true,
    blur: (_editor: IDomEditor) => true,
    customAlert: (() => true) as ExtractPropertyType<IEditorConfig, 'customAlert'>,
    customPaste: (_editor: IDomEditor, _event: ClipboardEvent, _cb: (v: boolean) => void) => true,
  },
  setup(props, { emit }) {
    const box = ref(null) // 编辑器容器

    const editorRef = shallowRef<null | IDomEditor>(null) // editor 实例，必须用 shallowRef

    const curValue = ref('') // 记录 editor 当前 html 内容

    /**
     * 初始化编辑器
     */
    const initEditor = () => {
      if (!box.value) return
      // 获取原始数据，解除响应式特性
      const defaultContent = toRaw(props.defaultContent)

      createEditor({
        selector: box.value! as Element,
        mode: props.mode,
        content: defaultContent || [],
        html: props.defaultHtml || props.value || '',
        config: {
          ...props.defaultConfig,
          onCreated(editor: IDomEditor) {
            editorRef.value = editor // 记录 editor 实例

            emit('created', editor)

            if (props.defaultConfig.onCreated) {
              const info = genErrorInfo('onCreated')
              throw new Error(info)
            }
          },
          onChange(editor: IDomEditor) {
            const editorHtml = editor.getHtml()
            curValue.value = editorHtml // 记录当前内容
            emit('update:value', editorHtml) // 触发 v-model 值变化

            emit('change', editor)
            if (props.defaultConfig.onChange) {
              const info = genErrorInfo('onChange')
              throw new Error(info)
            }
          },
          onDestroyed(editor: IDomEditor) {
            emit('destroyed', editor)
            if (props.defaultConfig.onDestroyed) {
              const info = genErrorInfo('onDestroyed')
              throw new Error(info)
            }
          },
          onMaxLength(editor: IDomEditor) {
            emit('maxLength', editor)
            if (props.defaultConfig.onMaxLength) {
              const info = genErrorInfo('onMaxLength')
              throw new Error(info)
            }
          },
          onFocus(editor: IDomEditor) {
            emit('focus', editor)
            if (props.defaultConfig.onFocus) {
              const info = genErrorInfo('onFocus')
              throw new Error(info)
            }
          },
          onBlur(editor: IDomEditor) {
            emit('blur', editor)
            if (props.defaultConfig.onBlur) {
              const info = genErrorInfo('onBlur')
              throw new Error(info)
            }
          },
          customAlert(info: any, type: any) {
            emit('customAlert', info, type)
            // @ts-ignore
            if (props.defaultConfig.customAlert) {
              const info = genErrorInfo('customAlert')
              throw new Error(info)
            }
          },
          customPaste: (editor: IDomEditor, event: ClipboardEvent): any => {
            if (props.defaultConfig.customPaste) {
              const info = genErrorInfo('customPaste')
              throw new Error(info)
            }
            let res
            emit('customPaste', editor, event, (val: boolean) => {
              res = val
            })
            return res
          },
        },
      })
    }

    /**
     * 设置 HTML
     * @param newHtml new html
     */
    function setHtml(newHtml: string) {
      const editor = editorRef.value
      if (editor == null) return
      editor.setHtml(newHtml)
    }

    /**
     * 元素挂在后初始化编辑器
     */
    onMounted(() => {
      initEditor()
    })

    // 监听 v-model 值变化
    watch(
      () => props.value,
      (newVal) => {
        if (newVal === curValue.value) return // 和当前内容一样，则忽略

        // 重新设置 HTML
        setHtml(newVal)
      }
    )

    return () => {
      return <div ref={box} style={{ height: '100%' }} />
    }
  }
})

export default Editor
