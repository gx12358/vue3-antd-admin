import type { ExtractPropTypes } from 'vue'
import { defineComponent, ref, computed, toRef, watchEffect, Ref, watch, nextTick } from 'vue'
import { Popover } from 'ant-design-vue'
import { onClickOutside } from '@vueuse/core'
import { useMergedState } from '@gx-admin/hooks/core'
import { getPrefixCls } from '@gx-admin/utils'
import type { OnUpdateValueImpl } from '@gx-design/utils'
import { call } from '@gx-design/utils'
import { colorPickerPanelProps } from './props'
import {
  hsv2rgb,
  rgb2hsv,
  rgba,
  hsva,
  hsla,
  hsl2hsv,
  hsv2hsl,
  rgb2hsl,
  hsl2rgb,
  toRgbaString,
  toHsvaString,
  toHslaString,
  HSVA,
  RGBA,
  HSLA,
  toHexaString,
  toHsvString,
  toRgbString,
  toHexString,
  toHslString
} from './seemly'
import { deriveDefaultValue, getModeFromValue } from './utils'
import type { ColorPickerMode } from './utils'
import ColorPickerTrigger from './components/ColorPickerTrigger'
import Pallete from './components/Pallete'
import HueSlider from './components/HueSlider'
import AlphaSlider from './components/AlphaSlider'
import ColorPreview from './components/ColorPreview'
import ColorInput from './components/ColorInput'
import ColorPickerSwatches from './components/ColorPickerSwatches'

import './style.less'

export type ColorPickerProps = Partial<ExtractPropTypes<typeof colorPickerPanelProps>>

