import { Fragment, Slots } from 'vue'

import isServer from './isServer'

export interface prefixCls {
  suffixCls?: string;
  customizePrefixCls?: string;
  isPor?: boolean;
  className?: string;
}

export const getPrefixCls = ({
  suffixCls,
  customizePrefixCls,
  isPor,
  className
}: prefixCls) => {
  const prefixCls = className || (isPor ? `gx-pro`: 'gx')
  if (customizePrefixCls) return customizePrefixCls
  return suffixCls ? `${prefixCls}-${suffixCls}` : prefixCls
}

export function getSlotVNode<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    return false
  }
  return (props[prop] || slots[prop]?.()) as T
}

export function getSlot<T>(slots: Slots, props: Record<string, unknown>, prop = 'default'): T | false {
  if (props[prop] === false) {
    // force not render
    return false
  }
  return (props[prop] || slots[prop]) as T
}

export function get(entity: any, path: (string | number)[]) {
  let current = entity

  for (let i = 0; i < path.length; i += 1) {
    if (current === null || current === undefined) {
      return undefined
    }

    current = current[path[i]]
  }

  return current
}

function internalSet<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined: boolean
): Output {
  if (!paths.length) {
    return (value as unknown) as Output
  }

  const [ path, ...restPath ] = paths

  let clone: Output
  if (!entity && typeof path === 'number') {
    clone = ([] as unknown) as Output
  } else if (Array.isArray(entity)) {
    clone = ([ ...entity ] as unknown) as Output
  } else {
    clone = ({ ...entity } as unknown) as Output
  }

  // Delete prop if `removeIfUndefined` and value is undefined
  if (removeIfUndefined && value === undefined && restPath.length === 1) {
    delete clone[path][restPath[0]]
  } else {
    clone[path] = internalSet(clone[path], restPath, value, removeIfUndefined)
  }

  return clone
}

export function set<Entity = any, Output = Entity, Value = any>(
  entity: Entity,
  paths: (string | number)[],
  value: Value,
  removeIfUndefined = false
): Output {
  // Do nothing if `removeIfUndefined` and parent object not exist
  if (
    paths.length &&
    removeIfUndefined &&
    value === undefined &&
    !get(entity, paths.slice(0, -1))
  ) {
    return (entity as unknown) as Output
  }

  return internalSet(entity, paths, value, removeIfUndefined)
}

export const isSlotFragment = (slots, name = 'default') => slots[name]?.().length === 1 &&
  !slots[name]?.()[0].children && (
    slots[name]?.()[0].type === Fragment ||
    String(slots[name]?.()[0].type) === String(Symbol()) ||
    String(slots[name]?.()[0].type) === String(Symbol('Comment'))
  )

export const getSlotChildren = (slots, name = 'default') => slots[name]?.().length === 1 && (
  slots[name]?.()[0].type === Fragment ||
  String(slots[name]?.()[0].type) === String(Symbol()) ||
  String(slots[name]?.()[0].type) === String(Symbol('Comment'))
)
  ? slots[name]?.()[0].children || []
  : slots[name]?.() || []

/** Type */
export * from './typings'

export { noteOnce } from 'ant-design-vue/es/vc-util/warning'

export {
  isServer
}
