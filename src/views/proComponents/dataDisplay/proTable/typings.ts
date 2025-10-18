export type SearchConfig = Partial<Pick<MockTableRecord, 'adress' | 'age' | 'name' | 'createTime' | 'date'>>

export interface DefaultRecord {
  name: string;
  title: string;
  author: string;
  age: number;
  address: string;
  pageViews: number;
  img: string;
  description: string;
  percent: number;
  switch: boolean;
  rate: number;
  adress: string;
  date: string;
  status: 'published' | 'draft' | 'deleted';
}

export type MockTableRecord = TableRecord<DefaultRecord>

export type UpdateMockTableRecord = UpdateTableRecord<DefaultRecord>
