export const settingsBackDrop = [
  {
    type: 'speed',
    name: '播放速度',
    value: 1,
    icon: 'player-bofang',
    panelStatus: 2,
    configs: [
      {
        value: 0.5,
        name: '0.5'
      },
      {
        value: 1,
        name: '正常'
      },
      {
        value: 1.5,
        name: '1.5'
      },
      {
        value: 2,
        name: '2'
      }
    ],
    disabled: false
  },
  {
    type: 'loop',
    name: '循环播放',
    value: 1,
    panelStatus: 1,
    icon: 'player-xunhuan',
    disabled: false,
    configs: []
  },
  {
    type: 'autoplay',
    name: '自动播放',
    value: 1,
    panelStatus: 1,
    icon: 'player-zidong-',
    disabled: false,
    configs: []
  }
]
