import router from '@/router'
import store from '@/store'
import nprogress from 'nprogress'
import 'nprogress/nprogress.css'
import { getTimeStamp } from '@/utils/auth'
import { Message } from 'element-ui'
const whiteList = ['/404', '/login']

const TimeOut = 3600// 设置时间戳超时时间单位秒

function checkIsTimeOut() { // 检测token是否超时
  const now = Date.now()
  const timestamp = getTimeStamp()
  return (now - timestamp) / 1000 > TimeOut
}

router.beforeEach(async(to, from, next) => {
  nprogress.start()
  const token = store.getters.token
  if (!token) { // 没有token
    if (to.path === '/login') { // 去登录页
      next()
    } else { // 去除登录页的其他页面
      if (whiteList.indexOf(to.path) !== -1) { // 去在白名单里的页面
        next()
      } else { // 去非白名单里的页面
        next('/login')
      }
    }
  } else { // 有token
    if (to.path === '/login') {
      next('/')
    } else {
      if (!store.getters.userInfo.userId) {
        // 必须在有token时才检查token是否过期
        if (checkIsTimeOut()) {
          store.dispatch('user/logout')// 登出
          router.push('/login')
          return Message.error('TOKEN失效')
        }
        // 必须等待获取完用户信息才能进行跳转
        await store.dispatch('user/loadUserInfo')
        const routes = await store.dispatch('permission/filterRoutes', store.getters.userInfo.roles.menus)
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      } else {
        next()
      }
    }
  }
})

router.afterEach(() => {
  nprogress.done()
})
