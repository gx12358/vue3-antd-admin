import type { EditorEvent, RawEditorOptions, Editor as TinyMCEEditor } from 'tinymce'
import type { Ref } from 'vue'
import { onMountedOrActivated } from '@gx-design-vue/pro-hooks'
import { getPrefixCls } from '@gx-design-vue/pro-utils'
import {
  defineComponent,
  h,
  nextTick,
  onBeforeUnmount,
  onDeactivated,
  ref,
  toRefs,
  watch
} from 'vue'
import { editorProps } from './props'
import { getTinymce, initEditor, isTextarea, mergePlugins, uuid } from './utils/utils'

import './style.less'

const renderInline = (ce: any, id: string, elementRef: Ref<Element | null>, tagName?: string) =>
  ce(tagName || 'div', {
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
  name: 'GEditor',
  props: editorProps,
  setup: (props, ctx) => {
    const baseClassName = getPrefixCls({
      suffixCls: 'editor',
      isPor: true
    })
    let conf = props.init ? { ...(props.init || {}) as RawEditorOptions } : {}
    const { disabled, modelValue, tagName } = toRefs(props)
    const element: Ref<Element | null> = ref(null)
    let vueEditor: any = null
    const elementId: string = props.id || uuid('tiny-vue')
    const inlineEditor = (props.init && (props.init as RawEditorOptions)?.inline) || props.inline
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
        plugins: mergePlugins(conf.plugins as any, props.plugins),
        toolbar: props.toolbar || conf.toolbar,
        inline: !!inlineEditor,
        setup: (editor: TinyMCEEditor) => {
          vueEditor = editor
          editor.on('init', (e: EditorEvent<any>) =>
            initEditor(e, props, ctx, editor, modelValue, content)
          )
          if (typeof conf.setup === 'function') {
            conf.setup(editor)
          }
        }
      } as RawEditorOptions
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
    const rerender = (init: RawEditorOptions) => {
      cache = vueEditor.getContent()
      getTinymce()?.remove(vueEditor)
      conf = { ...conf, ...init }
      nextTick(() => initWrapper())
    }

    ctx.expose({
      rerender,
      getEditor: () => vueEditor,
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