export default defineComponent({
  name: 'GColorPicker',
  props: colorPickerPanelProps,
  setup(props, { slots, emit }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'color'
    })

    const selfRef = ref<any>(null)
    const wrap = ref<any>()
    const trigger = ref<any>()
    const popoverRef = ref<any>()
    let upcomingValue: string | null = null

    const uncontrolledShowRef = ref(props.defaultShow)

    const mergedShowRef = useMergedState(toRef(props, 'show'), uncontrolledShowRef)

    function doUpdateShow(value: boolean): void {
      const { onUpdateShow, 'onUpdate:show': _onUpdateShow } = props
      if (onUpdateShow) call(onUpdateShow, value)
      if (_onUpdateShow) call(_onUpdateShow, value)
      uncontrolledShowRef.value = value
    }

    const uncontrolledValueRef = ref(
      props.defaultValue === undefined
        ? deriveDefaultValue(props.modes, props.showAlpha)
        : props.defaultValue
    )
    const mergedValueRef = useMergedState(toRef(props, 'value'), uncontrolledValueRef)

    const undoStackRef: Ref<Array<string | null>> = ref([mergedValueRef.value])
    const valueIndexRef = ref(0)

    const valueModeRef = computed(() => getModeFromValue(mergedValueRef.value))

    const displayedModeRef = ref<ColorPickerMode>(getModeFromValue(mergedValueRef.value) || 'rgb')

    function handleUpdateDisplayedMode(): void {
      const { modes } = props
      const { value: displayedMode } = displayedModeRef
      const currentModeIndex = modes.findIndex((mode) => mode === displayedMode)
      if (~currentModeIndex) {
        displayedModeRef.value = modes[(currentModeIndex + 1) % modes.length]
      } else {
        displayedModeRef.value = 'rgb'
      }
    }

    let _h: number, // avoid conflict with render function's h
      s: number,
      l: number,
      v: number,
      r: number,
      g: number,
      b: number,
      a: number

    const hsvaRef = computed<HSVA | null>(() => {
      const { value: mergedValue } = mergedValueRef
      if (!mergedValue) return null
      switch (valueModeRef.value!) {
        case 'hsv':
          return hsva(mergedValue)
        case 'hsl':
          ;[_h, s, l, a] = hsla(mergedValue)
          return [...hsl2hsv(_h, s, l), a]
        case 'rgb':
        case 'hex':
          ;[r, g, b, a] = rgba(mergedValue)
          return [...rgb2hsv(r, g, b), a]
      }
      return null
    })

    const rgbaRef = computed<RGBA | null>(() => {
      const { value: mergedValue } = mergedValueRef
      if (!mergedValue) return null
      switch (valueModeRef.value!) {
        case 'rgb':
        case 'hex':
          return rgba(mergedValue)
        case 'hsv':
          ;[_h, s, v, a] = hsva(mergedValue)
          return [...hsv2rgb(_h, s, v), a]
        case 'hsl':
          ;[_h, s, l, a] = hsla(mergedValue)
          return [...hsl2rgb(_h, s, l), a]
      }
      return null
    })

    const hslaRef = computed<HSLA | null>(() => {
      const { value: mergedValue } = mergedValueRef
      if (!mergedValue) return null
      switch (valueModeRef.value!) {
        case 'hsl':
          return hsla(mergedValue)
        case 'hsv':
          ;[_h, s, v, a] = hsva(mergedValue)
          return [...hsv2hsl(_h, s, v), a]
        case 'rgb':
        case 'hex':
          ;[r, g, b, a] = rgba(mergedValue)
          return [...rgb2hsl(r, g, b), a]
      }
      return null
    })

    const mergedValueArrRef = computed(() => {
      switch (displayedModeRef.value) {
        case 'rgb':
        case 'hex':
          return rgbaRef.value
        case 'hsv':
          return hsvaRef.value
        case 'hsl':
          return hslaRef.value
      }
      return null
    })

    const displayedHueRef = ref<number>(0)
    const displayedAlphaRef = ref<number>(1)
    const displayedSvRef = ref<[number, number]>([0, 0])

    function handleUpdateSv(s: number, v: number): void {
      const { value: hsvaArr } = hsvaRef
      const hue = displayedHueRef.value
      const alpha = hsvaArr ? hsvaArr[3] : 1
      displayedSvRef.value = [s, v]
      const { showAlpha } = props
      switch (displayedModeRef.value) {
        case 'hsv':
          doUpdateValue((showAlpha ? toHsvaString : toHsvString)([hue, s, v, alpha]), 'cursor')
          emit('change', '')
          break
        case 'hsl':
          doUpdateValue(
            (showAlpha ? toHslaString : toHslString)([...hsv2hsl(hue, s, v), alpha]),
            'cursor'
          )
          break
        case 'rgb':
          doUpdateValue(
            (showAlpha ? toRgbaString : toRgbString)([...hsv2rgb(hue, s, v), alpha]),
            'cursor'
          )
          break
        case 'hex':
          doUpdateValue(
            (showAlpha ? toHexaString : toHexString)([...hsv2rgb(hue, s, v), alpha]),
            'cursor'
          )
          break
      }
    }

    function handleUpdateHue(hue: number): void {
      displayedHueRef.value = hue
      const { value: hsvaArr } = hsvaRef
      if (!hsvaArr) {
        return
      }
      const [, s, v, a] = hsvaArr
      const { showAlpha } = props
      switch (displayedModeRef.value) {
        case 'hsv':
          doUpdateValue((showAlpha ? toHsvaString : toHsvString)([hue, s, v, a]), 'cursor')
          break
        case 'rgb':
          doUpdateValue(
            (showAlpha ? toRgbaString : toRgbString)([...hsv2rgb(hue, s, v), a]),
            'cursor'
          )
          break
        case 'hex':
          doUpdateValue(
            (showAlpha ? toHexaString : toHexString)([...hsv2rgb(hue, s, v), a]),
            'cursor'
          )
          break
        case 'hsl':
          doUpdateValue(
            (showAlpha ? toHslaString : toHslString)([...hsv2hsl(hue, s, v), a]),
            'cursor'
          )
          break
      }
    }

    function handleUpdateAlpha(alpha: number): void {
      switch (displayedModeRef.value) {
        case 'hsv':
          ;[_h, s, v] = hsvaRef.value!
          doUpdateValue(toHsvaString([_h, s, v, alpha]), 'cursor')
          break
        case 'rgb':
          ;[r, g, b] = rgbaRef.value!
          doUpdateValue(toRgbaString([r, g, b, alpha]), 'cursor')
          break
        case 'hex':
          ;[r, g, b] = rgbaRef.value!
          doUpdateValue(toHexaString([r, g, b, alpha]), 'cursor')
          break
        case 'hsl':
          ;[_h, s, l] = hslaRef.value!
          doUpdateValue(toHslaString([_h, s, l, alpha]), 'cursor')
          break
      }
      displayedAlphaRef.value = alpha
    }

    function doUpdateValue(value: string | null, updateSource: 'cursor' | 'input'): void {
      if (updateSource === 'cursor') {
        upcomingValue = value
      } else {
        upcomingValue = null
      }
      const { onChange, 'onUpdate:value': _onUpdateValue } = props
      if (onChange) call(onChange as OnUpdateValueImpl, value)
      if (_onUpdateValue) call(_onUpdateValue as OnUpdateValueImpl, value)
      uncontrolledValueRef.value = value
    }

    function handleInputUpdateValue(value: string): void {
      doUpdateValue(value, 'input')
      void nextTick(handleComplete)
    }

    function handleComplete(pushStack = true): void {
      const { value } = mergedValueRef
      if (value) {
        const { onComplete } = props
        if (onComplete) {
          ;(onComplete as OnUpdateValueImpl)(value)
        }
        const { value: undoStack } = undoStackRef
        const { value: valueIndex } = valueIndexRef
        if (pushStack) {
          undoStack.splice(valueIndex + 1, undoStack.length, value)
          valueIndexRef.value = valueIndex + 1
        }
      }
    }

    function undo(): void {
      const { value: valueIndex } = valueIndexRef
      if (valueIndex - 1 < 0) return
      doUpdateValue(undoStackRef.value[valueIndex - 1], 'input')
      handleComplete(false)
      valueIndexRef.value = valueIndex - 1
    }

    function redo(): void {
      const { value: valueIndex } = valueIndexRef
      if (valueIndex < 0 || valueIndex + 1 >= undoStackRef.value.length) return
      doUpdateValue(undoStackRef.value[valueIndex + 1], 'input')
      handleComplete(false)
      valueIndexRef.value = valueIndex + 1
    }

    function handleConfirm(): void {
      doUpdateShow(false)
    }

    const undoableRef = computed(() => valueIndexRef.value >= 1)
    const redoableRef = computed(() => {
      const { value: undoStack } = undoStackRef
      return undoStack.length > 1 && valueIndexRef.value < undoStack.length - 1
    })

    watch(mergedShowRef, (value) => {
      if (!value) {
        undoStackRef.value = [mergedValueRef.value]
        valueIndexRef.value = 0
      }
    })

    watchEffect(() => {
      if (upcomingValue && upcomingValue === mergedValueRef.value) {
        // let it works in uncontrolled mode
      } else {
        const { value } = hsvaRef
        if (value) {
          displayedHueRef.value = value[0]
          displayedAlphaRef.value = value[3]
          displayedSvRef.value = [value[1], value[2]]
        }
      }
      upcomingValue = null
    })

    const handleTriggerClick = () => {
      doUpdateShow(!mergedShowRef.value)
    }

    watch(
      () => mergedShowRef.value,
      (value) => {
        value &&
          onClickOutside(wrap, (e) => {
            if (e.target['attributes']?.['data-target']?.value !== 'color-picker') {
              doUpdateShow(false)
            }
          })
      }
    )

    const renderPanel = () => {
      const { value: rgba } = rgbaRef
      const { value: displayedHue } = displayedHueRef
      const { internalActions, modes, actions } = props
      return (
        <>
          {mergedShowRef.value && (
            <div
              ref={(e) => (wrap.value = e)}
              class={`${baseClassName}-picker-panel`}
              onDragstart={(e) => e.preventDefault()}
            >
              <div class={`${baseClassName}-picker-control`}>
                <Pallete
                  clsPrefix={baseClassName}
                  rgba={rgba}
                  displayedHue={displayedHue}
                  displayedSv={displayedSvRef.value}
                  onUpdateSV={handleUpdateSv}
                  onComplete={handleComplete}
                />
                <div class={`${baseClassName}-picker-preview`}>
                  <div class={`${baseClassName}-picker-preview-sliders`}>
                    <HueSlider
                      clsPrefix={baseClassName}
                      hue={displayedHue}
                      onUpdateHue={handleUpdateHue}
                      onComplete={handleComplete}
                    />
                    {props.showAlpha && (
                      <AlphaSlider
                        clsPrefix={baseClassName}
                        rgba={rgba}
                        alpha={displayedAlphaRef.value}
                        onUpdateAlpha={handleUpdateAlpha}
                        onComplete={handleComplete}
                      />
                    )}
                  </div>
                  {props.showPreview && (
                    <ColorPreview
                      clsPrefix={baseClassName}
                      mode={displayedModeRef.value}
                      color={rgbaRef.value && toHexString(rgbaRef.value)}
                      onUpdateColor={(color) => doUpdateValue(color, 'input')}
                    />
                  )}
                </div>
                <ColorInput
                  clsPrefix={baseClassName}
                  showAlpha={props.showAlpha}
                  mode={displayedModeRef.value}
                  modes={modes}
                  onUpdateMode={handleUpdateDisplayedMode}
                  value={mergedValueRef.value}
                  valueArr={mergedValueArrRef.value}
                  onUpdateValue={handleInputUpdateValue}
                />
                {props.swatches?.length && (
                  <ColorPickerSwatches
                    clsPrefix={baseClassName}
                    mode={displayedModeRef.value}
                    swatches={props.swatches}
                    onUpdateColor={(color) => doUpdateValue(color, 'input')}
                  />
                )}
              </div>
              {actions?.length && (
                <div class={`${baseClassName}-picker-action`}>
                  {actions.includes('confirm') && (
                    <a-button size="small" onClick={handleConfirm}>
                      确定
                    </a-button>
                  )}
                </div>
              )}
              {slots.action ? (
                <div class={`${baseClassName}-picker-action`}>{slots.action?.()}</div>
              ) : internalActions ? (
                <div class={`${baseClassName}-picker-action`}>
                  {internalActions.includes('undo') && (
                    <a-button size="small" onClick={undo} disabled={!undoableRef.value}>
                      撤销
                    </a-button>
                  )}
                  {internalActions.includes('redo') && (
                    <a-button size="small" onClick={redo} disabled={!redoableRef.value}>
                      重做
                    </a-button>
                  )}
                </div>
              ) : null}
            </div>
          )}
        </>
      )
    }

    return () => {
      return (
        <div
          class={{
            [`${baseClassName}-picker`]: true,
            [`${baseClassName}-picker-sm`]: props.size === 'small',
            [`${baseClassName}-picker-md`]: props.size === 'middle',
            [`${baseClassName}-picker-lg`]: props.size === 'large'
          }}
          ref={(e) => (selfRef.value = e)}
        >
          <Popover
            ref={(e) => (popoverRef.value = e)}
            trigger="click"
            placement="right"
            get-popup-container={() => selfRef.value}
            visible={mergedShowRef.value}
            overlayClassName={`${baseClassName}-picker-popover`}
            content={renderPanel()}
          >
            <ColorPickerTrigger
              ref={(e) => (trigger.value = e)}
              clsPrefix={baseClassName}
              size={props.size || 'middle'}
              value={mergedValueRef.value}
              hsla={hslaRef.value}
              onClick={() => !props.readonly && handleTriggerClick()}
            >
              {{
                label: slots.label
              }}
            </ColorPickerTrigger>
          </Popover>
        </div>
      )
    }
  }
})
