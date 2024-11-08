import { getSlotVNode } from '@gx-design-vue/pro-utils'
import { InputSearch } from 'ant-design-vue'
import inputProps from 'ant-design-vue/es/input/inputProps'
import { omit } from 'lodash-es'
import { defineComponent, ref, watch } from 'vue'

const GInputSearch = defineComponent({
  name: 'GInputSearch',
  inheritAttrs: false,
  props: {
    ...omit(inputProps(), [ 'value', 'onUpdate:value' ]),
    value: String as VuePropType<string>,
    onChange: Function as VuePropType<(value: any) => void>,
    placeholder: {
      type: [ String, Number ] as VuePropType<string | number>,
    },
    allowClear: {
      type: [ Boolean ] as VuePropType<boolean>,
    },
    inputPrefixCls: String,
    enterButton: [ Function, Object, Array, String, Number ] as PropType<any>,
  },
  emits: [ 'update:value', 'change' ],
  setup(props, { emit, expose, slots }) {
    const searchValue = ref(props.value)

    watch(
      () => props.value,
      (val) => {
        searchValue.value = val
      },
      {
        deep: true,
        immediate: true
      }
    )

    const handleChange = (e) => {
      searchValue.value = e.target.value
    }
    const handleSearch = (value) => {
      searchValue.value = value
      emit('change', value)
      emit('update:value', value)
    }

    expose({
      changeValue: (value: any) => searchValue.value = value
    })

    return () => {
      const enterButtonRender = getSlotVNode(slots, props, 'enterButton')

      return (
        <InputSearch
          {...omit(props, 'onChange', 'onSearch')}
          value={searchValue.value}
          enterButton={enterButtonRender}
          onChange={handleChange}
          onSearch={handleSearch}
        />
      )
    }
  }
})
export default GInputSearch
