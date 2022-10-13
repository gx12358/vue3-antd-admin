import type { Ref } from 'vue'
import { ref } from 'vue'

export const useRefFunction = <T extends (...args: any) => any>(reFunction: T) => {
  const options: Ref<any> = ref(null)
  options.value = reFunction
  return (...rest: Parameters<T>): ReturnType<T> => {
    return options.value?.(...(rest as any))
  }
}
