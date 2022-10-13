import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export const useStorePermission = defineStore('permission', () => {
  const state = reactive({
    admin: false,
    role: [],
    ability: []
  })

  const changeValue = (type: string, value: any) => {
    state[type] = value
  }

  return {
    ...toRefs(state),
    changeValue
  }
})
