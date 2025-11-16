import type { IDomEditor, IToolbarConfig } from '@wangeditor-next/editor'
import type { PropType } from 'vue'
import { createToolbar, DomEditor } from '@wangeditor-next/editor'
import { defineComponent, ref, watchEffect } from 'vue'

const Toolbar = defineComponent({
  props: {
    // editor 实例
    editor: {
      type: Object as PropType<IDomEditor>
    },
    /** 编辑器模式 */
    mode: {
      type: String as PropType<string>,
      default: 'default',
    },
    /** 编辑器默认配置 */
    defaultConfig: {
      type: Object as PropType<Partial<IToolbarConfig>>,
      default: {},
    },
  },
  setup(props) {
    // toolbar 容器
    const selector = ref(null)

    /**
     * 初始化 toolbar
     */
    const create = (editor: IDomEditor) => {
      if (!selector.value) return
      if (editor == null) {
        throw new Error('Not found instance of Editor when create <Toolbar/> component')
      }
      if (DomEditor.getToolbar(editor)) return // 不重复创建

      createToolbar({
        editor,
        selector: (selector.value! as Element) || '<div></div>',
        mode: props.mode,
        config: props.defaultConfig,
      })
    }

    watchEffect(() => {
      const { editor } = props
      if (editor == null) return
      create(editor) // 初始化 toolbar
    })

    return () => {
      return <div ref={selector}></div>
    }
  }
})

export default Toolbar
