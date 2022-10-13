interface TableListItem {
  key: number;
  name: string;
  containers: number;
  creator: string;
  status: string;
  createdAt: number;
  memo: string;
}

const valueEnum = {
  0: 'close',
  1: 'running',
  2: 'online',
  3: 'error'
}

const tableListDataSource: TableListItem[] = []

const creators = [ '付小小', '曲丽丽', '林东东', '陈帅帅', '兼某某' ]

for (let i = 0; i < 10; i += 1) {
  tableListDataSource.push({
    key: i,
    name: 'AppName',
    containers: Math.floor(Math.random() * 20),
    creator: creators[Math.floor(Math.random() * creators.length)],
    status: valueEnum[Math.floor(Math.random() * 10) % 4],
    createdAt: Date.now() - Math.floor(Math.random() * 100000),
    memo: i % 2 === 1 ? '很长很长很长很长很长很长很长的文字要展示但是要留下尾巴' : '简短备注文案'
  })
}

export default {
  positionData: tableListDataSource,
  parameterData: [
    {
      attributes: 'width',
      description: '水印的宽度',
      typesof: 'number',
      defaults: '120'
    },
    {
      attributes: 'height',
      description: '水印的高度',
      typesof: 'number',
      defaults: '64'
    },
    {
      attributes: 'rotate',
      description: '水印绘制时，旋转的角度，单位 °',
      typesof: 'number',
      defaults: '-22'
    },
    {
      attributes: 'image',
      description: '图片源，建议导出 2 倍或 3 倍图，优先使用图片渲染水印',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'zIndex',
      description: '追加的水印元素的 z-index',
      typesof: 'number',
      defaults: '9'
    },
    {
      attributes: 'content',
      description: '水印文字内容',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'fontColor',
      description: '水印文字颜色',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'fontSize',
      description: '文字大小',
      typesof: 'string | number',
      defaults: '16'
    }
  ],
  parameterLevelData: [
    {
      attributes: 'markStyle',
      description: '水印层的样式',
      typesof: 'CSSStyleSheet',
      defaults: ''
    },
    {
      attributes: 'markClassName',
      description: '水印层的类名',
      typesof: 'string',
      defaults: ''
    },
    {
      attributes: 'gapX',
      description: '水印之间的水平间距',
      typesof: 'number',
      defaults: '212'
    },
    {
      attributes: 'gapY',
      description: '水印之间的垂直间距',
      typesof: 'string',
      defaults: '222'
    },
    {
      attributes: 'offsetLeft',
      description: '水印在 canvas 画布上绘制的水平偏移量, 正常情况下，水印绘制在中间位置, 即 offsetTop = gapX / 2',
      typesof: 'number',
      defaults: 'offsetTop = gapX / 2'
    },
    {
      attributes: 'offsetTop',
      description: '水印在 canvas 画布上绘制的垂直偏移量，正常情况下，水印绘制在中间位置, 即 offsetTop = gapY / 2',
      typesof: 'number',
      defaults: 'offsetTop = gapY / 2'
    }
  ],
  code: `<g-pro-watermark
  :rotate="-2"
  content='示例水印'
  fontColor='#064417'
  :fontSize="15"
  :zIndex="18"
>
  <div>xxx</div>
</g-pro-watermark>`
}
