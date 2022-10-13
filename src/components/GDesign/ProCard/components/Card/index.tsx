import type { Ref, CSSProperties, VNode } from 'vue'
import { defineComponent, ref, computed, cloneVNode, watch } from 'vue'
import { Grid, Tabs } from 'ant-design-vue'
import { RightOutlined } from '@ant-design/icons-vue'
import { isArray } from '@/utils/validate'
import { getPrefixCls, getSlotVNode } from '@gx-admin/utils'
import { LabelIconTip } from '@gx-design/utils'
import type { Gutter, CardProps } from '../../typings'
import { cardProps } from '../../props'
import Loading from '../Loading'
import Actions from '../Actions'

import './style.less'

const { useBreakpoint } = Grid

const ProCard = defineComponent({
  name: 'GProCard',
  inheritAttrs: false,
  props: cardProps,
  emits: ['collapse'],
  setup(props, { emit, slots, attrs }) {
    const baseClassName = getPrefixCls({
      suffixCls: 'card',
      isPor: true
    })

    const screens = useBreakpoint()

    const collapsed: Ref<boolean> = ref(false)

    watch(
      () => props.collapsed,
      (value: boolean) => {
        collapsed.value = value
      },
      {
        deep: true,
        immediate: true
      }
    )

    // 顺序决定如何进行响应式取值，按最大响应值依次取值，请勿修改。
    const responsiveArray: Breakpoint[] = ['xxl', 'xl', 'lg', 'md', 'sm', 'xs']

    const onCollapse = (val: boolean) => {
      collapsed.value = val
      emit('collapse', val)
    }

    const childrenModified = (data: any[]) => {
      const childrenArray =
        data.length === 1 &&
        (String(data[0].type) === String(Symbol('Fragment')) ||
          String(data[0].type) === String(Symbol())) &&
        data[0].children
          ? data[0].children
          : data
      if (isArray(childrenArray)) {
        return childrenArray.map((element: any, index) => {
          if (isProCard(element)) {
            containProCard.value = true

            // 宽度
            const colSpan = element.props?.colSpan || ''
            const { span, colSpanStyle } = getColSpanStyle(colSpan)

            const columnClassName = {
              [`${baseClassName}-col`]: true,
              [`${baseClassName}-split-vertical`]:
                props.split === 'vertical' && index !== childrenArray.length - 1,
              [`${baseClassName}-split-horizontal`]:
                props.split === 'horizontal' && index !== childrenArray.length - 1,
              [`${baseClassName}-col-${span}`]: typeof span === 'number' && span >= 0 && span <= 24
            }

            return (
              <div
                style={{
                  ...colSpanStyle,
                  ...getStyle(normalizedGutter.value[0]! > 0, {
                    paddingRight: `${normalizedGutter.value[0] / 2}px`,
                    paddingLeft: `${normalizedGutter.value[0] / 2}px`
                  }),
                  ...getStyle(normalizedGutter.value[1]! > 0, {
                    paddingTop: `${normalizedGutter.value[1] / 2}px`,
                    paddingBottom: `${normalizedGutter.value[1] / 2}px`
                  })
                }}
                key={`pro-card-col-${index}`}
                class={columnClassName}
              >
                {cloneVNode(element)}
              </div>
            )
          }
          return element
        })
      }
      return childrenArray
    }

    /**
     * 根据响应式获取 gutter, 参考 antd 实现
     *
     * @param gutter Gutter
     */
    const getNormalizedGutter = (gut: Gutter | Gutter[]) => {
      const results: [number, number] = [0, 0]
      const normalizedGutter = Array.isArray(gut) ? gut : [gut, 0]
      normalizedGutter.forEach((g, index) => {
        if (typeof g === 'object') {
          for (let i = 0; i < responsiveArray.length; i += 1) {
            const breakpoint: Breakpoint = responsiveArray[i]
            if (screens.value[breakpoint] && g[breakpoint] !== undefined) {
              results[index] = g[breakpoint] as number
              break
            }
          }
        } else {
          results[index] = g || 0
        }
      })
      return results
    }

    /**
     * 根据条件返回 style，负责返回空对象
     *
     * @param withStyle 是否符合条件
     * @param appendStyle 如果符合条件要返回的 style 属性
     */
    const getStyle = (withStyle: boolean, appendStyle: CSSProperties) => {
      return withStyle ? appendStyle : {}
    }

    const getColSpanStyle = (colSpan: CardProps['colSpan']) => {
      let span = colSpan

      // colSpan 响应式
      if (typeof colSpan === 'object') {
        for (let i = 0; i < responsiveArray.length; i += 1) {
          const breakpoint: Breakpoint = responsiveArray[i]
          if (screens.value[breakpoint] && colSpan[breakpoint] !== undefined) {
            span = colSpan[breakpoint]
            break
          }
        }
      }

      // 当 colSpan 为 30% 或 300px 时
      const colSpanStyle = getStyle(typeof span === 'string' && /\d%|\dpx/i.test(span), {
        width: span as string,
        flexShrink: 0
      })

      return { span, colSpanStyle }
    }

    const normalizedGutter = computed(() => getNormalizedGutter(props.gutter || 0))

    // 判断是否套了卡片，如果套了的话将自身卡片内部内容的 padding 设置为0
    const containProCard: Ref<boolean> = ref(false)

    const isProCard = (node) => {
      return node && node.type && (node.type.isProCard || node.type.name === 'GProCard')
    }

    const actionsArray = computed(() => {
      return (getSlotVNode<VNode[]>(slots, props, 'actions') || []).map((element) => {
        return <>{cloneVNode(element)}</>
      })
    })

    const cardCls = computed(() => {
      return {
        [`${attrs.class}`]: !!attrs.class,
        [`${baseClassName}`]: true,
        [`${baseClassName}-border`]: props.bordered,
        [`${baseClassName}-contain-card`]: containProCard.value,
        [`${baseClassName}-loading`]: getSlotVNode(slots, props, 'loading'),
        [`${baseClassName}-split`]: props.split === 'vertical' || props.split === 'horizontal',
        [`${baseClassName}-ghost`]: props.ghost,
        [`${baseClassName}-hoverable`]: props.hoverable,
        [`${baseClassName}-alway-hoverable`]: props.alwaysHoverable,
        [`${baseClassName}-size-${props.size}`]: props.size,
        [`${baseClassName}-type-${props.type}`]: props.type,
        [`${baseClassName}-collapse`]: collapsed.value
      }
    })

    const bodyCls = computed(() => {
      return {
        [`${baseClassName}-body`]: true,
        [`${baseClassName}-body-center`]: props.layout === 'center',
        [`${baseClassName}-body-direction-column`]:
          props.split === 'horizontal' || props.direction === 'column',
        [`${baseClassName}-body-wrap`]: props.wrap && containProCard.value
      }
    })

    const cardBodyStyle = computed(() => {
      return {
        ...getStyle(normalizedGutter.value[0]! > 0, {
          marginRight: `-${normalizedGutter.value[0] / 2}px`,
          marginLeft: `-${normalizedGutter.value[0] / 2}px`
        }),
        ...getStyle(normalizedGutter.value[1]! > 0, {
          marginTop: `-${normalizedGutter.value[1] / 2}px`,
          marginBottom: `-${normalizedGutter.value[1] / 2}px`
        }),
        ...props.bodyStyle
      }
    })

    const loadingRender = slots.loading?.() || (
      <Loading
        prefix={baseClassName}
        style={
          props.bodyStyle?.padding === 0 || props.bodyStyle?.padding === '0px'
            ? { padding: 24 }
            : undefined
        }
      />
    )

    // 非受控情况下展示
    const collapsibleButton = computed(
      () =>
        props.collapsible &&
        props.collapsed === undefined && (
          <RightOutlined
            rotate={!collapsed.value ? 90 : undefined}
            class={`${baseClassName}-collapsible-icon`}
          />
        )
    )

    return () => {
      return (
        <div class={cardCls.value} style={{ ...((attrs.style as any) || {}) }}>
          {(props.title || props.extra || collapsibleButton.value) && (
            <div
              class={{
                [`${baseClassName}-header`]: true,
                [`${baseClassName}-header-border`]: props.headerBordered || props.type === 'inner',
                [`${baseClassName}-header-collapsible`]: collapsibleButton.value
              }}
              style={props.headStyle}
              onClick={() => {
                if (collapsibleButton.value) onCollapse(!collapsed.value)
              }}
            >
              <div class={`${baseClassName}-title`}>
                {collapsibleButton.value}
                <LabelIconTip
                  label={getSlotVNode(slots, props, 'title')}
                  tooltipText={getSlotVNode(slots, props, 'tooltipText')}
                  tooltipIcon={getSlotVNode(slots, props, 'tooltipIcon')}
                  subTitle={getSlotVNode(slots, props, 'subTitle')}
                />
              </div>
              <div class={`${baseClassName}-extra`}>{getSlotVNode(slots, props, 'extra')}</div>
            </div>
          )}
          {props.tabs ? (
            <div class={`${baseClassName}-tabs`}>
              <Tabs onChange={props.tabs?.onChange} {...props.tabs}>
                {getSlotVNode(slots, props, 'loading') ? loadingRender : slots.default?.()}
              </Tabs>
            </div>
          ) : (
            <div class={bodyCls.value} style={cardBodyStyle.value}>
              {getSlotVNode(slots, props, 'loading')
                ? loadingRender
                : childrenModified(slots.default?.() || [])}
            </div>
          )}
          {<Actions actions={actionsArray.value} prefixCls={baseClassName} />}
        </div>
      )
    }
  }
})

ProCard.isProCard = true

export default ProCard
