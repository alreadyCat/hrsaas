import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes
}
const mutations = {
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menu) {
    const newRoutes = asyncRoutes.filter(route => {
      return menu.find(item => {
        return route.name === item
      })
    })
    context.commit('setRoutes', newRoutes)
    return newRoutes
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
