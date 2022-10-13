export type RGBA = [ number, number, number, number ]
export type HSV = [ number, number, number ]
export type RGB = [ number, number, number ]
export type HSLA = [ number, number, number, number ]
export type HSVA = [ number, number, number, number ]
export type HSL = [ number, number, number ]

export const colors = {
  black: '#000',
  silver: '#C0C0C0',
  gray: '#808080',
  white: '#FFF',
  maroon: '#800000',
  red: '#F00',
  purple: '#800080',
  fuchsia: '#F0F',
  green: '#008000',
  lime: '#0F0',
  olive: '#808000',
  yellow: '#FF0',
  navy: '#000080',
  blue: '#00F',
  teal: '#008080',
  aqua: '#0FF',
  transparent: '#0000'
}

const prefix = '^\\s*'
const suffix = '\\s*$'
const percent = '\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))%\\s*' // 4 offset
const float = '\\s*((\\.\\d+)|(\\d+(\\.\\d*)?))\\s*' // 4 offset
const hex = '([0-9A-Fa-f])'
const dhex = '([0-9A-Fa-f]{2})'
const hslRegex = new RegExp(
  `${prefix}hsl\\s*\\(${float},${percent},${percent}\\)${suffix}`
)
const hsvRegex = new RegExp(
  `${prefix}hsv\\s*\\(${float},${percent},${percent}\\)${suffix}`
)
const hslaRegex = new RegExp(
  `${prefix}hsla\\s*\\(${float},${percent},${percent},${float}\\)${suffix}`
)
const hsvaRegex = new RegExp(
  `${prefix}hsva\\s*\\(${float},${percent},${percent},${float}\\)${suffix}`
)
const rgbRegex = new RegExp(
  `${prefix}rgb\\s*\\(${float},${float},${float}\\)${suffix}`
)
const rgbaRegex = new RegExp(
  `${prefix}rgba\\s*\\(${float},${float},${float},${float}\\)${suffix}`
)
const sHexRegex = new RegExp(`${prefix}#${hex}${hex}${hex}${suffix}`)
const hexRegex = new RegExp(`${prefix}#${dhex}${dhex}${dhex}${suffix}`)
const sHexaRegex = new RegExp(`${prefix}#${hex}${hex}${hex}${hex}${suffix}`)
const hexaRegex = new RegExp(`${prefix}#${dhex}${dhex}${dhex}${dhex}${suffix}`)

function parseHex(value: string): number {
  return parseInt(value, 16)
}

export function roundChannel(value: number | string): number {
  const v = Math.round(Number(value))
  if (v > 255) return 255
  if (v < 0) return 0
  return v
}

export function toRgbaString(base: RGBA | RGB): string {
  const [r, g, b] = base
  if (3 in base) {
    return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(
      b
    )}, ${roundAlpha(base[3]!)})`
  }
  return `rgba(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)}, 1)`
}

export function toHsvaString(base: HSVA | HSV): string {
  const [h, s, v] = base
  if (3 in base) {
    return `hsva(${roundDeg(h)}, ${roundPercent(s)}%, ${roundPercent(
      v
    )}%, ${roundAlpha(base[3]!)})`
  }
  return `hsva(${roundDeg(h)}, ${roundPercent(s)}%, ${roundPercent(v)}%, 1)`
}

export function toHslString(base: HSVA | HSV): string {
  return `hsl(${roundDeg(base[0])}, ${roundPercent(base[1])}%, ${roundPercent(
    base[2]
  )}%)`
}

export function toHslaString(base: HSLA | HSL): string {
  const [ h, s, l ] = base
  if (3 in base) {
    return `hsla(${roundDeg(h)}, ${roundPercent(s)}%, ${roundPercent(
      l
    )}%, ${roundAlpha(base[3]!)})`
  }
  return `hsla(${roundDeg(h)}, ${roundPercent(s)}%, ${roundPercent(l)}%, 1)`
}

/**
 *
 * @param base [255, 255, 255, 255], [255, 255, 255], any hex string
 * @returns
 */
export function toHexaString(base: RGBA | RGB | string): string {
  if (typeof base === 'string') {
    let i
    if (i = hexRegex.exec(base)) {
      return `${i[0]}FF`
    } else if (i = hexaRegex.exec(base)) {
      return i[0]
    } else if (i = sHexRegex.exec(base)) {
      return `#${i[1]}${i[1]}${i[2]}${i[2]}${i[3]}${i[3]}FF`
    } else if (i = sHexaRegex.exec(base)) {
      return `#${i[1]}${i[1]}${i[2]}${i[2]}${i[3]}${i[3]}${i[4]}${i[4]}`
    }
    throw new Error(`[seemly/toHexString]: Invalid hex value ${base}.`)
  }
  const hex = `#${base
    .slice(0, 3)
    .map((unit) =>
      roundChannel(unit).toString(16).toUpperCase().padStart(2, '0')
    )
    .join('')}`
  const a =
    base.length === 3
      ? 'FF'
      : roundChannel(base[3] * 255)
        .toString(16)
        .padStart(2, '0')
        .toUpperCase()
  return hex + a
}

