import type { ComputedRef } from 'vue'
import type { TagsListItem } from '../typings'
import { onMountedOrActivated, useMergedState, useState } from '@gx-design-vue/pro-hooks'
import { useWindowSize } from '@vueuse/core'
import { CheckableTag } from 'ant-design-vue'
import { cloneDeep } from 'lodash-es'
import { defineComponent } from 'vue'

const defaultList: TagsListItem[] = [
  {
    value: '-1',
    label: '全部'
  }
]

const TagsSelect = defineComponent({
  inheritAttrs: false,
  name: 'TagsSelect',
  props: {
    value: [ String, Array ] as VuePropType<string[] | string>,
    data: {
      type: Array as VuePropType<TagsListItem[]>,
      default: () => []
    },
    hideCheckAll: {
      type: Boolean as VuePropType<boolean>,
      default: false
    },
    expandable: {
      type: Boolean as VuePropType<boolean>,
      default: true
    },
    selectType: {
      type: String as VuePropType<'checkbox' | 'radio'>,
      default: 'checkbox'
    },
    'onUpdate:value': Function as VuePropType<(value: string[] | string) => void>,
    onChange: Function as VuePropType<(value: string[] | string) => void>
  },
  emits: [ 'update:value', 'change' ],
  setup(props, { emit }) {
    const checkGroupRef = ref<HTMLDivElement>()

    const { width } = useWindowSize()
    const [ expand, changeExpand ] = useState(false)

    const [ expandOpen, changeExpandOpen ] = useState(false)

    const handleCheckValue = (): string[] => {
      if (props.selectType === 'checkbox')
        return props.value as string[]
      if (props.selectType === 'radio')
        return [ props.value as string ]
    }

    const [ checkValue, changeCheckList ] = useMergedState<string[]>(handleCheckValue, {
      value: computed(() => handleCheckValue()),
      onChange: (val) => {
        const newVal = props.selectType === 'checkbox' ? val : val?.[0] || ''
        props.onChange?.(cloneDeep(newVal))
        emit('update:value', cloneDeep(newVal))
      }
    })

    const dataSouce: ComputedRef<TagsListItem[]> = computed(() => {
      return (props.hideCheckAll || props.selectType === 'radio'
        ? []
        : defaultList).concat(props.data)
    })

    const classNamse = computed(() => {
      return [
        'relative pr-50px overflow-hidden leading-32px transition-all-300 select-none',
        expand.value ? 'max-h-220px' : 'max-h-32px'
      ]
    })

    const changeCheckValue = (value: string, checked: boolean) => {
      if (props.selectType === 'radio') {
        changeCheckList([ value ])
      } else {
        let oldCheckValue = unref(checkValue)
        if (checked) {
          if (value === '-1')
            oldCheckValue = unref(dataSouce).map(item => item.value)
          else oldCheckValue.push(value)
        } else {
          if (value === '-1')
            oldCheckValue = []
          else oldCheckValue = oldCheckValue.filter(item => item !== value)
        }
        const dataValues = oldCheckValue.filter(val => val !== '-1')
        if (dataValues.length === props.data.length)
          changeCheckList(dataValues.concat([ '-1' ]))
        else changeCheckList(dataValues)
      }
    }

    watch(width, () => {
      changeExpandOpen((checkGroupRef.value?.getBoundingClientRect()?.height || 0) > 32)
    })

    onMountedOrActivated(() => {
      setTimeout(() => {
        changeExpandOpen((checkGroupRef.value?.getBoundingClientRect()?.height || 0) > 32)
      }, 100)
    })

    return () => {
      return (
        <div class={classNamse.value}>
          <div ref={checkGroupRef}>
            {dataSouce.value.map(item => (
              <CheckableTag
                style={{ marginRight: '24px', fontSize: '14px' }}
                onChange={checked => changeCheckValue(item.value, checked)}
                checked={checkValue.value.includes(item.value)}
                key={item.value}
              >
                {item.label}
              </CheckableTag>
            ))}
          </div>
          {props.expandable && (
            <a
              class={[ 'absolute right-0px top-0px', expandOpen.value ? '' : 'hidden-none' ]}
              onClick={() => changeExpand(!expand.value)}
            >
              {expand.value ? '收起' : '展开'}
            </a>
          )}
        </div>
      )
    }
  }
})

export default TagsSelect
