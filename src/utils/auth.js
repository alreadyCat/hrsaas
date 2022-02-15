import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token'
const TimeStampKey = 'hrsaas-timestamp-key'
export function getToken() { // token
  return Cookies.get(TokenKey)
}

export function setToken(token) { // token
  return Cookies.set(TokenKey, token)
}

export function removeToken() { // token
  return Cookies.remove(TokenKey)
}

export function setTimeStamp() { // timeStamp
  const time = Date.now()
  return Cookies.set(TimeStampKey, time)
}

export function getTimeStamp() { // timeStamp
  return Cookies.get(TimeStampKey)
}
