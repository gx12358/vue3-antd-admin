import type { EditorEvent, Editor as TinyMCEEditor } from 'tinymce'
import type { Ref, SetupContext } from 'vue'
import type { IPropTypes } from '../props'
import { watch } from 'vue'

const getGlobal = (): any => (typeof window !== 'undefined' ? window : globalThis)

const validEvents = [
  'onActivate',
  'onAddUndo',
  'onBeforeAddUndo',
  'onBeforeExecCommand',
  'onBeforeGetContent',
  'onBeforeRenderUI',
  'onBeforeSetContent',
  'onBeforePaste',
  'onBlur',
  'onChange',
  'onClearUndos',
  'onClick',
  'onContextMenu',
  'onCopy',
  'onCut',
  'onDblclick',
  'onDeactivate',
  'onDirty',
  'onDrag',
  'onDragDrop',
  'onDragEnd',
  'onDragGesture',
  'onDragOver',
  'onDrop',
  'onExecCommand',
  'onFocus',
  'onFocusIn',
  'onFocusOut',
  'onGetContent',
  'onHide',
  'onInit',
  'onKeyDown',
  'onKeyPress',
  'onKeyUp',
  'onLoadContent',
  'onMouseDown',
  'onMouseEnter',
  'onMouseLeave',
  'onMouseMove',
  'onMouseOut',
  'onMouseOver',
  'onMouseUp',
  'onNodeChange',
  'onObjectResizeStart',
  'onObjectResized',
  'onObjectSelected',
  'onPaste',
  'onPostProcess',
  'onPostRender',
  'onPreProcess',
  'onProgressState',
  'onRedo',
  'onRemove',
  'onReset',
  'onSaveContent',
  'onSelectionChange',
  'onSetAttrib',
  'onSetContent',
  'onShow',
  'onSubmit',
  'onUndo',
  'onVisualAid'
]

const isValidKey = (key: string) =>
  validEvents.map(event => event.toLowerCase()).includes(key.toLowerCase())

const bindHandlers = (initEvent: EditorEvent<any>, listeners: any, editor: TinyMCEEditor): void => {
  Object.keys(listeners)
    .filter(isValidKey)
    .forEach((key: string) => {
      const handler = listeners[key]
      if (typeof handler === 'function') {
        if (key === 'onInit') {
          handler(initEvent, editor)
        } else {
          editor.on(key.substring(2), (e: EditorEvent<any>) => handler(e, editor))
        }
      }
    })
}

const bindModelHandlers = (
  props: IPropTypes,
  ctx: SetupContext,
  editor: TinyMCEEditor,
  modelValue: Ref<any>
) => {
  const modelEvents = props.modelEvents ? props.modelEvents : null
  const normalizedEvents = Array.isArray(modelEvents) ? modelEvents.join(' ') : modelEvents

  watch(modelValue, (val: string, prevVal: string) => {
    if (editor && typeof val === 'string' && val !== prevVal && val !== (editor as any).getContent({ format: props.outputFormat })) {
      editor.setContent(val)
    }
  })

  editor.on(normalizedEvents || 'change input undo redo', () => {
    ctx.emit('update:modelValue', (editor as any).getContent({ format: props.outputFormat }))
  })
}

const initEditor = (
  initEvent: EditorEvent<any>,
  props: IPropTypes,
  ctx: SetupContext,
  editor: TinyMCEEditor,
  modelValue: Ref,
  content: () => string
) => {
  editor.setContent(content())
  if (ctx.attrs['onUpdate:modelValue']) {
    bindModelHandlers(props, ctx, editor, modelValue)
  }
  bindHandlers(initEvent, ctx.attrs, editor)
}

let unique = 0

const uuid = (prefix: string): string => {
  const time = Date.now()
  const random = Math.floor(Math.random() * 1000000000)

  unique++

  return prefix + '_' + random + unique + String(time)
}

const isTextarea = (element: Element | null): element is HTMLTextAreaElement =>
  element !== null && element.tagName.toLowerCase() === 'textarea'

const normalizePluginArray = (plugins?: string | string[]): string[] => {
  if (typeof plugins === 'undefined' || plugins === '') {
    return []
  }

  return Array.isArray(plugins) ? plugins : plugins.split(' ')
}

const mergePlugins = (initPlugins: string | string[], inputPlugins?: string | string[]) =>
  normalizePluginArray(initPlugins).concat(normalizePluginArray(inputPlugins))

const getTinymce = () => {
  const global = getGlobal()

  return global && global.tinymce ? global.tinymce : null
}

const isNullOrUndefined = (value: any): value is null | undefined =>
  value === null || value === undefined

export {
  bindHandlers,
  bindModelHandlers,
  getTinymce,
  initEditor,
  isNullOrUndefined,
  isTextarea,
  isValidKey,
  mergePlugins,
  uuid
}
