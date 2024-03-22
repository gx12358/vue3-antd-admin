export type SearchState = {
  pageNum?: number;
  pageSize?: number;
  rate: string;
  keyword?: string;
  activeUser: string;
  classList: string[];
  authorList: string[];
}

export type TagsListItem = {
  value: string;
  label: string;
}
