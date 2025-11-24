import type { CSSProperties } from 'vue'
import { useThemeContext } from '@gx-design-vue/context'
import { unit, useProConfigContext, useProStyle } from '@gx-design-vue/pro-provider'
import { classNames as cx, getPrefixCls } from '@gx-design-vue/pro-utils'
import { computed, defineComponent } from 'vue'
import { DEFAULT_ICON_COLOR, PRESET_FILE_ICONS } from './config'
import { fileTypeIconProps } from './props'
import { genFileTypeIconStyle } from './style'

const GFileTypeIcon = defineComponent({
  name: 'GFileTypeIcon',
  inheritAttrs: false,
  props: fileTypeIconProps(),
  setup(props, { attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'file-type-icon'
    })

    const themeContext = useThemeContext()
    const configContext = useProConfigContext()

    const { wrapSSR, hashId } = useProStyle('FileTypeIcon', [genFileTypeIconStyle], baseClassName)

    const isMono = computed(() => props.variant === 'mono')
    const token = computed(() => configContext?.token?.value)

    const nameState = computed(() => {
      const nameStr = props.name || ''
      const match = nameStr.match(/^(.*)\.([^.]+)$/)
      return {
        namePrefix: match ? match[1] : nameStr,
        nameSuffix: match ? match[2]?.toLowerCase() || '' : ''
      }
    })

    const filetypeShort = computed(() => {
      const filetype = nameState.value.nameSuffix
      return filetype && filetype.length > 4 ? filetype.slice(0, 4) : filetype
    })

    const presetFileIcon = computed(() => {
      return PRESET_FILE_ICONS.find(el => el.ext.includes(nameState.value.nameSuffix))
    })

    const fontSize = computed(() => {
      if (filetypeShort.value && filetypeShort.value.length > 3) {
        return 24 / (4 + (filetypeShort.value.length - 3))
      }
      return 6
    })

    const iconColor = computed(() => {
      return isMono.value
        ? themeContext?.isDark?.value
          ? token.value?.colorFill
          : token.value?.colorBgContainer
        : props.color || presetFileIcon.value?.color || DEFAULT_ICON_COLOR
    })

    return () => {
      return wrapSSR(
        <div class={cx(baseClassName, attrs.class, hashId.value)} style={{ width: props.size, height: props.size }}>
          <svg
            height={props.size}
            viewBox="0 0 24 24"
            width={props.size}
            xmlns="http://www.w3.org/2000/svg"
            {...attrs}
            class={cx(`${baseClassName}-svg`, attrs.class, hashId.value)}
            style={attrs.style as CSSProperties}
          >
            <path d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z" fill={iconColor.value} />
            <path
              d="M14 2l6 6h-4a2 2 0 01-2-2V2z"
              fill={isMono.value ? token.value?.colorFill : '#fff'}
              fill-opacity=".5"
            />
             {filetypeShort.value && !presetFileIcon.value?.icon && (
               <text
                 fill={isMono.value ? token.value?.colorTextSecondary : '#fff'}
                 font-size={fontSize.value}
                 font-weight="bold"
                 text-anchor="middle"
                 x="50%"
                 y="70%"
               >
                 {filetypeShort.value.toUpperCase()}
               </text>
             )}
            <path
              d="M6 2a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6H6z"
              fill="transparent"
              stroke={token.value?.colorFillSecondary}
              stroke-width={0.5}
            />
          </svg>
          {presetFileIcon.value?.icon && (
            <img
              alt={props.name}
              height={props.size / 2}
              src={presetFileIcon.value?.icon}
              style={{ position: 'absolute', top: unit(props.size / 3) }}
              width={props.size / 2}
            />
          )}
        </div>
      )
    }
  }
})

export default GFileTypeIcon
