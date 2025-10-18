import type { RawEditorOptions } from 'tinymce'
import type { ExtractPropTypes } from 'vue'

export const editorProps = {
  apiKey: String as PropType<string>,
  cloudChannel: String as PropType<string>,
  id: String as PropType<string>,
  init: Object as PropType<RawEditorOptions>,
  initialValue: String as PropType<string>,
  inline: Boolean as PropType<boolean>,
  modelEvents: [ String, Array ] as PropType<string | string[]>,
  plugins: [ String, Array ] as PropType<string | string[]>,
  tagName: String as PropType<string>,
  toolbar: [ String, Array ] as PropType<string | string[]>,
  modelValue: [ String, Array, Object, Function, Number, Boolean ] as PropType<any>,
  disabled: Boolean as PropType<boolean>,
  tinymceScriptSrc: String as PropType<string>,
  outputFormat: {
    type: String,
    validator: (prop: string) => prop === 'html' || prop === 'text'
  }
}

export type IPropTypes = Partial<ExtractPropTypes<typeof editorProps>>
