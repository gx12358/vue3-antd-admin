import {
  defineConfig,
  presetAttributify,
  presetWind3,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

function colorCssVar(val: string) {
  let color = val ? val.includes('rgb') || val.includes('#') ? val : '' : ''
  if (val === 'primary') color = 'var(--gx-color-primary)'
  if (val === 'error') color = 'var(--gx-color-error)'
  if (val === 'split') color = 'var(--gx-color-split)'
  if (val === 'border') color = 'var(--gx-color-border)'

  return color || 'var(--gx-color-split)'
}

export default defineConfig({
  presets: [
    presetWind3(),
    presetAttributify()
  ],
  theme: {
    colors: {
      muted: 'var(--gx-color-text)',
      'muted-foreground': 'var(--gx-color-text-description)',
      'muted-quaternary': 'var(--gx-color-text-quaternary)',
      error: 'var(--gx-color-error)',
      success: 'var(--gx-color-success)',
      primary: 'var(--gx-color-primary)',
      split: 'var(--gx-color-split)',
      border: 'var(--gx-color-border)',
      background: `linear-gradient(var(--gx-color-bg-container), var(--gx-color-bg-layout) 28%)`,
      'background-container': `var(--gx-color-bg-container)`,
    },
  },
  transformers: [ transformerDirectives({
    applyVariable: [ '--at-apply' ]
  }), transformerVariantGroup() ],
  shortcuts: [
    {
      'w-h-full': 'w-full h-full',
      'flex-y': 'flex flex-col',
      'flex-x-center': 'flex items-center',
      'flex-y-center': 'flex items-center flex-col',
      'flex-center': 'flex items-center justify-center',
      'flex-col-center': 'flex items-center justify-center flex-col',
      'flex-between': 'flex items-center justify-between',
    },
  ],
  rules: [
    [ /^text-rgba-(.*)$/, ([ , str ]) => {
      const regex = /\[([^[\]]*)\]/
      const match = str.match(regex)

      if (match && match.length > 1) {
        const contentInsideBrackets = match[1]
        return {
          color: `rgba(${contentInsideBrackets.split('-').join(',')})`
        }
      } else {
        return {}
      }
    } ],
    [ /^bg-rgba-(.*)$/, ([ , str ]) => {
      const regex = /\[([^[\]]*)\]/
      const match = str.match(regex)

      if (match && match.length > 1) {
        const contentInsideBrackets = match[1]
        return {
          'background-color': `rgba(${contentInsideBrackets.split('-').join(',')})`
        }
      } else {
        return {}
      }
    } ],
    [ /^text-g-(.*)$/, ([ , str ]) => {
      const regex = /\[([^[\]]*)\]/
      const match = str.match(regex)

      if (match && match.length > 1) {
        const contentInsideBrackets = match[1]
        if (contentInsideBrackets) {
          const contents = contentInsideBrackets.split('-')
          const size = contents[0] ? { 'font-size': `${contents[0]}px` } : {}
          const lineHeight = contents[1] ? { 'line-height': `${contents[1]}px` } : {}
          const font = contents[2] ? { 'font-weight': `${contents[2]}` } : {}
          const color = contents[3]
            ? { color: contents[3] === 'base' ? `var(--gx-color-text)` : contents[3] }
            : {}
          return {
            ...size,
            ...lineHeight,
            ...font,
            ...color
          } as any
        }
        return {}
      } else {
        return {}
      }
    } ],
    [
      /^bd-(.*)$/,
      ([, str]) => {
        return {
          'border': `1px solid ${colorCssVar(str)}`
        }
      }
    ],
    [
      /^bd-t-(.*)$/,
      ([, str]) => {
        return {
          'border-top': `1px solid ${colorCssVar(str)}`
        }
      }
    ],
    [
      /^bd-b-(.*)$/,
      ([, str]) => {
        return {
          'border-bottom': `1px solid ${colorCssVar(str)}`
        }
      }
    ],
    [
      /^bd-l-(.*)$/,
      ([, str]) => {
        return {
          'border-left': `1px solid ${colorCssVar(str)}`
        }
      }
    ],
    [
      /^bd-r-(.*)$/,
      ([, str]) => {
        return {
          'border-right': `1px solid ${colorCssVar(str)}`
        }
      }
    ],
    [ /^text-hidden-(\d+)$/, ([ , d ]) => ({
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'display': '-webkit-box',
      '-webkit-line-clamp': d,
      'line-clamp': d,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word'
    }) ],
    [ 'op-visible', { 'opacity': '1', 'visibility': 'visible' } ],
    [ 'hidden-none', { 'opacity': '0', 'visibility': 'hidden' } ],
    [ /^flex-main-(\d+)$/, ([ , d ]) => ({
      'flex': `0 0 ${d}px`
    }) ],
    [ /^shrink-(\d+)$/, ([ , d ]) => ({
      'flex-shrink': d
    }) ],
    [ 'rd-base', { 'border-radius': 'var(--gx-border-radius)' } ],
    [ 'word-break-all', { 'word-break': 'break-all' } ],
    [ 'word-break-word', { 'word-break': 'break-word' } ],
    [ 'truncate', { 'text-overflow': 'ellipsis', 'overflow': 'hidden', 'white-space': 'nowrap' } ],
    [ 'flex-main', { 'flex': '1' } ],
    [ 'position-all', { 'position': 'absolute', 'top': '0', 'bottom': '0', 'left': '0', 'right': '0' } ],
    [ 'image-event-none', { 'user-select': 'none', 'pointer-events': 'none' } ],
    [
      'position-center', {
      'left': '50%',
      'top': '50%',
      'transform': 'translate(-50%, -50%)'
    }
    ],
    [
      'position-center-x', {
      'left': '50%',
      'transform': 'translateX(-50%)'
    }
    ],
    [
      'position-center-y', {
      'top': '50%',
      'transform': 'translateY(-50%)'
    }
    ]
  ]
})
