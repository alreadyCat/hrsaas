import request from '@/utils/request'

export const getDepartmentManager = () => { // 部门负责人
  return request({
    url: '/sys/user/simple'
  })
}

export const getEmployeeList = params => { // 获取员工综合列表数据
  return request({
    url: '/sys/user',
    params
  })
}

export const delEmployee = id => { // 删除员工
  return request({
    url: `/sys/user/${id}`,
    method: 'delete'
  })
}

export const addEmployee = data => { // 添加员工
  return request({
    method: 'post',
    url: '/sys/user',
    data
  })
}
export const importEmployee = data => { // 批量导入员工
  return request({
    url: '/sys/user/batch',
    method: 'post',
    data
  })
}

export const saveUserDetailById = data => { // 保存员工的基本信息
  return request({
    url: `/sys/user/${data.id}`,
    method: 'put',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.userId}/personalInfo`,
    method: 'put',
    data
  })
}

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}

/** *
 * 给用户分配角色
 * ***/
export function assignRoles(data) {
  return request({
    url: '/sys/user/assignRoles',
    data,
    method: 'put'
  })
}
