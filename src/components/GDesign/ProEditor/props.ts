import type { RawEditorSettings } from 'tinymce'
import type { ExtractPropTypes } from 'vue'
import { PropTypes } from '@/utils'

export const editorProps = {
  apiKey: String as VuePropType<string>,
  cloudChannel: String as VuePropType<string>,
  id: String as VuePropType<string>,
  init: Object as VuePropType<RawEditorSettings>,
  initialValue: String as VuePropType<string>,
  inline: Boolean as VuePropType<boolean>,
  modelEvents: [ String, Array ] as VuePropType<string | string[]>,
  plugins: [ String, Array ] as VuePropType<string | string[]>,
  tagName: String as VuePropType<string>,
  toolbar: [ String, Array ] as VuePropType<string | string[]>,
  modelValue: PropTypes.any,
  disabled: Boolean as VuePropType<boolean>,
  tinymceScriptSrc: String as VuePropType<string>,
  outputFormat: {
    type: String,
    validator: (prop: string) => prop === 'html' || prop === 'text'
  }
}

export type IPropTypes = Partial<ExtractPropTypes<typeof editorProps>>
