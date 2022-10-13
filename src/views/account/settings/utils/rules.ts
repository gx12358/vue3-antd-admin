export const validatorPhone = (...arg) => {
  const values = arg[1].split('-')
  if (!values[0] && !values[1]) {
    return Promise.reject('请输入您的联系电话！')
  }
  if (!values[0]) {
    return Promise.reject('请输入你的电话区域码！')
  }
  if (!values[1]) {
    return Promise.reject('请输入你的电话号码！')
  }
  return Promise.resolve()
}
