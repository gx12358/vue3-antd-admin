import type { MockTableRecord } from '@/services/demo/table'

export type BasicGood = MockTableRecord<{
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
}>

export type BasicProgress = MockTableRecord<{
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
}>
