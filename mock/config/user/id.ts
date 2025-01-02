import { getArraryList } from '../../utils/util'

export default getArraryList(4, index => ({
  id: index + 1
}))
