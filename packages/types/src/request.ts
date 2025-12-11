export interface DefaultResult<T> {
  code: number;
  message?: string;
  data: T;
}

export type ResponseResult<T = any, R = undefined> = R extends undefined
  ? DefaultResult<T>
  : DefaultResult<T> & R

export interface PageResult<T = any> {
  list: T[];
  total: number;
}
