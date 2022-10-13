import { isServer } from '@gx-admin/utils'
import { camelize } from '@vue/shared'

const getStyle = function (
  element: HTMLElement,
  styleName: string
): string {
  if (isServer) return ''
  if (!element || !styleName) return ''
  styleName = camelize(styleName)
  if (styleName === 'float') {
    styleName = 'cssFloat'
  }
  try {
    const style = element.style[styleName]
    if (style) return style
    const computed = document?.defaultView?.getComputedStyle(element, '')
    return computed ? computed[styleName] : ''
  } catch (e) {
    return element.style[styleName]
  }
}

export const isScroll = (
  el: HTMLElement,
  isVertical?: Nullable<boolean>
) => {
  if (isServer) return
  const determinedDirection = isVertical === null || isVertical === undefined
  const overflow = determinedDirection
    ? getStyle(el, 'overflow')
    : isVertical
      ? getStyle(el, 'overflow-y')
      : getStyle(el, 'overflow-x')

  return overflow.match(/(scroll|auto|overlay)/)
}

export const getScrollContainer = (
  el: HTMLElement,
  isVertical?: Nullable<boolean>
) => {
  if (isServer) return

  let parent: HTMLElement = el
  while (parent) {
    if ([ window, document, document.documentElement ].includes(parent)) {
      return window
    }
    if (isScroll(parent, isVertical)) {
      return parent
    }
    parent = parent.parentNode as HTMLElement
  }
  return parent
}

export const isInContainer = (
  el: HTMLElement,
  container: HTMLElement
): boolean => {
  if (isServer || !el || !container) return false

  const elRect = el.getBoundingClientRect()
  let containerRect: any

  if (
    [ window, document, document.documentElement, null, undefined ].includes(
      container
    )
  ) {
    containerRect = {
      top: 0,
      right: window.innerWidth,
      bottom: window.innerHeight,
      left: 0
    }
  } else {
    containerRect = container.getBoundingClientRect()
  }
  return (
    elRect.top < containerRect.bottom &&
    elRect.bottom > containerRect.top &&
    elRect.right > containerRect.left &&
    elRect.left < containerRect.right
  )
}
