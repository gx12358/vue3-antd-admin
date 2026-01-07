import { defineAsyncComponent } from 'vue'

const components = {
  desktop: defineAsyncComponent(() => import('./Desktop')),
  dashboard: defineAsyncComponent(() => import('./Dashboard')),
  chart: defineAsyncComponent(() => import('./Chart')),
  apps: defineAsyncComponent(() => import('./Apps')),
  chartData: defineAsyncComponent(() => import('./ChartData')),
  table: defineAsyncComponent(() => import('./Table')),
  dataEntry: defineAsyncComponent(() => import('./DataEntry')),
  layout: defineAsyncComponent(() => import('./Layout')),
  function: defineAsyncComponent(() => import('./Function')),
  request: defineAsyncComponent(() => import('./Request')),
  page: defineAsyncComponent(() => import('./Page')),
  form: defineAsyncComponent(() => import('./Form')),
  list: defineAsyncComponent(() => import('./List')),
  news: defineAsyncComponent(() => import('./News')),
  checkCircle: defineAsyncComponent(() => import('./CheckCircle')),
  cloudAlert: defineAsyncComponent(() => import('./CloudAlert')),
  links: defineAsyncComponent(() => import('./Links')),
  setting: defineAsyncComponent(() => import('./Setting')),
  user: defineAsyncComponent(() => import('./User')),
  roleBinding: defineAsyncComponent(() => import('./RoleBinding')),
  menu: defineAsyncComponent(() => import('./Menus')),
  house: defineAsyncComponent(() => import('./House')),
  inboxUser: defineAsyncComponent(() => import('./InboxUser')),
  articleUser: defineAsyncComponent(() => import('./ArticleUser')),
  book: defineAsyncComponent(() => import('./Book')),
  chat: defineAsyncComponent(() => import('./Chat')),
  notice: defineAsyncComponent(() => import('./Notice')),
  mail: defineAsyncComponent(() => import('./Mail')),
  mailbox: defineAsyncComponent(() => import('./Mailbox')),
  mailAsterisk: defineAsyncComponent(() => import('./MailAsterisk')),
  lines: defineAsyncComponent(() => import('./Lines')),
  houseUser: defineAsyncComponent(() => import('./HouseUser')),
  eventNote: defineAsyncComponent(() => import('./EventNote')),
  location: defineAsyncComponent(() => import('./Location')),
  devices: defineAsyncComponent(() => import('./Devices')),
  terminal: defineAsyncComponent(() => import('./Terminal')),
  post: defineAsyncComponent(() => import('./Post')),
  folder: defineAsyncComponent(() => import('./Folder')),
  calendarClock: defineAsyncComponent(() => import('./CalendarClock'))
}

export type MenuIconType = keyof typeof components

export default components
