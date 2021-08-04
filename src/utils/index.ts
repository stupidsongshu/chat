export const baseURL = 'http://43.132.166.76:8081'

export const getTokenKey = (user: string): string => `token_${user}`

export const getToken = (): (string | null) => {
  const params = getUrlParams(window.location.href)
  const user = params.user
  return window.localStorage.getItem(getTokenKey(user))
}

export const getWsURL = (): string => {
  const token = getToken()
  let url = baseURL + '/ttqk/imserver/' + token
  url = url.replace('https', 'ws').replace('http', 'ws')
  return url
}

// /(https?:\/\/(([a-zA-Z0-9]+-?)?[a-zA-Z0-9]+\.)+[a-zA-Z0-9]+)(:\d+)?(\/[^\?]*\w*)*(\?[^#]*)?(#[a-zA-Z0-9~!@#$%&*-=_+\[\]:;',.?/|]*)?/
// 南方暴雨https://36kr.com/p/1321424454633986来了
export const urlRegExp = /(https?:\/\/(([a-zA-Z0-9]+-?)?[a-zA-Z0-9]+\.)+[a-zA-Z0-9]+)(:\d+)?(\/[^?]*\w*)*(\?[^#]*)?(#[a-zA-Z0-9~!@#$%&*-=_+[\]:;',.?/|]*)?/

export const decodeUnicode = (str: string): string => {
  if (!str) return str
  //先把十六进制unicode编码/u替换为%u
  // str = str.replace(/\\u/gi,'%u')
  //再把页面中反斜杠替换为空
  // str = str.replace(/\\/gi,'')
  str = str.replace(/\\u/g, '%u')
  return unescape(str)
}

interface Params {
  [key: string]: string
}
export const getUrlParams = (originUrl: string): Params => {
  const url = originUrl || window.location.href
  const _pa = url.substring(url.indexOf('?') + 1)
  const _arrS = _pa.split('&')
  const _rs: Params = {}
  for (let i = 0, _len = _arrS.length; i < _len; i++) {
    const pos = _arrS[i].indexOf('=')
    if (pos === -1) {
      continue
    }
    const name = _arrS[i].substring(0, pos)
    _rs[name] = window.decodeURIComponent(_arrS[i].substring(pos + 1))
  }
  return _rs
}
