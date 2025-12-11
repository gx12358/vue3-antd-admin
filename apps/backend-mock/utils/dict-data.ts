export const dictTypeList = [
  {
    'id': 1,
    'name': '系统状态',
    'type': 'common_status',
    'status': 0,
    'remark': null,
    'createTime': 1614269751000,
  },
  {
    'id': 2,
    'name': '用户性别',
    'type': 'system_user_sex',
    'status': 0,
    'remark': null,
    'createTime': 1614269751000
  },
  {
    'id': 3,
    'name': '公共类别',
    'type': 'sys_common_category',
    'status': 0,
    'remark': null,
    'createTime': 1614269751000
  },
]

const commonCateData = Array.from({ length: 12 }).map((_, index) => {
  return {
    'id': 28 + index,
    'sort': index + 1,
    'label': `类目${index + 1}`,
    'value': `${index + 1}`,
    'dictType': 'sys_common_category',
    'status': 0,
    'colorType': 'success',
    'cssClass': '',
    'remark': `类目${index + 1}`,
    'createTime': 1609837428000
  }
})

export const dictDataList = [
  {
    'id': 2,
    'sort': 2,
    'label': '女',
    'value': '2',
    'dictType': 'system_user_sex',
    'status': 0,
    'colorType': 'success',
    'cssClass': '',
    'remark': '性别女',
    'createTime': 1609837428000
  },
  {
    'id': 1,
    'sort': 1,
    'label': '男',
    'value': '1',
    'dictType': 'system_user_sex',
    'status': 0,
    'colorType': 'default',
    'cssClass': 'A',
    'remark': '性别男',
    'createTime': 1609837428000
  },
  {
    'id': 28,
    'sort': 2,
    'label': '关闭',
    'value': '1',
    'dictType': 'common_status',
    'status': 0,
    'colorType': 'info',
    'cssClass': '',
    'remark': '关闭状态',
    'createTime': 1609837428000
  },
  {
    'id': 27,
    'sort': 1,
    'label': '开启',
    'value': '0',
    'dictType': 'common_status',
    'status': 0,
    'colorType': 'primary',
    'cssClass': '',
    'remark': '开启状态',
    'createTime': 1609837428000
  },
  ...commonCateData
]
