import type { MockTableRecord, SearchConfig } from '@/services/demo/table'

export interface MemberItem {
  avatar: string;
  name: string;
  id: string;
}

export interface ListRow {
  rate?: string;
  href?: string;
  keyword?: string;
  newUser?: number;
  activeUser?: number;
  subDescription?: string;
  classList: string[];
  authorList?: string[];
  star?: number;
  like?: number;
  message?: number;
  owner?: string;
  cover?: string;
  members?: MemberItem[];
}

export type SearchState = SearchConfig<Pick<ListRow, 'classList' | 'activeUser' | 'rate' | 'keyword' | 'authorList'>>

export type ListItemDataType = MockTableRecord<ListRow>

export interface TagsListItem {
  value: string | number;
  label: string;
}
