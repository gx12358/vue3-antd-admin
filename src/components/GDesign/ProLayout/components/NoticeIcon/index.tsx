import { computed, defineComponent, onMounted, reactive } from 'vue'
import dayjs from 'dayjs'
import { groupBy } from 'lodash-es'
import { message } from 'ant-design-vue'
import { getNotices } from '@/services/notices'
import type { NoticeIconItem } from './NoticeList'
import NoticeIcon from './NoticeIcon'

const getNoticeData = (notices: NoticeIconItem[]): Record<string, NoticeIconItem[]> => {
  if (!notices || notices.length === 0 || !Array.isArray(notices)) {
    return {}
  }

  const newNotices = notices.map((notice) => {
    const newNotice = { ...notice }

    if (newNotice.datetime) {
      newNotice.datetime = dayjs(notice.datetime as string).fromNow()
    }

    if (newNotice.id) {
      newNotice.key = newNotice.id
    }

    return newNotice
  })
  return groupBy(newNotices, 'type')
}

const getUnreadData = (noticeData: Record<string, NoticeIconItem[]>) => {
  const unreadMsg: Record<string, number> = {}
  Object.keys(noticeData).forEach((key) => {
    const value = noticeData[key]

    if (!unreadMsg[key]) {
      unreadMsg[key] = 0
    }

    if (Array.isArray(value)) {
      unreadMsg[key] = value.filter((item) => !item.read).length
    }
  })
  return unreadMsg
}

const NoticeIconView = defineComponent({
  setup() {
    const state = reactive({
      notices: [] as NoticeIconItem[]
    })

    onMounted(async () => {
      const response = await getNotices()
      if (response) {
        state.notices = response.data || []
      }
    })

    const noticeData = computed(() => getNoticeData(state.notices))

    const unreadMsg = computed(() => getUnreadData(noticeData.value) || {})

    const changeReadState = (id: string) => {
      state.notices = state.notices.map((item) => {
        const notice = { ...item }
        if (notice.id === id) {
          notice.read = true
        }
        return notice
      })
    }

    const clearReadState = (title: string, key: string) => {
      state.notices = state.notices.map((item) => {
        const notice = { ...item }
        if (notice.type === key) {
          notice.read = true
        }
        return notice
      })
      message.success(`${'清空了'} ${title}`)
    }

    return () => {
      return (
        <NoticeIcon
          class="gx-pro-right-content-action"
          count={
            unreadMsg.value && unreadMsg.value.notification
              ? unreadMsg.value.notification + unreadMsg.value.message + unreadMsg.value.event
              : 0
          }
          onItemClick={(item) => {
            changeReadState(item.id!)
          }}
          onClear={(title: string, key: string) => clearReadState(title, key)}
          loading={false}
          clearText="清空"
          viewMoreText="查看更多"
          onViewMore={() => message.info('Click on view more')}
          clearClose
        >
          <NoticeIcon.Tab
            tabKey="notification"
            count={unreadMsg.value.notification}
            list={noticeData.value.notification}
            title="通知"
            emptyText="你已查看所有通知"
            showViewMore
          />
          <NoticeIcon.Tab
            tabKey="message"
            count={unreadMsg.value.message}
            list={noticeData.value.message}
            title="消息"
            emptyText="您已读完所有消息"
            showViewMore
          />
          <NoticeIcon.Tab
            tabKey="event"
            title="待办"
            emptyText="你已完成所有待办"
            count={unreadMsg.value.event}
            list={noticeData.value.event}
            showViewMore
          />
        </NoticeIcon>
      )
    }
  }
})

export default NoticeIconView
