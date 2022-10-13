import request from '@/utils/request'

export type Member = {
  avatar: string;
  name: string;
  id: string;
};

export type CardListItemDataType = {
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
} & Partial<CardListItemDataType>;

export function getCardList(
  params: ParamsType
): Promise<ResponseResult<CardListItemDataType[]>> {
  return request({
    url: '/card_fake_list',
    method: 'post',
    data: params,
    isMock: true
  })
}
