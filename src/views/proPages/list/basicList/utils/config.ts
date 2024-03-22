import type { BasicCountState } from '@gx-mock/datasSource/list/basic'

export type CountState = Record<keyof BasicCountState, { name: string; unit: string; count: number }>

export const defaultCountState: CountState = {
  needDone: { name: '我的待办', count: 0, unit: '个任务' },
  average: { name: '本周任务平均处理时间', count: 0, unit: '分钟' },
  done: { name: '本周完成任务数', count: 0, unit: '个任务' },
}
