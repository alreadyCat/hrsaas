import { getDepartments } from '@/api/departments'
import { tranListToTreeData } from '@/utils/tranListToTreeData'

const state = {
  departments: [],
  companyInfo: {}
}
const mutations = {
  setDepartments(state, data) { // 社会部门信息
    state.departments = data
  },
  setCompanyInfo(state, data) { // 设置公司信息
    state.companyInfo = data
  }
}
const actions = {
  async loadDepartments(context) {
    const res = await getDepartments()
    context.commit('setDepartments', tranListToTreeData(res.depts, ''))
    context.commit('setCompanyInfo', { companyId: res.companyId, name: res.commpanyName })
  }
}
export default {
  namespaced: true,
  state,
  mutations,
  actions
}
