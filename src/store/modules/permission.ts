import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

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
