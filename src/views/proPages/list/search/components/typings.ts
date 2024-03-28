export interface SearchState {
  pageNum?: number;
  pageSize?: number;
  rate: string;
  keyword?: string;
  activeUser: string;
  classList: string[];
  authorList: string[];
}

export interface TagsListItem {
  value: string;
  label: string;
}
