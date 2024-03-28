import type { Dayjs } from 'dayjs'
import mockjs from 'mockjs'

const { Random } = mockjs

export interface PublicFormState {
  id?: string;
  name: string;
  project: string;
  mangerName: string;
  company: string;
  area: string[];
  useMode: string;
  unusedMode: string;
  contract: string;
  phone: string;
  captcha: string;
  count: number;
  createTime: Dayjs[];
}

export const formState: Partial<PublicFormState> = {
  id: Random?.guid(),
  name: Random.cname(),
  company: Random.cname(),
  contract: Random.cname(),
  captcha: Random.cname(),
  project: Random.cname(),
  mangerName: Random.cname(),
  phone: '183****7521',
  count: Random.integer(10, 100),
}
