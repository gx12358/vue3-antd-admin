import { IncomingHttpHeaders, IncomingMessage as IncomingMessage$1, ServerResponse } from 'node:http'

interface IncomingMessage extends IncomingMessage$1 {
  originalUrl?: IncomingMessage$1['url'];
}

type UppercaseHttpMethodType = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | 'CONNECT' | 'TRACE'
type lowercase<T extends string> = T extends Uppercase<T> ? Lowercase<T> : T
type LowercaseHttpMethod = lowercase<UppercaseHttpMethodType>

declare global {
  type HttpMethodType = UppercaseHttpMethodType | LowercaseHttpMethod

  export interface MockResponse {
    body: any;
    query: any;
    headers: RequestHeater
  }

  interface RequestHeater extends IncomingHttpHeaders {
    [key: string]: any;
  }

  interface FakeRouteConfig {
    url: string;
    method?: HttpMethodType;
    timeout?: number;
    statusCode?: number;
    statusText?: string;
    headers?: RequestHeater;
    response?: (processedRequest: MockResponse, req: IncomingMessage, res: ServerResponse) => any;
    rawResponse?: (req: IncomingMessage, res: ServerResponse) => void;
  }
}
