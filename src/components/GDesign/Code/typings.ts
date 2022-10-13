import type { HLJSApi } from 'highlight.js'

export interface UseHljsProps {
  hljs?: unknown
  [key: string]: unknown
}

export interface Hljs {
  highlight: HLJSApi['highlight']
  getLanguage: HLJSApi['getLanguage']
}
