import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    roles: []
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
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  ADD_ROUTER_NUM: (state) => {
    state.addRouter = 1
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  }
}
// actions 支持异步操作 改变store 是通过提交mutations
const actions = {
  // user login 
  // 可以在 action 内部执行异步操作
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    return new Promise((resolve, reject) => {
      login({ username: username.trim(), password: password }).then(response => {
        const { data } = response
        // console.log(data)
   // 更改store中的状态 通过提交mutations 调用commit方法，第一个参数 一个回调函数，执行修改逻辑的函数，第二个 是mutations的载荷(一般为你需要修改的状态值)
        commit('SET_TOKEN', data.token) 
        setToken(data.token) // 将token设置到cooke中
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response
        console.log(data)
        if (!data) {
          reject('登录失效，请重新登录.')
        }

        const { roles, name, avatar, introduction } = data
    // roles must be a non-empty array
    if (!roles || roles.length <= 0) {
      reject('getInfo: roles must be a non-null array!')
    }
        commit('SET_ROLES', roles)
        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        commit('SET_TOKEN', '')
        commit('SET_ROLES', [])
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
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

