export function drag(e, el, coor) {
  if (!el) {
    return
  }
  const currentX = e.clientX
  const currentY = e.clientY

  let left = currentX - coor.x
  let top = coor.y - currentY
  if (left <= coor.minLeft) {
    left = coor.minLeft
  }
  if (left >= coor.maxLeft) {
    left = coor.maxLeft
  }
  if (top <= coor.minTop) {
    top = coor.minTop
  }
  if (top >= coor.maxTop) {
    top = coor.maxTop
  }
  return {
    left,
    top
  }
}

export function getMatchRangeTime(time, ranges) {
  if (!ranges)
    return time
  if (ranges?.length === 0) {
    return 0
  }
  for (let i = 0; i < ranges.length; i++) {
    const start = ranges.start(i)
    const end = ranges.end(i)
    if (time >= start && time <= end) {
      return ranges.end(i)
    }
  }
  return time
}

export function getElementOffsets(obj) {
  let left = 0
  let top = 0
  do {
    left += obj.offsetLeft
    top += obj.offsetTop
  } while ((obj = obj.offsetParent))
  return {
    left,
    top
  }
}

export function _isSupportPIP() {
  if ('pictureInPictureEnabled' in document) {
    return true
  }
  const el = window.document.createElement('video')
  if (el.requestPictureInPicture && typeof el.requestPictureInPicture === 'function') {
    return true
  }
  return false
}
