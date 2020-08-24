import axios from 'axios'
import router from '@/router'
import { MessageBox, Message } from 'element-ui'
import Qs from 'qs'
// import store from '@/store'
import { getToken } from '@/utils/auth'

const loginUrl = '/login'

// 根据环境切换接口地址
axios.defaults.baseURL = process.env.VUE_APP_BASE_API
axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' }
axios.defaults.timeout = 60000

const service = axios.create()

// 请求拦截器
service.interceptors.request.use(
  config => {
    if (router.history.current.path !== loginUrl) {
      const token = getToken()
      if (token == null) {
        router.replace({ path: loginUrl, query: { redirect: router.currentRoute.fullPath }}) // query内含当前页面的路由，以便登录后能操作返回当前页面
        return false
      } else {
        config.headers['X-Token'] =  token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改 到时与后端商讨
      }
    }
    return config
  }, error => {
    Message.warning(error)
    return Promise.reject(error)
  }
)

// 响应拦截器(异常处理)
service.interceptors.response.use(
  response => {
    return response.data
  }, error => {
    if (error.response !== undefined) {
      switch (error.response.status) {
        case 400:
          MessageBox.alert(error.response.data)
          break
        case 401:
          if (window.sessionStorage.getItem('out') === null) {
            window.sessionStorage.setItem('out', 1)
            MessageBox.confirm('会话已失效！请重新登录', '提示', {
              confirmButtonText: '重新登录',
              cancelButtonText: '取消',
              type: 'warning'
            }).then(() => {
              router.replace({ path: loginUrl, query: { redirect: router.currentRoute.fullPath }})
            }).catch(action => {
              window.sessionStorage.clear()
              window.localStorage.clear()
            })
          }
          break
        case 402:
          MessageBox.confirm('登录超时！', '提示', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            router.replace({ path: loginUrl, query: { redirect: router.currentRoute.fullPath }})
          })
          break
        case 403:
          MessageBox.alert('没有权限！')
          break
        case 500:
          MessageBox.alert('服务器出错！')
          break
        default:
          MessageBox.alert(`连接错误${error.response.status}`)
      }
      return Promise.resolve(error.response)
    }
    return Promise.resolve(error)
  }
)

const request = options => {
  let {
    url, // 请求路径
    method = 'GET', // 请求方式
    data, // 请求参数
    showErr = true, // 是否显示错误信息
    noQs = false // 不需要序列化数据
  } = options

  const methodType = method.toUpperCase()
  const axData = {
    url: URL + url
  }

  switch (methodType) {
    case 'GET':// get请求
      data.t = new Date().getTime() // 请求随机数，防止ie缓存
      axData.type = 'get'
      axData.params = data
      break
    case 'POST': // post请求
      if (!noQs) {
        data = Qs.stringify(data)
      }
      axData.method = 'post'
      axData.data = data
      break
    default:
      break
  }

  return service(axData).then(res => {
    const serveData = res.data
    // 显示错误信息，排除需要登录情况
    if (showErr && serveData.code !== 200) {
      Message.warning(serveData.message)
    }
    return serveData
  }).catch(err => {
    // 显示错误信息
    if (showErr) {
      Message.warning(err)
    }
    return err
  })
}

export const $http = {
  get: (url, data = {}, option) => request({ method: 'GET', url, data, ...option }),
  post: (url, data = {}, option) => request({ method: 'POST', url, data, ...option })
}

export default axios
