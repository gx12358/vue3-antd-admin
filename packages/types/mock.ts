import type { IncomingHttpHeaders } from 'node:http'
import { IncomingMessage as IncomingMessage$1, ServerResponse } from 'node:http'

export interface IncomingMessage extends IncomingMessage$1 {
  originalUrl?: IncomingMessage$1['url'];
}

export type UppercaseHttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
export type lowercase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T
export type LowercaseHttpMethod = lowercase<UppercaseHttpMethodType>

export type HttpMethodType = UppercaseHttpMethodType | LowercaseHttpMethod

export interface MockResponse {
  body: any;
  query: any;
  headers: RequestHeater
}

export interface RequestHeater extends IncomingHttpHeaders {
  [key: string]: any;
}

export interface FakeRouteConfig {
  url: string;
  method?: HttpMethodType;
  timeout?: number;
  statusCode?: number;
  statusText?: string;
  headers?: RequestHeater;
  response?: (processedRequest: MockResponse, req: IncomingMessage, res: ServerResponse) => any;
  rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
}
