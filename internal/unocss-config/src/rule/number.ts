// 方向映射可复用
const dirMap = {
  l: ['left'],
  r: ['right'],
  t: ['top'],
  b: ['bottom'],
  x: ['left', 'right'],
  y: ['top', 'bottom'],
}

const sizeMap = {
  xxs: 'calc(var(--gx-margin-xxs) * 1px)',
  xs: 'calc(var(--gx-margin-xs) * 1px)',
  sm: 'calc(var(--gx-margin-sm) * 1px)',
  base: 'calc(var(--gx-margin) * 1px)',
  md: 'calc(var(--gx-margin-md) * 1px)',
  lg: 'calc(var(--gx-margin-lg) * 1px)',
  xl: 'calc(var(--gx-margin-xl) * 1px)',
  xxl: 'calc(var(--gx-margin-xxl) * 1px)',
}

const gapSizeMap = {
  xxs: 'calc(var(--gx-size-xxs) * 1px)',
  xs: 'calc(var(--gx-size-xs) * 1px)',
  sm: 'calc(var(--gx-size-sm) * 1px)',
  base: 'calc(var(--gx-size) * 1px)',
  md: 'calc(var(--gx-size-md) * 1px)',
  lg: 'calc(var(--gx-size-lg) * 1px)',
  xl: 'calc(var(--gx-size-xl) * 1px)',
  xxl: 'calc(var(--gx-size-xxl) * 1px)',
}

// 工厂函数：用于生成 margin / padding 两套规则
function spacingRule(type: 'margin' | 'padding') {
  return [
    new RegExp(`^${type}-([lrtbxy])-([^]+)$`),
    ([, dir, val]) => {
      const props = dirMap[dir]
      if (!props) return

      // 解析 value
      const cssVal
        = sizeMap[val] // 短点字符
        || (Number.isNaN(val) ? val : `${val}em`) // 数字 → em，其他原样

      const obj: Record<string, string> = {}

      props.forEach((p) => {
        obj[`${type}-${p}`] = cssVal
      })

      return obj
    },
  ]
}

export default [
  [
    'rd-base',
    {
      'border-radius': 'calc(var(--gx-border-radius) * 1px)'
    }
  ],
  [
    'rd-base-lg',
    {
      'border-radius': 'calc(var(--gx-border-radius-lg) * 1px)'
    }
  ],
  [
    'text-size',
    {
      'font-size': 'calc(var(--gx-font-size) * 1px)'
    }
  ],
  [
    /^gap-(xs|sm|base)$/,
    ([, key]) => {
      return {
        gap: gapSizeMap[key]
      }
    }
  ],
  spacingRule('margin'),
  spacingRule('padding'),
  [ 'leading-lg', { 'line-height': 'var(--gx-line-height-lg)' } ],
]
