import axios from 'axios'
import router from '@/router'
import { MessageBox, Message } from 'element-ui'
import Qs from 'qs'
// import store from '@/store'
import { getToken } from '@/utils/auth'

const loginUrl = '/login'

// 根据环境切换接口地址
axios.defaults.baseURL =  process.env.VUE_APP_BASE_API
// axios.defaults.headers = { 'X-Requested-With': 'XMLHttpRequest' }
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
        config.headers['Authorization'] =  "Bearer " + token // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改 
      }
    }
    return config
  }, error => {
    Message.warning(error)
    return Promise.reject(error)
  }
)

// 响应拦截器(异常处理)
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

/** 
 * get方法，对应get请求 
 * @param {String} url [请求的url地址] 
 * @param {Object} params [请求时携带的参数] 
 */
export function get(url, params){    
  return new Promise((resolve, reject) =>{        
      axios.get(url, {            
          params: params        
      })        
      .then(res => {            
          resolve(res);        
      })        
      .catch(err => {            
          reject(err)        
      })    
  });
}
/** 
* post方法，对应post请求 
* @param {String} url [请求的url地址] 
* @param {Object} params [请求时携带的参数] 
*/
export function post(url, params,dataType = 'J') {    
  return new Promise((resolve, reject) => {         
      axios.post(url, dataType == 'no' ? params : (dataType == 'S' ? Qs.stringify(params) : Qs.parse(Qs.stringify(params))))        
      .then(res => {            
          resolve(res);        
      })        
      .catch(err => {            
          reject(err)        
      })    
  });
}
export function delet(url, params){
  return new Promise((resolve,reject) => {
    axios.delete(url,{
      params: params
    })
    .then(res=>{
      resolve(res)
    })
    .catch(err=>{
      reject(err)
    })
  })
}
export function put(url, params,dataType = 'J') {    
  return new Promise((resolve, reject) => {         
      axios.put(url, dataType == 'no' ? params : (dataType == 'S' ? Qs.stringify(params) : Qs.parse(Qs.stringify(params))))        
      .then(res => {            
          resolve(res);        
      })        
      .catch(err => {            
          reject(err)        
      })    
  });
}
export default axios
