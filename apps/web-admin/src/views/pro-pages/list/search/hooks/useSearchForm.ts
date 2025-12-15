import type { SearchState } from '../typing'
import { reactive } from 'vue'
import { useSearchListContext } from '../context'

export default function () {
  const { keyword } = useSearchListContext()

  const searchParams = reactive<SearchState>({
    classList: [],
    rate: undefined,
    keyword: '',
    activeUser: undefined,
    authorList: undefined
  })

  watch(keyword, () => searchParams.keyword = unref(keyword))

  return {
    searchParams
  }
}
