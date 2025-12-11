import type { Dayjs } from 'dayjs'

export interface FormState {
  title: string; // 标题 - 字符串类型
  timeRange?: [ string, string ] | [ Dayjs, Dayjs ];
  startTime: string; // 开始时间 - 字符串类型
  endTime: string; // 结束时间 - 字符串类型
  target: number; // 目标类型 - 数字类型(1=公开, 2=部分公开, 3=不公开)
  clientName: string; // 客户名称 - 字符串类型
  summary: string; // 摘要信息 - 字符串类型
  metrics: string; // 指标数据 - 字符串类型
  inviter: string; // 邀请人信息 - 字符串类型
  weight: number; // 权重值 - 数字类型(0-100)
}
