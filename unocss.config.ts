import {
  defineConfig,
  presetAttributify,
  presetUno,
  transformerDirectives,
  transformerVariantGroup
} from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetAttributify()
  ],
  theme: {
    breakpoints: {
      sm: '576px',
      md: '768px',
      lg: '992px',
      xl: '1200px',
      xxl: '1600px'
    }
  },
  transformers: [ transformerDirectives({
    applyVariable: [ '--at-apply' ]
  }), transformerVariantGroup() ],
  shortcuts: [
    {
      'flex-center': 'flex items-center justify-center'
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
    [ /^text-hidden-(\d+)$/, ([ , d ]) => ({
      'overflow': 'hidden',
      'text-overflow': 'ellipsis',
      'display': '-webkit-box',
      '-webkit-line-clamp': d,
      'line-clamp': d,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word'
    }) ],
    [ 'hidden-none', { 'opacity': '0', 'visibility': 'hidden' } ],
    [ /^flex-main-(\d+)$/, ([ , d ]) => ({
      'flex': `0 0 ${d}px`
    }) ],
    [ /^shrink-(\d+)$/, ([ , d ]) => ({
      'flex-shrink': d
    }) ],
    [ 'text-hex-main', { 'color': 'var(--gx-primary-color)' } ],
    [ 'bg-hex-main', { 'background': 'var(--gx-primary-color)' } ],
    [ 'word-break-all', { 'word-break': 'break-all' } ],
    [ 'word-break-word', { 'word-break': 'break-word' } ],
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
