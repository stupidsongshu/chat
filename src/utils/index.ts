export const getTokenKey = (user: string): string => `token_${user}`

// /(https?:\/\/(([a-zA-Z0-9]+-?)?[a-zA-Z0-9]+\.)+[a-zA-Z0-9]+)(:\d+)?(\/[^\?]*\w*)*(\?[^#]*)?(#[a-zA-Z0-9~!@#$%&*-=_+\[\]:;',.?/|]*)?/
// 南方暴雨https://36kr.com/p/1321424454633986来了
export const urlRegExp = /(https?:\/\/(([a-zA-Z0-9]+-?)?[a-zA-Z0-9]+\.)+[a-zA-Z0-9]+)(:\d+)?(\/[^?]*\w*)*(\?[^#]*)?(#[a-zA-Z0-9~!@#$%&*-=_+[\]:;',.?/|]*)?/

// type QueryObject = {
//   [key: string]: any
// }
// export const getUrlParams = (url?: string): QueryObject => {
//   // ?a=1&b=2
//   url = url || window.location.href
//   // a=1&b=2
//   const query = url.split('?')[0]
//   // ['a=1', 'b=2]
//   const list = query
// }

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
    const value = window.decodeURIComponent(_arrS[i].substring(pos + 1))
    _rs[name] = value
  }
  return _rs
}
