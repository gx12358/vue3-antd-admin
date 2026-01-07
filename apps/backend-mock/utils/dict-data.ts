export const dictTypeList = [
  {
    'id': 1,
    'name': '系统状态',
    'type': 'common_status',
    'status': 0,
    'remark': null,
    'createTime': 1614269751000
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
  {
    'id': 145,
    'name': '角色类型',
    'type': 'system_role_type',
    'status': 0,
    'remark': '角色类型',
    'createTime': 1644987706000
  }
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
    'colorType': 'default',
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
    'colorType': 'processing',
    'cssClass': '',
    'remark': '开启状态',
    'createTime': 1609837428000
  },
  ...commonCateData,
  {
    id: 29,
    'dictType': 'system_menu_type',
    'value': '1',
    'sort': 1,
    'status': 0,
    'label': '目录',
    'colorType': '',
    'cssClass': '',
    'remark': '目录',
    'createTime': 1609837428000
  },
  {
    id: 30,
    'dictType': 'system_menu_type',
    'value': '2',
    'sort': 2,
    'status': 0,
    'label': '菜单',
    'colorType': '',
    'cssClass': '',
    'remark': '菜单',
    'createTime': 1609837428000
  },
  {
    id: 31,
    'dictType': 'system_menu_type',
    'value': '3',
    'sort': 3,
    'status': 0,
    'label': '按钮',
    'colorType': '',
    'cssClass': '',
    'remark': '按钮',
    'createTime': 1609837428000
  },
  {
    'id': 33,
    'sort': 2,
    'label': '自定义',
    'value': '2',
    'dictType': 'system_role_type',
    'status': 0,
    'colorType': 'primary',
    'cssClass': '',
    'remark': '自定义角色',
    'createTime': 1609837428000
  },
  {
    'id': 32,
    'sort': 1,
    'label': '内置',
    'value': '1',
    'dictType': 'system_role_type',
    'status': 0,
    'colorType': 'danger',
    'cssClass': '',
    'remark': '内置角色',
    'createTime': 1609837428000
  },
  {
    'id': 38,
    'sort': 5,
    'label': '仅本人数据权限',
    'value': '5',
    'dictType': 'system_data_scope',
    'status': 0,
    'colorType': '',
    'cssClass': '',
    'remark': '仅本人数据权限',
    'createTime': 1609837428000
  },
  {
    'id': 37,
    'sort': 4,
    'label': '本部门及以下数据权限',
    'value': '4',
    'dictType': 'system_data_scope',
    'status': 0,
    'colorType': '',
    'cssClass': '',
    'remark': '本部门及以下数据权限',
    'createTime': 1609837428000
  },
  {
    'id': 36,
    'sort': 3,
    'label': '本部门数据权限',
    'value': '3',
    'dictType': 'system_data_scope',
    'status': 0,
    'colorType': '',
    'cssClass': '',
    'remark': '本部门数据权限',
    'createTime': 1609837428000
  },
  {
    'id': 35,
    'sort': 2,
    'label': '指定部门数据权限',
    'value': '2',
    'dictType': 'system_data_scope',
    'status': 0,
    'colorType': '',
    'cssClass': '',
    'remark': '指定部门数据权限',
    'createTime': 1609837428000
  },
  {
    'id': 34,
    'sort': 1,
    'label': '全部数据权限',
    'value': '1',
    'dictType': 'system_data_scope',
    'status': 0,
    'colorType': '',
    'cssClass': '',
    'remark': '全部数据权限',
    'createTime': 1609837428000
  }
]
