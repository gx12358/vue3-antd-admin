import { defineComponent, ExtractPropTypes } from 'vue'
import { Tag } from 'ant-design-vue'
import { tagSelectOptionProps } from './props'

const { CheckableTag } = Tag

export type TagSelectOptionProps = Partial<ExtractPropTypes<typeof tagSelectOptionProps>>

const GTagSelectOption = defineComponent({
  name: 'GTagSelectOption',
  props: tagSelectOptionProps,
  inheritAttrs: false,
  setup(props, { slots }) {
    return () => (
      <CheckableTag
        checked={!!props.checked}
        key={props.value}
        onChange={(state) => props.onChange && props.onChange(props.value || '', state)}
      >
        {slots.default?.()}
      </CheckableTag>
    )
  }
})

GTagSelectOption.isTagSelectOption = true

export default GTagSelectOption
