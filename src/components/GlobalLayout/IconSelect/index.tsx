import type { SlotsType } from 'vue'
import { useMergedState, useState } from '@gx-design-vue/pro-hooks'
import { unit } from '@gx-design-vue/pro-provider'
import { classNames } from '@gx-design-vue/pro-utils'
import { useElementSize } from '@vueuse/core'
import { Input, Popover, TabPane, Tabs } from 'ant-design-vue'
import { noop } from 'lodash-es'
import IconMap from '@/assets/icon-font/menu/iconfont.json'
import styles from './style.module.less'

type ChangeValue = (value?: string) => void

export interface IconSelectProps {
  value?: string;
  defaultValue?: string;
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
  name: string;
  fontFamily: string;
  className: string;
}

export function getIconfontArrary(value: any) {
  const prefix = value.css_prefix_text
  const fontFamily = value.font_family

  return value.glyphs.map(item => ({
    id: item.icon_id,
    name: item.name,
    fontFamily,
    className: `${prefix}${item.font_class}`
  }))
}

const icons: IconFontItem[] = getIconfontArrary(IconMap)

const IconSelectModal = defineComponent<IconSelectProps>({
  name: 'IconSelectModal',
  props: {
    value: {
      type: String as PropType<IconSelectProps['value']>,
      required: true
    },
    defaultValue: {
      type: String as PropType<IconSelectProps['defaultValue']>,
      default: ''
    },
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
    default(fontFamily?: string): void
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

    const currentIcon = computed(() => {
      const systemIcon = icons.find(item => item.className === value.value)
      if (systemIcon) return systemIcon

      let extraIcon
      if (props.extraTabs) {
        props.extraTabs.forEach((item) => {
          item.icons.forEach((icon) => {
            if (icon.className === value.value) {
              extraIcon = icon
            }
          })
        })
      }
      return extraIcon
    })

    const { width } = useElementSize(triggerRef)

    return () => {
      const children = slots.default
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
                content={(
                  <div class={classNames(styles.iconSelectModal)}>
                    <Tabs
                      tab-position="left"
                      activeKey={activeKey.value}
                      onChange={val => setActiveKey(val as any)}
                      tabBarStyle={{ padding: 0 }}
                    >
                      <TabPane key="system" tab="公共菜单" class="p-0">
                        <div class="grid grid-cols-4 gap-10px">
                          {icons.map(icon => (
                            <div
                              class={classNames(
                                'cursor-pointer flex items-center px-8px gap-8px text-12px hover:bg-primary hover:text-[#fff] duration-100 rd-8px h-28px',
                                value.value === icon.className ? 'bg-primary text-[#fff]' : 'bg-white'
                              )}
                              onClick={() => {
                                setValue(icon.className)
                              }}
                            >
                              <span class={classNames(icon.fontFamily, icon.className)} />
                              <span class="text-hidden-1 text-12px">{icon.name}</span>
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
                                  'cursor-pointer flex items-center px-8px gap-8px text-12px hover:bg-primary hover:text-[#fff] duration-100 rd-8px h-28px',
                                  value.value === icon.className ? 'bg-primary text-[#fff]' : 'bg-white'
                                )}
                                onClick={() => {
                                  setValue(icon.className)
                                }}
                              >
                                <span class={classNames(icon.fontFamily, icon.className)} />
                                <span class="text-hidden-1 text-12px">{icon.name}</span>
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
                  children
                    ? children(currentIcon.value?.fontFamily)
                    : (
                      <div class={classNames(styles.iconSelectTrigger)}>
                        <Input
                          value={value.value}
                          readonly
                          placeholder="点击选择图标"
                          prefix={value.value && (
                            <span class={classNames(value.value, currentIcon.value?.fontFamily)} style={{ marginRight: '8px' }} />
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

export default IconSelectModal
