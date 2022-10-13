import request from '@/utils/request'

export type TableListItem = {
  key: number | string;
  disabled?: boolean;
  href: string;
  avatar: string;
  name: string;
  owner: string;
  desc: string;
  callNo: number;
  status: string;
  updatedAt: string;
  createdAt: string;
  progress: number;
};

export function rule(
  params: {
    // query
    sortOrder?: string;
    sortField?: string;
    /** 当前的页码 */
    pageNum?: number;
    /** 页面的容量 */
    pageSize?: number;
  }
) {
  return request({
    url: '/rule_list',
    method: 'post',
    data: params,
    isMock: true
  })
}

export function getRuleInfo(options?: { [key: string]: any }) {
  return request({
    url: '/rule_info',
    method: 'post',
    data: options,
    isMock: true
  })
}

export function updateRule(options?: { [key: string]: any }) {
  return request({
    url: '/rule',
    method: 'PUT',
    data: options,
    isMock: true
  })
}

export function addRule(options?: { [key: string]: any }) {
  return request({
    url: '/rule',
    method: 'POST',
    data: options,
    isMock: true
  })
}

export function removeRule(options?: { [key: string]: any }): Promise<Record<string, any>> {
  return request({
    url: '/rule',
    method: 'DELETE',
    data: options,
    isMock: true
  })
}
