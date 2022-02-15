import request from '@/utils/request'

export const login = data => { // 登录
  return request({
    url: '/sys/login',
    method: 'post',
    data
  })
}

export const getUserInfo = () => { // 获取用户信息
  return request({
    url: '/sys/profile',
    method: 'post'
  })
}

export const getUserDetailById = id => { // 获取员工基本信息
  return request({
    url: `/sys/user/${id}`,
    method: 'get'
  })
}
