import request from '@/utils/request'

export type BasicGood = {
  id: string;
  name?: string;
  barcode?: string;
  price?: string;
  num?: string | number;
  amount?: string | number;
};

export type BasicProgress = {
  key: string;
  time: string;
  rate: string;
  status: string;
  operator: string;
  cost: string;
};

export function queryBasicProfile(): Promise<ResponseResult<{
  basicProgress: BasicProgress[];
  basicGoods: BasicGood[];
}>> {
  return request({
    url: '/profile/basic',
    method: 'post',
    isMock: true
  })
}
