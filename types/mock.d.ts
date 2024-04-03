declare type MethodType = 'get' | 'post' | 'put' | 'delete' | 'patch'

declare interface MockResponse<T = Recordable, D> {
  url: Recordable;
  body: D extends undefined ? T : D;
  query: T;
  headers: Recordable
}

declare interface MockMethod {
  url: string;
  method?: MethodType;
  timeout?: number;
  statusCode?: number;
  response?: (opt: MockResponse) => Partial<ResponseResult>;
}
