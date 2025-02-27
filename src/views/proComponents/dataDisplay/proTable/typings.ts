export interface SearchParams {
  adress: string;
  age?: number;
  name?: string;
  date?: string;
  createTime?: string;
}

export interface MockTableRecord {
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
  status: 'published' | 'draft' | 'deleted';
}
