import { getMockRequest } from '@gx-mock/util/utils'

export interface RadarRecord {
  name: string;
  label: string;
  value: number;
}

const radarOriginData = [
  {
    name: '个人',
    ref: 10,
    koubei: 8,
    output: 4,
    contribute: 5,
    hot: 7
  },
  {
    name: '团队',
    ref: 3,
    koubei: 9,
    output: 6,
    contribute: 3,
    hot: 1
  },
  {
    name: '部门',
    ref: 4,
    koubei: 1,
    output: 6,
    contribute: 5,
    hot: 7
  }
]
const radarData: RadarRecord[] = []
const radarTitleMap = {
  ref: '引用',
  koubei: '口碑',
  output: '产量',
  contribute: '贡献',
  hot: '热度'
}
radarOriginData.forEach((item) => {
  Object.keys(item).forEach((key) => {
    if (key !== 'name') {
      radarData.push({
        name: item.name,
        label: radarTitleMap[key],
        value: item[key]
      })
    }
  })
})

export default [
  getMockRequest({
    url: '/radar',
    method: 'get',
    callback: () => {
      return {
        data: radarData
      }
    }
  })
]
