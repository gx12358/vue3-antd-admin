import type { Ref } from 'vue'
import {
  h,
  defineComponent,
  ref,
  toRefs,
  nextTick,
  watch,
  onBeforeUnmount,
  onDeactivated
} from 'vue'
import type { RawEditorSettings } from 'tinymce'
import { Editor as TinyMCEEditor, EditorEvent } from 'tinymce'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { editorProps } from './props'
import { isTextarea, mergePlugins, uuid, initEditor, getTinymce } from './utils/utils'

import './style.less'

const renderInline = (ce: any, id: string, elementRef: Ref<Element | null>, tagName?: string) =>
  ce(tagName ? tagName : 'div', {
    id,
    ref: elementRef
  })

const renderIframe = (ce: any, id: string, elementRef: Ref<Element | null>) =>
  ce('textarea', {
    id,
    style: {
      opacity: 0
    },
    visibility: 'hidden',
    ref: elementRef
  })

const Editor = defineComponent({
  props: editorProps,
  setup: (props, ctx) => {
    const baseClassName = getPrefixCls({
      suffixCls: 'editor',
      isPor: true
    })
    let conf = props.init ? { ...(props.init || {}) as RawEditorSettings } : {}
    const { disabled, modelValue, tagName } = toRefs(props)
    const element: Ref<Element | null> = ref(null)
    let vueEditor: any = null
    const elementId: string = props.id || uuid('tiny-vue')
    const inlineEditor: boolean = (props.init && (props.init as RawEditorSettings)?.inline) || props.inline
    const modelBind = !!ctx.attrs['onUpdate:modelValue']
    let mounting = true
    const initialValue: string = props.initialValue ? props.initialValue : ''
    let cache = ''

    const getContent = (isMounting: boolean): (() => string) =>
      modelBind
        ? () => (modelValue?.value ? modelValue.value : '')
        : () => (isMounting ? initialValue : cache)

    const initWrapper = (): void => {
      const content = getContent(mounting)
      const finalInit = {
        ...conf,
        language: 'zh_CN',
        branding: false,
        readonly: props.disabled,
        selector: `#${elementId}`,
        plugins: mergePlugins(conf.plugins, props.plugins),
        toolbar: props.toolbar || conf.toolbar,
        inline: inlineEditor,
        setup: (editor: TinyMCEEditor) => {
          vueEditor = editor
          editor.on('init', (e: EditorEvent<any>) =>
            initEditor(e, props, ctx, editor, modelValue, content)
          )
          if (typeof conf.setup === 'function') {
            conf.setup(editor)
          }
        }
      }
      if (isTextarea(element.value)) {
        element.value.style.visibility = ''
      }
      getTinymce().init(finalInit)
      mounting = false
    }
    watch(disabled, (disable) => {
      if (vueEditor !== null) {
        vueEditor.setMode(disable ? 'readonly' : 'design')
      }
    })
    watch(tagName, (_) => {
      if (!modelBind) {
        cache = vueEditor.getContent()
      }
      getTinymce()?.remove(vueEditor)
      nextTick(() => initWrapper())
    })
    onBeforeUnmount(() => {
      if (getTinymce() !== null) {
        getTinymce().remove(vueEditor)
      }
    })
    if (!inlineEditor) {
      onMountedOrActivated(() => {
        if (!mounting) {
          initWrapper()
        } else if (getTinymce() !== null) {
          initWrapper()
        }
      })
      onDeactivated(() => {
        if (!modelBind) {
          cache = vueEditor.getContent()
        }
        getTinymce()?.remove(vueEditor)
      })
    }
    const rerender = (init: RawEditorSettings) => {
      cache = vueEditor.getContent()
      getTinymce()?.remove(vueEditor)
      conf = { ...conf, ...init }
      nextTick(() => initWrapper())
    }

    ctx.expose({
      rerender
    })
    return () => (
      <div class={baseClassName}>
        {inlineEditor
          ? renderInline(h, elementId, element, props.tagName)
          : renderIframe(h, elementId, element)}
      </div>
    )
  }
})

export default Editor
