import type { Dayjs } from 'dayjs'

export interface FormState {
  name: string;
  desc: string;
  target: '0' | '1'; // 监控对象 0 表一 1 表二
  template: '0' | '1'; // 规则模版 0 规则模板一 1 规则模板二
  type: '0' | '1'; // 规则类型 0 强 1 弱
  createTime: string;
  frequency: 'month' | 'week'; // month 月 week 周
  createTimeDay?: Dayjs;
}

export const defauleState: FormState = {
  name: '',
  desc: '',
  target: '0',
  template: '0',
  type: '0',
  createTime: '',
  frequency: 'month',
  createTimeDay: null,
}
