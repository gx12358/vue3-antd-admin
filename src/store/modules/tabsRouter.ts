import { reactive, toRefs } from 'vue'
import { defineStore } from 'pinia'

export interface TabsRouterState {
  visitedRoutes: Recordable[];
}

export const useStoreTabsRouter = defineStore('tabsRouter', () => {
  const state = reactive({
    visitedRoutes: []
  } as TabsRouterState)

  const addVisitedRoute = (route) => {
    const target = state.visitedRoutes.find(item => item.path === route.path)
    if (target) {
      if (route.fullPath !== target.fullPath)
        Object.assign(target, route)
      return
    }
    if (route.tagFixed) {
      state.visitedRoutes.unshift(Object.assign({}, route))
    } else {
      state.visitedRoutes.push(Object.assign({}, route))
    }
  }

  const delVisitedRoute = (route) => {
    state.visitedRoutes.forEach((item, index) => {
      if (item.path === route.path)
        state.visitedRoutes.splice(index, 1)
    })
  }

  const delOthersVisitedRoutes = (route) => {
    state.visitedRoutes = state.visitedRoutes.filter(
      item => item.meta.tagFixed || item.path === route.path
    )
  }

  const delLeftVisitedRoutes = (route) => {
    let index = state.visitedRoutes.length
    state.visitedRoutes = state.visitedRoutes.filter((item) => {
      if (item.name === route.name)
        index = state.visitedRoutes.indexOf(item)
      return item.meta.tagFixed || index <= state.visitedRoutes.indexOf(item)
    })
  }

  const delRightVisitedRoutes = (route) => {
    let index = state.visitedRoutes.length
    state.visitedRoutes = state.visitedRoutes.filter((item) => {
      if (item.name === route.name)
        index = state.visitedRoutes.indexOf(item)
      return item.meta.tagFixed || index >= state.visitedRoutes.indexOf(item)
    })
  }

  const delAllVisitedRoutes = () => {
    state.visitedRoutes = state.visitedRoutes.filter(item => item.meta.tagFixed)
  }

  const blankingTabs = () => {
    state.visitedRoutes = []
  }

  return {
    ...toRefs(state),
    blankingTabs,
    addVisitedRoute,
    delVisitedRoute,
    delOthersVisitedRoutes,
    delLeftVisitedRoutes,
    delRightVisitedRoutes,
    delAllVisitedRoutes
  }
})
