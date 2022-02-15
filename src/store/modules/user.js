import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
import { getUserInfo, login, getUserDetailById } from '@/api/user'
import { resetRouter } from '@/router'
const state = {
  token: getToken(),
  userInfo: {}
}
const mutations = {
  updateToken(state, token) { // 设置token
    state.token = token
    setToken(token)
  },
  removeToken(state) { // 移除token
    state.token = null
    removeToken()
  },
  setUserInfo(state, data) { // 设置用户信息
    state.userInfo = data
  },
  removeUserInfo(state) { // 删除用户信息
    state.userInfo = {}
  }
}
const actions = {
  async login(context, data) { // 登录，获取token
    const res = await login(data)
    context.commit('updateToken', res)
    setTimeStamp()
  },
  async loadUserInfo(context) { // 获取用户信息
    const res = await getUserInfo()
    const detail = await getUserDetailById(res.userId)
    context.commit('setUserInfo', { ...res, ...detail })
    return res
  },
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
    resetRouter()
    context.commit('permission/setRoutes', [], { root: true })
  }

}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
