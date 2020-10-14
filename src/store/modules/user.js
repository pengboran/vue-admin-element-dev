import { login, logout, getInfo } from '@/api/user/user'
import { getToken, setToken, removeToken, setLocalStorage, getLocalStorage } from '@/utils/auth'
import { resetRouter } from '@/router'
import { welcome } from '@/utils/index'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: [],
    welcome:'',
    id:''
  }
}

const state = getDefaultState() // vuex的状态集
// Mutation 必须是同步函数 定义回调函数 更改store状态(即state对象中的值) 通过store.commit('定义的回调函数')
const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state,  { name, welcome }) => {
    state.name = name
    state.welcome = welcome
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  ADD_ROUTER_NUM: (state) => {
    state.addRouter = 1
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ID: (state,id) => {
    state.id = id
  }
}
// actions 支持异步操作 改变store 是通过提交mutations
const actions = {
  // user login 
  // 可以在 action 内部执行异步操作
  login({ commit }, userInfo) {
    const { userId, password } = userInfo
    return new Promise((resolve, reject) => { 
      login({ userId: userId.trim(), password: password.trim() }).then(response => {
         const { data } = response
        //  console.log(data)
    // 更改store中的状态 通过提交mutations 调用commit方法，第一个参数 一个回调函数，执行修改逻辑的函数，第二个 是mutations的载荷(一般为你需要修改的状态值)
        commit('SET_TOKEN', data.content.token) 
        // commit('SET_ROLES', data.content.user.roles)
        commit('SET_ID', data.content.user.id)
        setToken(data.content.token) // 将token设置到cooke中
        setLocalStorage('userId',data.content.user.id)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      let id = getLocalStorage('userId')
      getInfo({id:id}).then(response => {
        const { data } = response
        let rolesIdList = []
        // console.log(data)
        if (!data) {
          reject('登录失效，请重新登录.')
        }
        commit('SET_NAME', { name: data.content.userName, welcome: welcome() })
        setLocalStorage('userInfo',data.content) // 存用户信息到本地
        // 账户拥有所有角色列表 用于判断操作点
        let rolesList = data.content.roleList
        for(let item of rolesList){
          rolesIdList.push(item.roleId)
        }
        commit('SET_ROLES', rolesIdList)
        setLocalStorage('roleIdList',rolesIdList) // 用户所有的角色ID值 列表 存入本地
        resolve(data.content)
      }).catch(error => {
        reject(error)
      })
    })
    // let user_info = JSON.parse(getLocalStorage('userInfo'))
    // commit('SET_NAME', {name:user_info.user.userName,welcome: welcome()})
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout({"token":state.token}).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        setLocalStorage('userInfo','null')
        setLocalStorage('userId','null')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      commit('SET_TOKEN', '')
      commit('SET_ROLES', [])
      removeToken() // must remove  token  first
      resolve()
    })
  }
}

export default {
  namespaced: true, //启用命名空间，将是一个单独 命名的模块，根据模块名调用state mutation getter action
  state,
  mutations,
  actions
}

