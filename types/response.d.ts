declare interface DefaultResult<T> {
  code: number;
  msg?: string;
  message?: string;
  data?: T;
}

declare type ResponseResult<T = any, R = undefined> = R extends undefined
  ? DefaultResult<T>
  : DefaultResult<T> & R

declare interface PageResult<T> {
  list: T[];
  totalCount: number;
}
