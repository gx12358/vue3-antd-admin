/**
 * #1890ff -> daybreak
 *
 * @param val
 */
export function genThemeToString(val?: string): string {
  const colorItem = themeConfig.find(item => val === item.color)
  return val && colorItem ? colorItem.fileName : 'daybreak'
}

/**
 * Daybreak-> #1890ff
 *
 * @param val
 */
export function genStringToTheme(val?: string): string {
  const colorItem = themeConfig.find(item => val.toLowerCase() === item.fileName)
  return val && colorItem ? colorItem.color : '#1890FF'
}

export const themeConfig = [
  {
    color: '#1890FF',
    colorName: '拂晓蓝（默认）',
    fileName: 'daybreak',
  },
  {
    color: '#F5222D',
    colorName: '薄暮',
    fileName: 'dust'
  },
  {
    color: '#FA541C',
    colorName: '火山',
    fileName: 'volcano'
  },
  {
    color: '#FAAD14',
    colorName: '日暮',
    fileName: 'sunset'
  },
  {
    color: '#13C2C2',
    colorName: '明青',
    fileName: 'cyan'
  },
  {
    color: '#52C41A',
    colorName: '极光绿',
    fileName: 'green'
  },
  {
    color: '#2F54EB',
    colorName: '极客蓝',
    fileName: 'geekblue'
  },
  {
    color: '#722ED1',
    colorName: '酱紫',
    fileName: 'purple'
  }
]
