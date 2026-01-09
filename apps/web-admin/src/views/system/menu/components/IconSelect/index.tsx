import type { SemanticClassNames, SemanticStyles } from '@gx-design-vue/pro-utils'
import type { CSSProperties, SlotsType } from 'vue'
import { useMergedState, useState } from '@gx-design-vue/pro-hooks'
import { unit } from '@gx-design-vue/pro-provider'
import { classNames, getSlot } from '@gx-design-vue/pro-utils'
import { GIcon, icons } from '@gx/design'
import { useElementSize } from '@vueuse/core'
import { Input, Popover, TabPane, Tabs } from 'ant-design-vue'
import { noop } from 'lodash-es'
import styles from './style.module.less'

type SemanticName = 'root' | 'input' | 'inputPrefix'

type StylesType = SemanticStyles<SemanticName>

type ClassNamesType = SemanticClassNames<SemanticName>

type ChangeValue = (value?: any) => void

export interface IconSelectProps {
  value?: any;
  styles?: StylesType;
  classNames?: ClassNamesType;
  placeholder?: string;
  defaultValue?: any;
  parentRef?: HTMLDivElement;
  extraTabs?: IconTabsItem[];
  onChange?: ChangeValue;
  'onUpdate:value'?: ChangeValue;
}

export interface IconTabsItem {
  key: string;
  tab: string;
  icons: IconFontItem[]
}

export interface IconFontItem {
  id: string;
  type: any;
  class?: string;
  style?: CSSProperties;
  // 如果是iconfont图标，需要填写
  fontFamily?: string;
}

export function getIconfontArrary(value: any): IconFontItem[] {
  const prefix = value.css_prefix_text
  const fontFamily = value.font_family

  return value.glyphs?.map(item => ({
    id: item.icon_id,
    fontFamily,
    type: `${prefix}${item.font_class}`
  })) || []
}

const localIcons: IconFontItem[] = Object.keys(icons).map((item) => {
  return {
    id: item,
    type: item
  }
})

const IconSelect = defineComponent<IconSelectProps>({
  name: 'IconSelect',
  props: {
    value: {
      type: String as PropType<IconSelectProps['value']>,
      required: true
    },
    defaultValue: {
      type: String as PropType<IconSelectProps['defaultValue']>,
      default: ''
    },
    styles: Object as PropType<IconSelectProps['styles']>,
    classNames: Object as PropType<IconSelectProps['classNames']>,
    placeholder: String as PropType<string>,
    parentRef: {
      type: [ Object ] as PropType<IconSelectProps['parentRef']>
    },
    extraTabs: {
      type: Array as PropType<IconSelectProps['extraTabs']>,
      default: () => []
    },
    onChange: {
      type: Function as PropType<IconSelectProps['onChange']>,
      default: () => noop
    },
    'onUpdate:value': {
      type: Function as PropType<IconSelectProps['onUpdate:value']>,
      default: () => noop
    }
  },
  slots: Object as SlotsType<{
    default(currentIcon?: IconFontItem | undefined): void
  }>,
  emits: {
    change: (_value: string) => true,
    'update:value': (_value: string) => true
  },
  setup(props, { slots }) {
    const [ open, setOpen ] = useState(false)
    const [ value, setValue ] = useMergedState(props.defaultValue ?? '', {
      value: toRef(props, 'value'),
      onChange: (val) => {
        props.onChange?.(val)
        props['onUpdate:value']?.(val)
      }
    })

    const [ activeKey, setActiveKey ] = useState('system')

    const triggerRef = ref()

    const currentIcon = computed<IconFontItem | undefined>(() => {
      const systemIcon = localIcons.find(item => item.type === value.value)
      if (systemIcon) return systemIcon

      let extraIcon
      if (props.extraTabs) {
        props.extraTabs.forEach((item) => {
          item.icons.forEach((icon) => {
            if (icon.type === value.value) {
              extraIcon = icon
            }
          })
        })
      }
      return extraIcon
    })

    const { width } = useElementSize(triggerRef)

    return () => {
      const children = getSlot({ slots, props, key: 'default' })

      return (
        <>
          <div ref={triggerRef} class="w-full" />
          {
            width.value && (
              <Popover
                open={open.value}
                onOpenChange={setOpen}
                trigger="click"
                placement="bottom"
                arrow={false}
                overlayStyle={{ width: unit(width.value) }}
                getPopupContainer={el => el.parentNode as HTMLElement}
                content={(
                  <div class={classNames(styles.iconSelectModal)}>
                    <Tabs
                      tab-position="left"
                      activeKey={activeKey.value}
                      onChange={val => setActiveKey(val as any)}
                      tabBarStyle={{ padding: 0 }}
                    >
                      <TabPane key="system" tab="系统" class="p-0">
                        <div class="grid grid-cols-8 gap-10px">
                          {localIcons.map(icon => (
                            <div
                              class={classNames(
                                'cursor-pointer flex-center px-8px gap-8px text-16px hover:bg-primary hover:text-[#fff] duration-100 rd-8px h-28px',
                                value.value === icon.type ? 'bg-primary text-[#fff]' : 'bg-[#fff]', icon.class
                              )}
                              style={icon.style}
                              onClick={() => setValue(icon.type)}
                            >
                              <GIcon type={icon.type} />
                            </div>
                          ))}
                        </div>
                      </TabPane>
                      {props.extraTabs?.map(item => (
                        <TabPane key={item.key} tab={item.tab}>
                          <div class="grid grid-cols-4 gap-10px">
                            {item.icons?.map(icon => (
                              <div
                                class={classNames(
                                  'cursor-pointer flex items-center px-8px gap-8px text-16px hover:bg-primary hover:text-[#fff] duration-100 rd-8px h-28px',
                                  value.value === icon.type ? 'bg-primary text-[#fff]' : 'bg-[#fff]', icon.class
                                )}
                                style={icon.style}
                                onClick={() => setValue(icon.type)}
                              >
                                {
                                  icon.fontFamily
                                    ? <span class={classNames(icon.fontFamily, icon.type)} />
                                    : <GIcon type={icon.type} />
                                }
                              </div>
                            ))}
                          </div>
                        </TabPane>
                      ))}
                    </Tabs>
                  </div>
                )}
              >
                {
                  children && typeof children === 'function'
                    ? children(currentIcon.value)
                    : (
                      <div class={classNames(styles.iconSelectTrigger, props.classNames?.root)} style={props.styles?.root}>
                        <Input
                          class={props.classNames?.input}
                          style={props.styles?.input}
                          value={value.value}
                          readonly
                          placeholder={props.placeholder || '点击选择图标'}
                          prefix={value.value && currentIcon.value && (
                            <>
                              {
                                currentIcon.value?.fontFamily
                                  ? <span class={classNames(value.value, currentIcon.value?.fontFamily, props.classNames?.inputPrefix)} style={props.styles?.inputPrefix} />
                                  : <GIcon class={props.classNames?.inputPrefix} type={value.value} style={props.styles?.inputPrefix} />
                              }
                            </>
                          )}
                        />
                      </div>
                    )
                }
              </Popover>
            )
          }
        </>
      )
    }
  }
})

export default IconSelect
