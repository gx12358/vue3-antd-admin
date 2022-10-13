declare interface ResponseResult<T = any> extends TableResult<T> {
  code: number;
  msg?: string;
  message?: string;
  data?: T;
  roles?: any;
  user?: any;
  permissions?: any;
}

declare interface TableResult<T = any> {
  total?: number;
  pageNum?: number;
  rows?: T;
}