/**
 * Convert color string to rgba array.
 * @param color format like #000[0], #000000[00], rgb(0, 0, 0), rgba(0, 0, 0, 0) and basic color keywords https://www.w3.org/TR/css-color-3/#html4 and transparent
 * @returns
 */
export function rgba(color: string): RGBA {
  try {
    let i
    if ((i = hexRegex.exec(color))) {
      return [ parseHex(i[1]), parseHex(i[2]), parseHex(i[3]), 1 ]
    } else if ((i = rgbRegex.exec(color))) {
      return [ roundChannel(i[1]), roundChannel(i[5]), roundChannel(i[9]), 1 ]
    } else if ((i = rgbaRegex.exec(color))) {
      return [
        roundChannel(i[1]),
        roundChannel(i[5]),
        roundChannel(i[9]),
        roundAlpha(i[13])
      ]
    } else if ((i = sHexRegex.exec(color))) {
      return [
        parseHex(i[1] + i[1]),
        parseHex(i[2] + i[2]),
        parseHex(i[3] + i[3]),
        1
      ]
    } else if ((i = hexaRegex.exec(color))) {
      return [
        parseHex(i[1]),
        parseHex(i[2]),
        parseHex(i[3]),
        roundAlpha(parseHex(i[4]) / 255)
      ]
    } else if ((i = sHexaRegex.exec(color))) {
      return [
        parseHex(i[1] + i[1]),
        parseHex(i[2] + i[2]),
        parseHex(i[3] + i[3]),
        roundAlpha(parseHex(i[4] + i[4]) / 255)
      ]
    } else if (color in colors) {
      return rgba(colors[color as keyof typeof colors])
    }
    throw new Error(`[seemly/rgba]: Invalid color value ${color}.`)
  } catch (e) {
    throw e
  }
}

/**
 * @param h 360
 * @param s 100
 * @param l 100
 * @returns [h, s, v] 360, 100, 100
 */
export function hsl2hsv(h: number, s: number, l: number): HSV {
  s /= 100
  l /= 100
  const v = s * Math.min(l, 1 - l) + l
  return [ h, v ? (2 - (2 * l) / v) * 100 : 0, v * 100 ]
}

/**
 * @param h 360
 * @param s 100
 * @param l 100
 * @returns [255, 255, 255]
 */
export function hsl2rgb(h: number, s: number, l: number): RGB {
  s /= 100
  l /= 100
  const a = s * Math.min(l, 1 - l)
  const f = (n: number, k = (n + h / 30) % 12) =>
    l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)
  return [ f(0) * 255, f(8) * 255, f(4) * 255 ]
}

/**
 * @param h 360
 * @param s 100
 * @param v 100
 * @returns [h, s, l] 360, 100, 100
 */
export function hsv2hsl(h: number, s: number, v: number): HSL {
  s /= 100
  v /= 100
  const l = v - (v * s) / 2
  const m = Math.min(l, 1 - l)
  return [ h, m ? ((v - l) / m) * 100 : 0, l * 100 ]
}

/**
 * @param h 360
 * @param s 100
 * @param v 100
 * @returns [r, g, b] 255, 255, 255
 */
export function hsv2rgb(h: number, s: number, v: number): RGB {
  s /= 100
  v /= 100
  const f = (n: number, k = (n + h / 60) % 6) =>
    v - v * s * Math.max(Math.min(k, 4 - k, 1), 0)
  return [ f(5) * 255, f(3) * 255, f(1) * 255 ]
}

/**
 * Convert color string to hsva array
 * @param color format like hsv(180, 100%, 100%), hsva(180, 100%, 100%, 1)
 * @returns
 */
