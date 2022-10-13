import type { ExtractPropTypes, CSSProperties } from 'vue'
import { defineComponent, ref, onMounted, watch, toRef, computed } from 'vue'
import hljs from 'highlight.js/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'
import { getPrefixCls } from '@gx-admin/utils'
import { codeProps } from './props'

import './style.less'

hljs.registerLanguage('javascript', javascript)

export type CodeProps = ExtractPropTypes<typeof codeProps>

export default defineComponent({
  name: 'GCode',
  props: codeProps,
  setup(props, { slots }) {
    const { internalNoHighlight } = props

    const baseClassName = getPrefixCls({
      suffixCls: 'code'
    })

    const hljsRef = computed(() => props.hljs || hljs)

    const codeRef = ref<any>(null)

    const cssVars = computed(() => {
      return {
        fontSize: props.internalFontSize ? `${props.internalFontSize}px` : '14px'
      }
    })

    const createCodeHtml = (language: string, code: string, trim: boolean): string | null => {
      const { value: hljs } = hljsRef
      if (!hljs) {
        return null
      }
      if (!(language && hljs.getLanguage(language))) {
        return null
      }
      return hljs.highlight(trim ? code.trim() : code, {
        language
      }).value
    }

    const setCode = (): void => {
      if (slots.default) return
      const { value: codeEl } = codeRef
      if (!codeEl) return
      const { language } = props
      const code = props.uri ? window.decodeURIComponent(props.code) : props.code
      if (language) {
        const html = createCodeHtml(language, code, props.trim)
        if (html !== null) {
          codeEl.innerHTML = props.inline ? html : `<pre>${html}</pre>`
          return
        }
      }
      if (props.inline) {
        codeEl.textContent = code
        return
      }
      const maybePreEl = codeEl.children[0]
      if (maybePreEl && maybePreEl.tagName === 'PRE') {
        maybePreEl.textContent = code
      } else {
        const warp = document.createElement('pre')
        warp.textContent = code
        codeEl.innerHTML = ''
        codeEl.appendChild(warp)
      }
    }
    onMounted(setCode)

    watch(toRef(props, 'language'), setCode)
    watch(toRef(props, 'code'), setCode)

    if (!internalNoHighlight) watch(hljsRef, setCode)

    if (!internalNoHighlight) watch(hljsRef, setCode)

    return () => {
      return (
        <code
          class={[`${baseClassName}`, props.wordWrap && `${baseClassName}-word-wrap`]}
          style={cssVars.value as CSSProperties}
          ref={(e) => (codeRef.value = e)}
        >
          {slots}
        </code>
      )
    }
  }
})
