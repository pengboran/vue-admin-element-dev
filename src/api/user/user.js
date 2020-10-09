// import request from '@/utils/request'
import { post,get,delet,put } from '@/utils/http'
// 登录
export const login = data => post('login',data)

// 登出
export const logout = data => delet('logout',data)

// 获取用户信息
export const getInfo = data => get('user',data)

