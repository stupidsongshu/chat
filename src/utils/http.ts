import axios, { AxiosRequestConfig, AxiosResponse, Method } from 'axios'
import qs from 'qs'
import { Message, Loading } from 'element-ui'
import { ElLoadingComponent } from 'element-ui/types/loading'
import router from '@/router'
import { baseURL, getTokenKey } from '@/utils'

type Headers = {
  [key: string]: string
}
interface IHttpOptions {
  method?: Method;
  loading?: boolean;
  headers?: Headers;
  type?: string;
  [index: string]: unknown;
}

interface IParams {
  [key: string]: any
}

interface IHttpConfig {
  url: string;
  params?: IParams;
  options?: IHttpOptions;
}

const axiosInstance = axios.create({
  baseURL
})

const awaitWrap = (promise: Promise<any>) => promise.then((res: any) => [null, res]).catch((err: any) => [err, null])

const http = (httpConfig: IHttpConfig) => new Promise((resolve, reject) => {
  const { url, params = {}, options } = httpConfig
  const method = options?.method || 'POST'
  const loading = options?.loading !== undefined ? options.loading : false

  let loadingInstance: ElLoadingComponent
  if (loading) {
    loadingInstance = Loading.service({
      fullscreen: true
    })
  }

  const userName = router.currentRoute.query.user
  const token = window.localStorage.getItem(getTokenKey(userName as string))
  if (token) {
    params['token'] = token
  }

  const requestConfig: AxiosRequestConfig = {
    method,
    url,
    headers: options?.headers,
    data: options?.type === 'upload' ? params : qs.stringify(params)
  }

  axiosInstance(requestConfig).then((res: AxiosResponse) => {
    // console.log('==res==', url, res)
    if (res.status === 200) {
      if (res.data.code === 0) {
        resolve(res.data)
      } else {
        Message({
          message: res.data.msg || '服务异常，请稍后再试',
          type: 'warning'
        })
        reject(res.data)
      }
    } else {
      Message({
        message: '服务异常，请稍后再试～',
        type: 'error'
      })
      reject(res)
    }
  }).catch((err) => {
    Message({
      message: '服务异常，请稍后再试！',
      type: 'error'
    })
    reject(err)
  }).finally(() => {
    if (loadingInstance) {
      loadingInstance.close()
    }
  })
})

export default (config: IHttpConfig): Promise<any[]> => awaitWrap(http(config))
