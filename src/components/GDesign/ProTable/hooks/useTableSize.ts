import { Ref, ref, watchEffect } from 'vue'
import type { SizeType } from '@gx-admin/utils'

export function useTableSize({ size, emit }: {
  size: Ref<SizeType>,
  emit: EmitType
}) {

  const sizeRef: Ref<SizeType> = ref('middle')

  watchEffect(() => {
    sizeRef.value = size.value
  })

  function setTableSize(size: SizeType) {
    sizeRef.value = size
    emit('sizeChange', true)
  }

  return { sizeRef, setTableSize }
}