export function hsva(color: string): HSLA {
  try {
    let i
    if ((i = hsvaRegex.exec(color))) {
      return [
        roundDeg(i[1]),
        roundPercent(i[5]),
        roundPercent(i[9]),
        roundAlpha(i[13])
      ]
    } else if ((i = hsvRegex.exec(color))) {
      return [ roundDeg(i[1]), roundPercent(i[5]), roundPercent(i[9]), 1 ]
    }
    throw new Error(`[seemly/hsva]: Invalid color value ${color}.`)
  } catch (e) {
    throw e
  }
}

/**
 * @param r 255
 * @param g 255
 * @param b 255
 * @returns [360, 100, 100]
 */
export function rgb2hsl(r: number, g: number, b: number): HSL {
  r /= 255
  g /= 255
  b /= 255
  const v = Math.max(r, g, b)
  const c = v - Math.min(r, g, b)
  const f = 1 - Math.abs(v + v - c - 1)
  const h =
    c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c)
  return [ 60 * (h < 0 ? h + 6 : h), f ? (c / f) * 100 : 0, (v + v - c) * 50 ]
}

/**
 * @param r 255
 * @param g 255
 * @param b 255
 * @returns [360, 100, 100]
 */
export function rgb2hsv(r: number, g: number, b: number): HSV {
  r /= 255
  g /= 255
  b /= 255
  const v = Math.max(r, g, b)
  const c = v - Math.min(r, g, b)
  const h =
    c && (v == r ? (g - b) / c : v == g ? 2 + (b - r) / c : 4 + (r - g) / c)
  return [ 60 * (h < 0 ? h + 6 : h), v && (c / v) * 100, v * 100 ]
}

export function roundDeg(value: number | string): number {
  const v = Math.round(Number(value))
  if (v >= 360) return 0
  if (v < 0) return 0
  return v
}

export function roundPercent(value: number | string): number {
  const v = Math.round(Number(value))
  if (v > 100) return 100
  if (v < 0) return 0
  return v
}

export function roundAlpha(value: number | string): number {
  const v = Math.round(Number(value) * 100) / 100
  if (v > 1) return 1
  if (v < 0) return 0
  return v
}

/**
 * Convert color string to hsla array
 * @param color format like hsl(180, 100%, 100%), hsla(180, 100%, 100%, 1)
 * @returns
 */
export function hsla(color: string): HSLA {
  try {
    let i
    if ((i = hslaRegex.exec(color))) {
      return [
        roundDeg(i[1]),
        roundPercent(i[5]),
        roundPercent(i[9]),
        roundAlpha(i[13])
      ]
    } else if ((i = hslRegex.exec(color))) {
      return [ roundDeg(i[1]), roundPercent(i[5]), roundPercent(i[9]), 1 ]
    }
    throw new Error(`[seemly/hsla]: Invalid color value ${color}.`)
  } catch (e) {
    throw e
  }
}

function stringifyRgb(r: number, g: number, b: number): string {
  return `rgb(${roundChannel(r)}, ${roundChannel(g)}, ${roundChannel(b)})`
}

export function toRgbString(base: string | RGB | RGBA): string {
  const [r, g, b] = Array.isArray(base) ? base : rgba(base)
  return stringifyRgb(r, g, b)
}

/**
 *
 * @param base [255, 255, 255, 255], [255, 255, 255], any hex string
 * @returns
 */
export function toHexString(base: RGBA | RGB | string): string {
  if (typeof base === 'string') {
    let i
    if (i = hexRegex.exec(base)) {
      return i[0]
    } else if (i = hexaRegex.exec(base)) {
      return i[0].slice(0, 7)
    } else if (i = (sHexRegex.exec(base) || sHexaRegex.exec(base))) {
      return `#${i[1]}${i[1]}${i[2]}${i[2]}${i[3]}${i[3]}`
    }
    throw new Error(`[seemly/toHexString]: Invalid hex value ${base}.`)
  }
  return `#${base
    .slice(0, 3)
    .map((unit) =>
      roundChannel(unit).toString(16).toUpperCase().padStart(2, '0')
    )
    .join('')}`
}

export function toHsvString(base: HSVA | HSV): string {
  return `hsv(${roundDeg(base[0])}, ${roundPercent(base[1])}%, ${roundPercent(
    base[2]
  )}%)`
}
