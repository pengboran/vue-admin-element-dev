// store的计算属性 获取相应的状态值，且有缓存，当值发生改变时，重新计算
const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  avatar: state => state.user.avatar,
  name: state => state.user.name,
  roles: state => state.user.roles,
  permission_routes: state => state.permission.routes,
  welcome: state => state.user.welcome
}
export default getters
