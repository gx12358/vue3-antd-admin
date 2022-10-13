import { ref } from 'vue'
import { AutoComplete, Input } from 'ant-design-vue'
import type { AutoCompleteProps } from 'ant-design-vue/es/auto-complete'
import { SearchOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'

export type HeaderSearchProps = {
  onSearch?: (value?: string) => void
  onChange?: (value?: string) => void
  onVisibleChange?: (b: boolean) => void
  placeholder?: string
  options: AutoCompleteProps['options']
  defaultVisible?: boolean
  visible?: boolean
  defaultValue?: string
  value?: string
}

const hearderSearchProps = {
  onSearch: Function as PropType<HeaderSearchProps['onSearch']>,
  onChange: Function as PropType<HeaderSearchProps['onChange']>,
  onVisibleChange: Function as PropType<HeaderSearchProps['onVisibleChange']>,
  placeholder: String as PropType<HeaderSearchProps['placeholder']>,
  options: Object as PropType<HeaderSearchProps['options']>,
  defaultVisible: Boolean as PropType<HeaderSearchProps['defaultVisible']>,
  visible: Boolean as PropType<HeaderSearchProps['visible']>,
  defaultValue: String as PropType<HeaderSearchProps['defaultValue']>,
  value: String as PropType<HeaderSearchProps['value']>
}

const HeaderSearch = defineComponent({
  props: hearderSearchProps,
  emit: ['update:value', 'update:visible', 'visibleChange', 'change'],
  setup(props, { emit, attrs }) {
    const baseClass = getPrefixCls({
      suffixCls: 'header-search',
      isPor: true
    })
    const inputRef = ref()
    const value = ref<string>('')
    const searchMode = ref<boolean>(false)

    watchEffect(() => {
      value.value = props.value ?? props.defaultValue
    })

    watchEffect(() => {
      searchMode.value = props.visible ?? props.defaultVisible
    })

    const inputClass = computed(() => {
      return {
        [`${baseClass}-input`]: true,
        [`${baseClass}-show`]: searchMode.value
      }
    })

    const setValue = (val: string) => {
      value.value = val
      emit('change', val)
    }

    const setSearchMode = (val: boolean) => {
      searchMode.value = val
      emit('visibleChange', val)
    }

    return () => (
      <div
        class={{ [`${baseClass}`]: true, [`${attrs.class}`]: true }}
        onClick={() => {
          setSearchMode(true)
          if (searchMode.value && inputRef.value) {
            inputRef.value.focus()
          }
        }}
        onTransitionend={({ propertyName }) => {
          if (propertyName === 'width' && !searchMode.value) {
            if (props.onVisibleChange) {
              emit('visibleChange', searchMode.value)
            }
          }
        }}
      >
        <SearchOutlined
          key="Icon"
          style={{
            cursor: 'pointer'
          }}
        />
        <AutoComplete
          key="AutoComplete"
          class={inputClass.value}
          value={value}
          options={props.options}
          onChange={setValue}
        >
          <Input
            size="small"
            ref={(e) => (inputRef.value = e)}
            defaultValue={props.defaultValue}
            aria-label={props.placeholder}
            placeholder={props.placeholder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                if (props.onSearch) {
                  props.onSearch(value.value)
                }
              }
            }}
            onBlur={() => {
              setSearchMode(false)
            }}
          />
        </AutoComplete>
      </div>
    )
  }
})

HeaderSearch.inheritAttrs = false
export default HeaderSearch
