import { Hljs } from './typings'

export const codeProps = {
  language: String,
  code: {
    type: String,
    default: ''
  },
  trim: {
    type: Boolean,
    default: true
  },
  hljs: Object as PropType<Hljs>,
  uri: Boolean,
  inline: Boolean,
  wordWrap: Boolean,
  internalFontSize: Number,
  internalNoHighlight: Boolean
}
