export function getFirstLastChild(data: any[]) {
  let newPath
  // 获取第一个children的path
  const getRoutePath = function (newdata) {
    let firstPath = ''
    if (newdata.children && newdata.children.length > 0) {
      firstPath = getRoutePath(newdata.children[0])
    } else {
      firstPath = `${newdata.path}`
    }
    return firstPath
  }
  if (data[0].children && data[0].children.length > 0) {
    newPath = getRoutePath(data[0].children[0])
  } else {
    newPath = data[0].path
  }
  return newPath
}
