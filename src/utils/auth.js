import Cookies from 'js-cookie'

const TokenKey = 'vue_admin_template_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLocalSession(name, value) {
  // eslint-disable-next-line eqeqeq
  if (typeof value == 'object') {
    window.localStorage.setItem(name, JSON.stringify(value))
    return
  }
  window.localStorage.setItem(name, value)
}
