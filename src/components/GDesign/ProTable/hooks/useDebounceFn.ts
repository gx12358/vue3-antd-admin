import { ref } from 'vue'
import { tryOnUnmounted } from '@/hooks/core/useTimeout'
import type { ProTabelFeachParams } from '../types/table'

export type ReturnValue<T extends any[]> = {
  run: (...args: T) => void;
  cancel: () => void;
};

function useDebounceFn<T extends any[]>(
  fn: (...args: T) => Promise<any>,
  wait?: number
) {
  const hookWait: number = wait || 0
  const timer = ref<any>()

  const fnRef = ref<any>(fn)
  fnRef.value = fn

  function cancel() {
    if (timer.value) {
      clearTimeout(timer.value)
    }
  }

  async function run(...args: ProTabelFeachParams[]) {
    cancel()
    timer.value = args[0]?.immediate ? await fnRef.value(...args) : setTimeout(async () => {
      await fnRef.value(...args)
    }, hookWait)
  }

  tryOnUnmounted(cancel)

  return {
    cancel,
    run
  }
}

export default useDebounceFn
