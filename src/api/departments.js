import request from '@/utils/request'

export const getDepartments = () => { // 获取部门
  return request({
    url: '/company/department'
  })
}
export const delDepartment = id => { // 删除部门
  return request({
    url: `/company/department/${id}`,
    method: 'delete'
  })
}
export const addDepartments = data => { // 新增部门
  return request({
    url: '/company/department',
    method: 'post',
    data
  })
}
export const getDepartDetail = id => { // 获取部门详情
  return request({
    url: `/company/department/${id}`
  })
}
export const updateDepartments = data => { // 保存编辑部门数据
  return request({
    url: `/company/department/${data.id}`,
    method: 'put',
    data
  })
}
