import request from '@/utils/request'
export const getRoleList = params => { // 获取角色列表
  return request({
    url: '/sys/role',
    params
  })
}

export const getCompanyInfo = companyId => { // 获取公司信息
  return request({
    url: `/company/${companyId}`
  })
}

export const deleteRole = id => { // 删除角色
  return request({
    url: `/sys/role/${id}`,
    method: 'delete'
  })
}

export const getRoleDetail = id => { // 获取角色信息
  return request({
    url: `/sys/role/${id}`
  })
}
export const updateRole = data => { // 修改角色
  return request({
    url: `/sys/role/${data.id}`,
    data,
    method: 'put'
  })
}
export const addRole = data => { // 新增角色
  return request({
    url: '/sys/role',
    data,
    method: 'post'
  })
}
export const assignPerm = data => { // 给角色分配权限
  return request({
    url: '/sys/role/assignPrem',
    method: 'put',
    data
  })
}
