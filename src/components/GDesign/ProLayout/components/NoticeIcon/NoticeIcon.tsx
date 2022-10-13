import type { CSSProperties, ExtractPropTypes } from 'vue'
import { computed, defineComponent, ref } from 'vue'
import { Tabs, Badge, Dropdown, Spin } from 'ant-design-vue'
import { BellOutlined } from '@ant-design/icons-vue'
import { getPrefixCls } from '@gx-admin/utils'
import { PropTypes } from '@/utils'
import NoticeList, { NoticeIconItem, NoticeIconTabProps } from './NoticeList'

import './index.less'

const TabPane = Tabs.TabPane

export const noticeIconProps = {
  class: PropTypes.string,
  count: PropTypes.number,
  loading: PropTypes.looseBool,
  onClear: Function as PropType<(tabName: string, tabKey: string) => void>,
  onItemClick: Function as PropType<(item: NoticeIconItem, tabProps: NoticeIconTabProps) => void>,
  onViewMore: Function as PropType<(tabProps: NoticeIconTabProps, e: MouseEvent) => void>,
  onTabChange: Function as PropType<(tabTile: string) => void>,
  style: {
    type: Object as PropType<CSSProperties>,
    default: () => undefined
  },
  onPopupVisibleChange: Function as PropType<(visible: boolean) => void>,
  popupVisible: PropTypes.looseBool,
  clearText: PropTypes.string,
  viewMoreText: PropTypes.string,
  clearClose: PropTypes.looseBool,
  emptyImage: PropTypes.string
}

export type NoticeIconProps = Partial<ExtractPropTypes<typeof noticeIconProps>>

const NoticeIcon = defineComponent({
  props: noticeIconProps,
  Tab: NoticeList,
  emits: ['onClear', 'onTabChange', 'onItemClick', 'onViewMore', 'onPopupVisibleChange'],
  setup(props, { emit, slots }) {
    const prefixCls = getPrefixCls({
      suffixCls: 'notice',
      isPor: true
    })

    const visible = ref(props.popupVisible || false)

    const activeKey = ref('notification')

    const getChildrenSlots: any = computed(() =>
      slots.default?.().length === 1 &&
      (String(slots.default?.()[0].type) === String(Symbol('Fragment')) ||
        String(slots.default?.()[0].type) === String(Symbol()))
        ? slots.default?.()[0].children || []
        : slots.default?.() || []
    )

    const onChange = (value: boolean) => {
      visible.value = value
      emit('onPopupVisibleChange', value)
    }

    const onTabChange = (key) => {
      activeKey.value = key
      props.onTabChange && props.onTabChange(key)
    }

    const NoticeBellIcon = <BellOutlined class={`${prefixCls}-icon`} />

    const trigger = computed(() => (
      <span
        class={{
          [`${prefixCls}-button`]: true,
          [`${props.class}`]: props.class,
          [`opened`]: visible.value
        }}
        onClick={() => onChange(true)}
      >
        <Badge count={props.count} style={{ boxShadow: 'none' }} class={`${prefixCls}-badge`}>
          {NoticeBellIcon}
        </Badge>
      </span>
    ))

    const notificationBoxRender = () => {
      const { loading, onClear, onItemClick, onViewMore, clearText, viewMoreText } = props

      return (
        <Spin spinning={loading} delay={300}>
          <Tabs class={`${prefixCls}-tabs`} activeKey={activeKey.value} onChange={onTabChange}>
            {getChildrenSlots.value.map((item: any) => {
              if (!item) {
                return null
              }

              const { list, title, count, tabKey, showClear, showViewMore, emptyText } = item.props
              const len = list && list.length ? list.length : 0
              const msgCount = count || count === 0 ? count : len
              const tabTitle: string = msgCount > 0 ? `${title} (${msgCount})` : title
              return (
                <TabPane tab={tabTitle} key={tabKey}>
                  <NoticeList
                    clearText={clearText}
                    viewMoreText={viewMoreText}
                    list={list}
                    tabKey={tabKey}
                    onClear={(): void => onClear && onClear(title, tabKey)}
                    onClick={(el): void => onItemClick && onItemClick(el, item.props)}
                    onViewMore={(event): void => onViewMore && onViewMore(item.props, event)}
                    emptyText={emptyText}
                    showClear={showClear}
                    showViewMore={showViewMore}
                    title={title}
                  />
                </TabPane>
              )
            })}
          </Tabs>
        </Spin>
      )
    }

    return () => {
      return (
        <>
          {getChildrenSlots.value.length > 0 ? (
            <Dropdown
              placement="bottomRight"
              trigger={['click']}
              overlay={notificationBoxRender()}
              overlayClassName={`gx-pro-dropdown-container ${prefixCls}-popover`}
              onVisibleChange={() => onChange}
            >
              {trigger.value}
            </Dropdown>
          ) : (
            trigger.value
          )}
        </>
      )
    }
  }
})

NoticeIcon.defaultProps = {
  emptyImage: 'https://gw.alipayobjects.com/zos/rmsportal/wAhyIChODzsoKIOBHcBk.svg'
}

export default NoticeIcon
