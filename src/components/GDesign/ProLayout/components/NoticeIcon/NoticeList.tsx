import type { FunctionalComponent as FC, CSSProperties } from 'vue'
import { Tag, List, Avatar } from 'ant-design-vue'

import styles from './NoticeList.module.less'

export type NoticeIconItemType = 'notification' | 'message' | 'event'

export type NoticeIconItem = {
  props?: any
  id?: string
  extra?: string
  key?: string
  read?: boolean
  avatar?: string
  title?: string
  status?: string
  datetime?: string
  description?: string
  type?: NoticeIconItemType
}

export type NoticeIconTabProps = {
  count?: number
  showClear?: boolean
  showViewMore?: boolean
  style?: CSSProperties
  title: string
  tabKey: NoticeIconItemType
  onClick?: (item: NoticeIconItem) => void
  onClear?: () => void
  emptyText?: string
  clearText?: string
  viewMoreText?: string
  list: NoticeIconItem[]
  onViewMore?: (e: any) => void
}

const NoticeListExtra = (extra, status) => {
  const color = {
    todo: '',
    processing: 'blue',
    urgent: 'red',
    doing: 'gold'
  }[status]

  return (
    extra && (
      <Tag
        color={color}
        style={{
          marginRight: 0
        }}
      >
        {extra}
      </Tag>
    )
  )
}

const NoticeList: FC<NoticeIconTabProps> = ({
  list = [],
  onClick,
  onClear,
  title,
  onViewMore,
  emptyText,
  showClear = true,
  clearText,
  viewMoreText,
  showViewMore = false
}) => {
  if (!list || list.length === 0) {
    return (
      <div class={styles['notFound']}>
        <img
          src="https://gw.alipayobjects.com/zos/rmsportal/sAuJeJzSKbUmHfBQRzmZ.svg"
          alt="not found"
        />
        <div>{emptyText}</div>
      </div>
    )
  }

  return (
    <div>
      <List
        class={styles['list']}
        dataSource={list}
        renderItem={({ item, index }) => {
          const itemCls = {
            [`${styles['item']}`]: true,
            [`${styles['read']}`]: item.read
          }
          const leftIcon = item.avatar ? (
            typeof item.avatar === 'string' ? (
              <Avatar class={styles['avatar']} src={item.avatar} />
            ) : (
              <span class={styles['iconElement']}>{item.avatar}</span>
            )
          ) : null

          return (
            <List.Item
              class={itemCls}
              key={item.key || index}
              onClick={() => {
                onClick?.(item)
              }}
            >
              <List.Item.Meta
                class={styles['meta']}
                avatar={leftIcon}
                title={
                  <div class={styles['title']}>
                    {item.title}
                    {item.extra && (
                      <div class={styles.extra}>{NoticeListExtra(item.extra, item.status)}</div>
                    )}
                  </div>
                }
                description={
                  <div>
                    <div class={styles['description']}>{item.description}</div>
                    <div class={styles['datetime']}>{item.datetime}</div>
                  </div>
                }
              />
            </List.Item>
          )
        }}
      />
      <div class={styles['bottomBar']}>
        {showClear ? (
          <div onClick={onClear}>
            {clearText} {title}
          </div>
        ) : null}
        {showViewMore ? (
          <div
            onClick={(e) => {
              if (onViewMore) {
                onViewMore(e)
              }
            }}
          >
            {viewMoreText}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default NoticeList
