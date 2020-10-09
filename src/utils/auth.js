import Cookies from 'js-cookie'

const TokenKey = 'user_token'

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}

export function setLocalStorage(name, value) {
  // eslint-disable-next-line eqeqeq
  if (typeof value == 'object') {
    window.localStorage.setItem(name, JSON.stringify(value))
    return
  }
  window.localStorage.setItem(name, value)
}

export function getLocalStorage(name) {
  return localStorage.getItem(name)
}
