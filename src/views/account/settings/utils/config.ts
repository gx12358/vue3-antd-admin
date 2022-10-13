import { validatorPhone } from './rules'

export const rules = {
  email: [
    {
      required: true,
      message: '请输入您的邮箱！'
    }
  ],
  name: [
    {
      required: true,
      message: '请输入您的昵称！'
    }
  ],
  profile: [
    {
      required: true,
      message: '请输入个人简介！'
    }
  ],
  country: [
    {
      required: true,
      message: '请输入您的国家或地区！'
    }
  ],
  province: [
    {
      required: true,
      message: '请输入您的所在省！'
    }
  ],
  city: [
    {
      required: true,
      message: '请输入您的所在城市！'
    }
  ],
  address: [
    {
      required: true,
      message: '请输入您的街道地址！'
    }
  ],
  phone: [
    {
      required: true,
      message: '请输入您的联系电话！'
    },
    { validator: validatorPhone }
  ]
}

export const securityViewData = [
  {
    title: '账户密码',
    description: '当前密码强度：强',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: '密保手机',
    description: '已绑定手机：138****8293',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: '密保问题',
    description: '未设置密保问题，密保问题可有效保护账户安全',
    actions: {
      key: 'Set',
      text: '设置'
    }
  },
  {
    title: '备用邮箱',
    description: '已绑定邮箱：ant***sign.com',
    actions: {
      key: 'Modify',
      text: '修改'
    }
  },
  {
    title: 'MFA 设备',
    description: '未绑定 MFA 设备，绑定后，可以进行二次确认',
    actions: {
      key: 'bind',
      text: '绑定'
    }
  }
]

export const bindingViewData = [
  {
    title: '绑定淘宝',
    description: '当前未绑定淘宝账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'taobao'
  },
  {
    title: '绑定支付宝',
    description: '当前未绑定支付宝账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'alipay'
  },
  {
    title: '绑定钉钉',
    description: '当前未绑定钉钉账号',
    actions: {
      key: 'Bind',
      text: '绑定'
    },
    avatar: 'dingding'
  },
]

export const notificationViewData = [
  {
    title: '账户密码',
    description: '其他用户的消息将以站内信的形式通知',
    checkedValue: true
  },
  {
    title: '系统消息',
    description: '系统消息将以站内信的形式通知',
    checkedValue: true
  },
  {
    title: '待办任务',
    description: '待办任务将以站内信的形式通知',
    checkedValue: true
  },
]
