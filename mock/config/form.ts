import type { Dayjs } from 'dayjs'
import { faker, fakerZH_CN } from '@faker-js/faker'

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
  id: faker.string.nanoid(),
  name: fakerZH_CN.person.fullName(),
  company: fakerZH_CN.person.fullName(),
  contract: fakerZH_CN.person.fullName(),
  captcha: fakerZH_CN.person.fullName(),
  project: fakerZH_CN.person.fullName(),
  mangerName: fakerZH_CN.person.fullName(),
  phone: fakerZH_CN.phone.number(),
  count: faker.number.int({ min: 10, max: 100 }),
}
