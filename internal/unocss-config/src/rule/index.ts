import { colors } from '../css-var'

export const rules = (extra: any[] = []) => {
  const base: any[] = [
    [
      'rd-base',
      {
        'border-radius': 'var(--gx-border-radius)'
      }
    ],
    [
      'rd-base-lg',
      {
        'border-radius': 'var(--gx-border-radius-lg)'
      }
    ],
    [ /^text-g-(.*)$/, ([ , str ]) => {
      const regex = /\[([^[\]]*)\]/
      const match = str.match(regex)

      if (match && match.length > 1) {
        const contentInsideBrackets = match[1]
        if (contentInsideBrackets) {
          const contents = contentInsideBrackets.split('-')
          const size = contents[0] ? { 'font-size': `${contents[0]}` } : {}
          const lineHeight = contents[1] ? { 'line-height': `${contents[1]}` } : {}
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
          'border': `1px solid ${colors[str] ?? str}`
        }
      }
    ],
    [
      /^bd-t-(.*)$/,
      ([, str]) => {
        return {
          'border-top': `1px solid ${colors[str] ?? str}`
        }
      }
    ],
    [
      /^bd-b-(.*)$/,
      ([, str]) => {
        return {
          'border-bottom': `1px solid ${colors[str] ?? str}`
        }
      }
    ],
    [
      /^bd-l-(.*)$/,
      ([, str]) => {
        return {
          'border-left': `1px solid ${colors[str] ?? str}`
        }
      }
    ],
    [
      /^bd-r-(.*)$/,
      ([, str]) => {
        return {
          'border-right': `1px solid ${colors[str] ?? str}`
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
    [ 'leading-lg', { 'line-height': 'var(--gx-line-height-lg)' } ],
    [ 'opacity-visible', { 'opacity': '1', 'visibility': 'visible' } ],
    [ 'hidden-none', { 'opacity': '0', 'visibility': 'hidden' } ],
    [ /^flex-main-(\d+)$/, ([ , str ]) => ({
      'flex': `0 0 ${str}`
    }) ],
    [ 'position-all', { 'position': 'absolute', 'top': '0', 'bottom': '0', 'left': '0', 'right': '0' } ],
    [ 'word-break-all', { 'word-break': 'break-all' } ],
    [ 'word-break-word', { 'word-break': 'break-word' } ],
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
    ],
  ]
  return [
    ...base,
    ...extra
  ]
}
