import type { MockTableRecord, SearchConfig } from '@/services/demo/table'

export type SearchState = SearchConfig & Pick<TableRow, 'type'>

export type TableRow = MockTableRecord<{
  type: 'all' | 'active' | 'success';
  owner: string;
  subDescription: string;
}>
