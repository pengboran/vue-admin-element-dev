import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

// 路由守卫 全局钩子
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)
  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      next()
      NProgress.done()
    } else {
      // let toPath = to.path
      const hasGetUserInfo =  store.getters.name  
      console.log(hasGetUserInfo) // 刷新页面时 第一次获取不到 获取不到之后走getInfo 重新设置store 然后在打印一遍 就有  为啥打印两遍？ 1.刷新首先去的path='/' 然后重定向首页 走了两遍befoEach？
      // 是否获取到了用户信息
      if (hasGetUserInfo) {
        next()
      } else {
        // 跳转时 没有获取用户信息的操作
        try {
          // get user info
          // note: roles must be a object array! such as: ['admin'] or ,['developer','editor']
          const { roleList } = await store.dispatch('user/getInfo') // 获取相应页面目录权限数组
          const roleIdList = []
          for(let item of roleList){
            roleIdList.push(item.roleId) // 拿到用户的所有角色id
          }
          console.log(roleIdList)
          // 根据角色生成可访问路由图
          const accessRoutes = await store.dispatch('permission/generateRoutes', roleIdList)
          // 动态添加可访问路由，生成侧边栏
           router.addRoutes(accessRoutes)
          // hack method to ensure that addRoutes is complete --hack方法，以确保addRoutes是完整的
          // set the replace: true, so the navigation will not leave a history record  设置replace: true，这样导航将不会留下历史记录

          next({ ...to, replace: true })
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error)
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
