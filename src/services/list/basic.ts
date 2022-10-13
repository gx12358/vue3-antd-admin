import request from '@/utils/request'

export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type BasicListItemDataType = {
  id: string;
  owner: string;
  title: string;
  avatar: string;
  cover: string;
  status: 'normal' | 'exception' | 'active' | 'success' | 'all';
  percent: number;
  logo: string;
  href: string;
  body?: any;
  updatedAt: number;
  createdAt: number;
  subDescription: string;
  description: string;
  activeUser: number;
  newUser: number;
  star: number;
  like: number;
  message: number;
  content: string;
  members: Member[];
};

type ParamsType = {
  pageNum?: number;
  pageSize?: number;
} & Partial<BasicListItemDataType>;

export function getBasicList(
  params: ParamsType
): Promise<ResponseResult> {
  return request({
    url: '/get_basic_list',
    method: 'post',
    data: params,
    isMock: true
  })
}

export function getBasicListInfo(
  params: Partial<BasicListItemDataType>
): Promise<ResponseResult> {
  return request({
    url: '/basic_list_info',
    method: 'post',
    data: params,
    isMock: true
  })
}

export function updateBasicList(
  params: Partial<BasicListItemDataType>
) {
  return request({
    url: '/post_basic_list',
    method: 'PUT',
    data: params,
    isMock: true
  })
}

export function addBasicList(
  params: Partial<BasicListItemDataType>
) {
  return request({
    url: '/post_basic_list',
    method: 'POST',
    data: params,
    isMock: true
  })
}

export function removeBasicList(
  params: ParamsType
) {
  return request({
    url: '/post_basic_list',
    method: 'DELETE',
    data: params,
    isMock: true
  })
}
