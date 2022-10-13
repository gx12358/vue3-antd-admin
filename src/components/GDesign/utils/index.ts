import devWarning from 'ant-design-vue/lib/vc-util/devWarning'
import supportsPassive from 'ant-design-vue/lib/_util/supportsPassive'

import LabelIconTip from './components/LabelIconTip'
import FieldLabel from './components/FieldLabel'
import FilterDropdown from './components/FilterDropdown'
import DropdownFooter from './components/DropdownFooter'

import isNil from './isNil'
import { call, MaybeArray } from './call'
import { merge } from './merge'
import pickProProps from './pickProProps'
import omitUndefined from './omitUndefined'
import isDropdownValueType from './isDropdownValueType'
import pickProFormItemProps from './pickProFormItemProps'
import { isScroll, getScrollContainer, isInContainer } from './scroll'
import scrollTo from './scroll/scrollTo'
import getScroll from './scroll/getScroll'
import throttleByAnimationFrame from './scroll/throttleByAnimationFrame'

/** Hooks */
import useIsIos from './hooks/useIsIos'
import useFetchData from './hooks/useFetchData'
import usePrevious from './hooks/usePrevious'
import type { FetchResult, ProRequestData } from './hooks/useFetchData'
import dateArrayFormatter from './dateArrayFormatter'
import parseValueToMoment from './parseValueToMoment'
import conversionMomentValue, { dateFormatterMap } from './conversionMomentValue'
import transformKeySubmitValue from './transformKeySubmitValue'

export function addEventListenerWrap(target, eventType, cb, option) {
  if (target && target.addEventListener) {
    let opt = option;
    if (
      opt === undefined &&
      supportsPassive &&
      (eventType === 'touchstart' || eventType === 'touchmove' || eventType === 'wheel')
    ) {
      opt = { passive: false };
    }
    target.addEventListener(eventType, cb, opt);
  }
  return {
    remove: () => {
      if (target && target.removeEventListener) {
        target.removeEventListener(eventType, cb);
      }
    },
  };
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

/** Type */
export * from './typings'

export type {
  MaybeArray,
  FetchResult,
  ProRequestData
}

export { noteOnce, warning } from 'ant-design-vue/es/vc-util/warning'

export {
  merge,
  isNil,
  call,
  useIsIos,
  isScroll,
  devWarning,
  isInContainer,
  getScrollContainer,
  scrollTo,
  getScroll,
  pickProProps,
  omitUndefined,
  FieldLabel,
  LabelIconTip,
  FilterDropdown,
  DropdownFooter,
  useFetchData,
  usePrevious,
  dateFormatterMap,
  dateArrayFormatter,
  isDropdownValueType,
  pickProFormItemProps,
  conversionMomentValue,
  parseValueToMoment,
  transformKeySubmitValue,
  throttleByAnimationFrame
}
